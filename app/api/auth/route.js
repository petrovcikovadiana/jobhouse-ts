import { verifyAuth } from "@/lib/auth";

export async function GET() {
  console.log("Verifying auth..."); // Debugging
  const { user } = await verifyAuth();

  if (!user) {
    console.log("Unauthorized access."); // Debugging
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  console.log("Authenticated user:", user); // Debugging
  return new Response(JSON.stringify({ role: user.role, email: user.email }), {
    status: 200,
  });
}
