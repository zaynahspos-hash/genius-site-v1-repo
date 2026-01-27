
import React from 'react';
import { Bold, Italic, List, Link as LinkIcon, Code, Heading1, Heading2, Quote } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  height?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, className = '', height = 'h-64' }) => {
  const insertTag = (tag: string, endTag?: string) => {
    // Generate unique ID for this instance if possible, or use ref
    const textarea = document.activeElement as HTMLTextAreaElement;
    if (!textarea || textarea.tagName !== 'TEXTAREA') return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const before = text.substring(0, start);
    const selection = text.substring(start, end);
    const after = text.substring(end);

    const insertion = endTag ? `${tag}${selection}${endTag}` : `${tag}${selection}`;
    const newValue = before + insertion + after;
    
    onChange(newValue);
    
    // Defer focus restore
    setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + tag.length, start + tag.length + selection.length);
    }, 0);
  };

  const toolbarItems = [
    { icon: Bold, action: () => insertTag('<strong>', '</strong>'), title: 'Bold' },
    { icon: Italic, action: () => insertTag('<em>', '</em>'), title: 'Italic' },
    { icon: Heading1, action: () => insertTag('<h2>', '</h2>'), title: 'Heading 2' },
    { icon: Heading2, action: () => insertTag('<h3>', '</h3>'), title: 'Heading 3' },
    { icon: List, action: () => insertTag('<ul>\n  <li>', '</li>\n</ul>'), title: 'List' },
    { icon: Quote, action: () => insertTag('<blockquote>', '</blockquote>'), title: 'Quote' },
    { icon: Code, action: () => insertTag('<pre><code>', '</code></pre>'), title: 'Code' },
    { icon: LinkIcon, action: () => {
        const url = prompt('Enter URL:');
        if(url) insertTag(`<a href="${url}">`, '</a>');
    }, title: 'Link' },
  ];

  return (
    <div className={`border border-gray-300 rounded-lg overflow-hidden bg-white ${className}`}>
      <div className="flex flex-wrap gap-1 p-2 border-b border-gray-200 bg-gray-50">
        {toolbarItems.map((item, idx) => (
          <button
            key={idx}
            type="button"
            onMouseDown={(e) => { e.preventDefault(); item.action(); }} // Use onMouseDown to prevent focus loss
            className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-200 rounded transition-colors"
            title={item.title}
          >
            <item.icon size={16} />
          </button>
        ))}
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full p-4 outline-none resize-y font-mono text-sm ${height} focus:bg-gray-50 transition-colors`}
        placeholder="Write description here... (HTML supported)"
      />
    </div>
  );
};
