import sql from "better-sqlite3";

const db = new sql("training.db");

export async function getPosts(maxNumber, filters = {}) {
  let limitClause = "";
  let whereClause = "WHERE 1=1"; // elementary condition for easy access another conditions
  const params = [];

  if (maxNumber) {
    limitClause = "LIMIT ?";
    params.push(maxNumber); // add parameter to end
  }

  if (filters.salary) {
    whereClause += ` AND salary >= ?`;
    params.unshift(filters.salary); // add parameter to beginning
  }

  const stmt = db.prepare(`
    SELECT posts.id, image_url AS image, title, content, created_at AS createdAt, email AS userEmail, location, company, salary, 
           job_contract AS jobContract, seniority, field, languages, technologies, requirements, skills, benefits,
           COUNT(likes.post_id) AS likes,
           EXISTS(SELECT * FROM likes WHERE likes.post_id = posts.id AND likes.user_id = 2) AS isLiked
    FROM posts
    INNER JOIN users ON posts.user_id = users.id
    LEFT JOIN likes ON posts.id = likes.post_id
    GROUP BY posts.id
    ORDER BY createdAt DESC
    ${limitClause}`);

  await new Promise((resolve) => setTimeout(resolve, 1000));
  const posts = stmt.all(...params);

  // ✅ Oprava parsování JSON
  return posts.map((post) => ({
    ...post,
    requirements: post.requirements ? JSON.parse(post.requirements) : [],
    skills: post.skills ? JSON.parse(post.skills) : [],
    benefits: post.benefits ? JSON.parse(post.benefits) : [],
    technologies: post.technologies ? JSON.parse(post.technologies) : [],
    languages: post.languages ? JSON.parse(post.languages) : [],
  }));
}

export async function storePost(post) {
  const stmt = db.prepare(`
    INSERT INTO posts (image_url, title, content, user_id, location, company, salary, job_contract, seniority, field, languages, technologies, requirements, skills, benefits)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return stmt.run(
    post.imageUrl,
    post.title,
    post.content,
    post.userId,
    post.location,
    post.company,
    post.salary,
    post.jobContract,
    post.seniority,
    post.field,
    JSON.stringify(post.languages || []),
    post.technologies ? JSON.stringify(post.technologies) : "[]",
    JSON.stringify(post.requirements || []), //  JSON
    JSON.stringify(post.skills || []),
    JSON.stringify(post.benefits || [])
  );
}

export async function getPostBySlug(slug) {
  const stmt = db.prepare(`
    SELECT posts.id, image_url AS image, title, content, created_at AS createdAt, email AS userEmail, location, company, salary, 
           job_contract AS jobContract, seniority, field, languages, technologies, requirements, skills, benefits
    FROM posts
    INNER JOIN users ON posts.user_id = users.id
    LEFT JOIN likes ON posts.id = likes.post_id
    WHERE posts.id = ? -- Použijeme slug jako ID příspěvku
    GROUP BY posts.id
  `);

  const post = stmt.get(slug);

  if (!post) {
    console.log("❌ Backend - No post found for slug:", slug);
    return null;
  }

  // function for safe parsing JSON
  function safeParse(jsonString) {
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.error("❌ Backend - JSON parse error:", jsonString, error);
      return [];
    }
  }

  const parsedPost = {
    ...post,
    languages: safeParse(post.languages),

    requirements: safeParse(post.requirements),
    technologies: safeParse(post.technologies || "[]"),

    skills: safeParse(post.skills),
    benefits: safeParse(post.benefits),
  };

  return parsedPost;
}
