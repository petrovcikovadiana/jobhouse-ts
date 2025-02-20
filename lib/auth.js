import { Lucia } from "lucia";
import { BetterSqlite3Adapter } from "@lucia-auth/adapter-sqlite";
import { cookies } from "next/headers";
import { getUserById } from "./user";

import db from "./db";
import { redirect } from "next/navigation";

// create new adapter object
const adapter = new BetterSqlite3Adapter(db, {
  // what tablename of your  users database table will be
  user: "users",
  session: "sessions",
});

// where and how to store the user data
const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: { secure: process.env.NODE_ENV === "production" },
  },
});

// create and store a new session
export async function createAuthSession(userId) {
  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  const cookieStore = cookies();

  cookieStore.set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
}

// check if the user is authenticated

export async function verifyAuth() {
  console.log("Checking session...");
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get(lucia.sessionCookieName);

  if (!sessionCookie) {
    console.log("No session cookie found.");
    return { user: null, session: null };
  }

  const sessionId = sessionCookie.value;
  if (!sessionId) {
    console.log("Session cookie is empty.");
    return { user: null, session: null };
  }

  const result = await lucia.validateSession(sessionId);

  if (!result.session) {
    console.log("Invalid session.");
    return { user: null, session: null };
  }

  console.log("Valid session found:", result.session);

  const userId = parseInt(result.session.userId, 10);

  if (isNaN(userId)) {
    console.log("Invalid userId:", result.session.userId);
    return { user: null, session: null };
  }

  const user = db
    .prepare("SELECT id, email, role FROM users WHERE id = ?")
    .get(userId);

  if (!user) {
    console.log("User not found in database.");
    return { user: null, session: null };
  }

  console.log("Authenticated user:", user);
  return { user, session: result.session };
}

export async function destroySession() {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get(lucia.sessionCookieName);

  if (!sessionCookie) {
    return { success: false, message: "No session found" };
  }

  const sessionId = sessionCookie.value;

  await lucia.invalidateSession(sessionId);

  // delete cookie
  const blankSessionCookie = lucia.createBlankSessionCookie();
  cookieStore.set(
    blankSessionCookie.name,
    blankSessionCookie.value,
    blankSessionCookie.attributes
  );

  redirect("/");
}
