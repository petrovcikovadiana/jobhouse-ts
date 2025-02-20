import sql from "better-sqlite3";

const db = sql("training.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    email TEXT UNIQUE,
    name TEXT,
    password TEXT,
    role TEXT CHECK(role IN ('employer', 'job_seeker')) NOT NULL
  );
`);

db.exec(`CREATE TABLE IF NOT EXISTS sessions (
  id TEXT NOT NULL PRIMARY KEY,
  expires_at INTEGER NOT NULL,
  user_id TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
)`);

db.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY, 
    image_url TEXT NOT NULL,
    title TEXT NOT NULL, 
    content TEXT NOT NULL, 
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    user_id INTEGER,
    location TEXT,
    company TEXT,
    salary INTEGER,
    job_contract TEXT,
      field TEXT,
      seniority TEXT,
        languages TEXT,
           technologies TEXT,
    requirements TEXT,  -- ✅ JSON pro náplň práce
    skills TEXT,  -- ✅ JSON pro dovednosti/kvalifikace
    benefits TEXT,  -- ✅ JSON pro benefity
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  )`);
db.exec(`
  CREATE TABLE IF NOT EXISTS likes (
    user_id INTEGER, 
    post_id INTEGER, 
    PRIMARY KEY(user_id, post_id),
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE, 
    FOREIGN KEY(post_id) REFERENCES posts(id) ON DELETE CASCADE
  )`);

db.exec(`
    CREATE TABLE IF NOT EXISTS job_seeker_profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE NOT NULL,
      full_name TEXT NOT NULL,
      cv_url TEXT, 
      bio TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

db.exec(`
    CREATE TABLE IF NOT EXISTS applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      post_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      applied_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

export default db;
