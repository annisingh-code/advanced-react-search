// Feed.jsx
import React from "react";
export default function Feed({ posts, loading, error }) {
  if (loading) return <p>Loading posts...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>
          <strong>
            {post.id}. {post.title}
          </strong>
          <p>{post.body}</p>
        </li>
      ))}
    </ul>
  );
}
