import React from 'react';

interface HighlightTextProps {
  text?: string | number | null;
  highlight?: string;
  className?: string;
}

export const HighlightText: React.FC<HighlightTextProps> = ({ text, highlight, className = '' }) => {
  if (text == null) return null;
  const str = String(text);
  if (!highlight || !highlight.trim()) {
    return <span className={className}>{str}</span>;
  }

  const searchTrimmed = highlight.trim();
  const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapeRegExp(searchTrimmed)})`, 'gi');
  const parts = str.split(regex);

  return (
    <span className={className}>
      {parts.map((part, index) =>
        part.toLowerCase() === searchTrimmed.toLowerCase() ? (
          <mark
            key={index}
            style={{
              backgroundColor: '#fef08a',
              color: '#854d0e',
              padding: '0 2px',
              borderRadius: '2px',
              fontWeight: 600,
            }}
          >
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </span>
  );
};

export default HighlightText;
