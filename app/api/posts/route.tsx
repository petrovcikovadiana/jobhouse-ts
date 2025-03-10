import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface FilterBody {
  location?: string[];
  salary?: number;
  jobContract?: string[];
  seniority?: string[];
  field?: string[];
  languages?: string[];
  technologies?: string[];
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: FilterBody = await request.json();
    const {
      location = [],
      salary,
      jobContract = [],
      seniority = [],
      field = [],
      languages = [],
      technologies = [],
    } = body;

    let whereClause = "1=1";
    const params: (string | number)[] = [];

    // filter by location
    if (location.length > 0) {
      const placeholders = location.map(() => "?").join(", ");
      whereClause += ` AND location IN (${placeholders})`;
      params.push(...location);
    }

    if (salary) {
      whereClause += " AND salary >= ?";
      params.push(salary);
    }

    if (jobContract.length > 0) {
      const placeholders = jobContract.map(() => "?").join(", ");
      whereClause += ` AND job_contract IN (${placeholders})`;
      params.push(...jobContract);
    }

    if (seniority.length > 0) {
      const placeholders = seniority.map(() => "?").join(", ");
      whereClause += ` AND seniority IN (${placeholders})`;
      params.push(...seniority);
    }

    if (field.length > 0) {
      const placeholders = field.map(() => "?").join(", ");
      whereClause += ` AND field IN (${placeholders})`;
      params.push(...field);
    }

    if (languages.length > 0) {
      const placeholders = languages.map(() => "?").join(", ");
      whereClause += ` AND languages LIKE '%' || ? || '%'`;
      params.push(...languages);
    }

    if (technologies.length > 0) {
      const placeholders = technologies.map(() => "?").join(", ");
      whereClause += ` AND technologies LIKE '%' || ? || '%'`;
      params.push(...technologies);
    }
    const stmt = db.prepare(`
    SELECT posts.id, image_url AS image, title, content, created_at AS createdAt, email AS userEmail, location, company, salary, job_contract AS jobContract, seniority, field, languages, technologies,
    COUNT(likes.post_id) AS likes,
    EXISTS(SELECT * FROM likes WHERE likes.post_id = posts.id AND likes.user_id = 2) AS isLiked
    FROM posts
    INNER JOIN users ON posts.user_id = users.id
    LEFT JOIN likes ON posts.id = likes.post_id
    WHERE ${whereClause}
    GROUP BY posts.id
    ORDER BY createdAt DESC
  `);

    const posts: (string | number)[] = stmt.all(...params); // `any[]` můžeš nahradit konkrétním typem

    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error("Database query error:", error);
    return NextResponse.json(
      { error: "Database query failed" },
      { status: 500 }
    );
  }
}
