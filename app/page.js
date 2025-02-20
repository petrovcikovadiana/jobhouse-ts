"use client";

import { useEffect, useState } from "react";
import Posts from "@/components/posts";
import Filter from "@/components/filter";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);

  useEffect(() => {
    const fetchAllPosts = async () => {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      if (response.ok) {
        const data = await response.json();
        setPosts(data);
        setFilteredPosts(data);
      }
    };

    fetchAllPosts();
  }, []);

  const fetchFilteredPosts = async (filters) => {
    const response = await fetch("/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(filters),
    });

    if (response.ok) {
      const data = await response.json();
      setFilteredPosts(data);
    }
  };

  return (
    <>
      <div className="home-layout">
        {" "}
        <div className="filters">
          {" "}
          <Filter onApply={fetchFilteredPosts} />
        </div>
        <div className="posts">
          {filteredPosts.length > 0 ? (
            <Posts posts={filteredPosts} />
          ) : (
            <p>No posts found for the selected filters.</p>
          )}
        </div>
      </div>
    </>
  );
}
