import React from "react";


export default function Pagination({ page, setPage }) {
  return (
    <div>
      <button
        onClick={() => setPage((prev) => Math.max(0, prev - 1))}
        disabled={page === 0}
      >
        Previous
      </button>
      <span>Page {page + 1}</span>
      <button onClick={() => setPage((prev) => prev + 1)}>Next</button>
    </div>
  );
}
