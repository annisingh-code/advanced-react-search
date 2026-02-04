import React, { useState, useEffect } from "react";
import Pagination from "../components/Pagination";
import Feed from "../components/Feed";

const PAGE_SIZE = 10;

/**
 * Fuzzy Search Algorithm (Two-Pointer Technique)
 * Checks if the characters of 'pattern' appear in 'text' in the correct order.
 * * @param {string} text - The main text to search inside (e.g., Post Title)
 * @param {string} pattern - The user's search query (e.g., "sct")
 * @returns {boolean} - True if pattern sequence exists in text
 */
function isFuzzyMatch(text, pattern) {
  // GUARD CLAUSE: If search is empty, everything is a match.
  // Optimization: Prevents running the loop unnecessarily.
  if (!pattern) return true; 

  pattern = pattern.toLowerCase();
  text = text.toLowerCase();
  
  let patternIndex = 0; // Pointer for the search term
  
  // Loop through every character of the main text
  for (let char of text) {
    // If characters match, move the pattern pointer forward
    if (char === pattern[patternIndex]) {
      patternIndex++;
    }
    // SUCCESS CONDITION: If we have matched every character in the pattern
    if (patternIndex === pattern.length) return true;
  }
  
  // If the loop finishes and we haven't matched the full pattern
  return false;
}

function App() {
  // --- STATE MANAGEMENT ---
  const [posts, setPosts] = useState([]); 
  const [page, setPage] = useState(0); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Search States
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [mode, setMode] = useState("title"); // Options: 'title', 'full', 'fuzzy'

  // --- EFFECT 1: DATA FETCHING ---
  // Triggers whenever 'page' changes.
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Calculate offset for pagination
        const start = page * PAGE_SIZE;
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/posts?_start=${start}&_limit=${PAGE_SIZE}`
        );
        
        if (!response.ok) throw new Error("Failed to fetch posts");
        
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page]); 

  // --- EFFECT 2: DEBOUNCING ---
  // Delays the search execution by 400ms to prevent lag while typing.
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    // CLEANUP: Clears the timer if the user types again before 400ms
    return () => clearTimeout(timer);
  }, [search]);

  // --- FILTER LOGIC (THE GATEKEEPER) ---
  const filteredPosts = posts.filter((post) => {
    const lowerSearch = debouncedSearch.toLowerCase();
    const title = post.title.toLowerCase();
    const body = post.body.toLowerCase();

    // SWITCH: Strategy Pattern to handle different search modes
    switch (mode) {
      case "full":
        // Checks both title AND body content
        return title.includes(lowerSearch) || body.includes(lowerSearch);

      case "fuzzy":
        // Uses our custom two-pointer algorithm
        // Note: Arguments are (Big Text, Small Pattern)
        return isFuzzyMatch(title, lowerSearch);

      case "title":
      default:
        // Default behavior: Simple substring match on title
        return title.includes(lowerSearch);
    }
  });

  // --- RENDER ---
  return (
    <div className="app" style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Blog Posts</h1>
      
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: "8px", width: "300px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        
        {/* Mode Selector Dropdown */}
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          style={{ padding: "8px", borderRadius: "4px" }}
        >
          <option value="title">Title Only</option>
          <option value="full">Full Text (Title + Body)</option>
          <option value="fuzzy">Fuzzy Search (Smart Match)</option>
        </select>
      </div>

      <Feed posts={filteredPosts} loading={loading} error={error} />
      <Pagination page={page} setPage={setPage} />
    </div>
  );
}

export default App;