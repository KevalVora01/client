import React from 'react';

/**
 * Returns a React node with matching search queries highlighted with a <mark> tag.
 * Handles spacing/hyphen variations (e.g. searching "A101" will highlight "A-101").
 */
export const highlightMatch = (text: string, query: string | undefined): React.ReactNode => {
  if (!text) return '';
  if (!query || !query.trim()) return text;

  const cleanQuery = query.replace(/[-\s]/g, '');
  if (!cleanQuery) return text;

  try {
    const parts = cleanQuery.split('').map((char, idx) => {
      const escapedChar = char.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      if (idx < cleanQuery.length - 1) {
        return `${escapedChar}[-\\s]*`;
      }
      return escapedChar;
    });

    const regex = new RegExp(`(${parts.join('')})`, 'gi');
    const splitParts = text.split(regex);

    return (
      <>
        {splitParts.map((part, index) =>
          regex.test(part) ? (
            <mark key={index} className="p-0 bg-warning text-dark rounded-1">{part}</mark>
          ) : (
            part
          )
        )}
      </>
    );
  } catch (e) {
    // Fallback in case of regex error
    return text;
  }
};
