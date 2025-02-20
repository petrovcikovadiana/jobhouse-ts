import db from "@/lib/db";

export async function GET(req, context) {
  const params = await context.params;
  const { slug } = params;

  // getting detail of post
  const post = db
    .prepare(
      `
    SELECT posts.*, users.email
    FROM posts
    INNER JOIN users ON posts.user_id = users.id
    WHERE posts.id = ?
  `
    )
    .get(slug);

  if (!post) {
    return new Response(JSON.stringify({ error: "Post not found" }), {
      status: 404,
    });
  }

  function safeParse(jsonString) {
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.error("❌ JSON parse error:", error);
      return [];
    }
  }

  post.requirements = safeParse(post.requirements);
  post.skills = safeParse(post.skills);
  post.benefits = safeParse(post.benefits);
  post.languages = safeParse(post.languages);

  // getting job seekers applies
  const applicants = db
    .prepare(
      `
    SELECT users.id, users.email, job_seeker_profiles.full_name, job_seeker_profiles.cv_url
    FROM applications
    INNER JOIN users ON applications.user_id = users.id
    LEFT JOIN job_seeker_profiles ON users.id = job_seeker_profiles.user_id
    WHERE applications.post_id = ?
  `
    )
    .all(slug);

  // validation, if logged user applied already
  const alreadyApplied =
    db
      .prepare(
        `
    SELECT COUNT(*) AS count FROM applications WHERE post_id = ? AND user_id = ?
  `
      )
      .get(slug, req.headers.get("userId"))?.count > 0;

  return new Response(JSON.stringify({ post, applicants, alreadyApplied }), {
    status: 200,
  });
}
