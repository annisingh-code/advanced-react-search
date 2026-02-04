# Advanced Search Pattern (Fuzzy + Debounce)

## 🎯 Goal

To implement a robust client-side search feature that goes beyond simple text matching. This pattern handles typo-tolerance (Fuzzy Search), performance optimization (Debouncing), and flexible search modes.

## 🛠 Features implemented

1.  **Search Modes (Strategy Pattern):**
    - **Title Only:** Standard substring match.
    - **Full Text:** Searches both Title and Body content.
    - **Fuzzy Search:** "Smart match" that handles non-contiguous characters (e.g., "sct" matches "Society").
2.  **Debouncing:** Delays the search execution by 400ms to prevent UI freezing while typing.
3.  **Pagination:** Server-side pagination (`_start` & `_limit`) combined with client-side filtering.

---

## 🧠 Key Algorithms

### 1. Fuzzy Match (Two-Pointer Technique)

Instead of using complex Regular Expressions, we use a **Two-Pointer** approach to check if characters exist in sequence.

**How it works:**

- **Pointer A** scans the main text (Title).
- **Pointer B** scans the search term (Pattern).
- If characters match, Pointer B moves forward.
- If Pointer B reaches the end of the pattern, it's a match.

**Time Complexity:** $O(N)$ (Linear scan of the text).

```javascript
function isFuzzyMatch(text, pattern) {
  if (!pattern) return true; // Guard Clause
  let patternIndex = 0;
  for (let char of text) {
    if (char === pattern[patternIndex]) {
      patternIndex++;
    }
    if (patternIndex === pattern.length) return true;
  }
  return false;
}
```
