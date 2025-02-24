"use server";

import { createUser } from "@/lib/user";
import { hashUserPassword } from "@/lib/hash";
import { redirect } from "next/navigation";
import { createAuthSession } from "@/lib/auth";
import { getUserByEmail } from "@/lib/user";
import { verifyPassword } from "@/lib/hash";

export async function signup(prevState, formData) {
  // get data from form
  const email = formData.get("email");
  const name = formData.get("name");
  const password = formData.get("password");
  const role = formData.get("role");

  // validate email and password

  let errors = {};

  if (!email.includes("@")) {
    errors.email = "Please enter a valid email address.";
  }
  if (password.trim().length < 8) {
    errors.password = "Password must be at least 8 characters long.";
  }
  if (!["employer", "job_seeker"].includes(role)) {
    errors.role = "Invalid role selected.";
  }
  // if something missing from 2 checks above, error
  if (Object.keys(errors).length > 0) {
    return {
      errors,
    };
  }
  // hash password with function hashUserPassword
  const hashedPassword = hashUserPassword(password);
  try {
    // save user to database
    const id = await createUser(email, name, hashedPassword, role);
    // after create user, calling createAuthSession, which make login
    await createAuthSession(id);
    // after succesfull login, redirect
    redirect("/");
  } catch (error) {
    // if email existing, error
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return {
        errors: {
          email: "It seems like you already have an account. Please login.",
        },
      };
    }
    throw error;
  }
}

export async function login(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  const existingUser = getUserByEmail(email);
  if (!existingUser) {
    return {
      errors: { email: "Invalid credentials." },
    };
  }

  const isValidPassword = verifyPassword(existingUser.password, password);
  if (!isValidPassword) {
    return {
      errors: { password: "Invalid credentials." },
    };
  }

  // create session
  await createAuthSession(existingUser.id);

  // get user and save it to usercontext
  return {
    success: true,
    user: {
      id: existingUser.id,
      name: existingUser.name,
      role: existingUser.role,
      email: existingUser.email,
    },
  };
}

export async function auth(mode, prevState, formData) {
  if (mode === "login") {
    return login(prevState, formData);
  }
  return signup(prevState, formData);
}
