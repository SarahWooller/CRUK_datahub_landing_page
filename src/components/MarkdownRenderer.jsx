import React from 'react';

export const parseInline = (text) => {
    if (!text) return null;

    // Updated regex: match double symbols (bold) before single symbols (italics)
    const parts = text.split(/(\*\*.*?\*\*|__.*?__|\*.*?\*|_.*?_|\[.*?\]\(.*?\))/g);

    return parts.map((part, i) => {
        if (!part) return null;

        // 1. Bold handling (** or __)
        // Checked first to ensure double symbols aren't captured by italic logic
        if ((part.startsWith('**') && part.endsWith('**')) ||
            (part.startsWith('__') && part.endsWith('__'))) {
            return (
                <strong key={i} className="font-bold text-gray-900">
                    {parseInline(part.slice(2, -2))}
                </strong>
            );
        }

        // 2. Italic handling (* or _)
        // Handles single asterisk syntax like *Sample Handling Summary*
        if ((part.startsWith('*') && part.endsWith('*')) ||
            (part.startsWith('_') && part.endsWith('_'))) {
            return (
                <em key={i} className="italic text-gray-800">
                    {parseInline(part.slice(1, -1))}
                </em>
            );
        }

        // 3. Link handling
        if (part.startsWith('[') && part.includes('](')) {
            const match = part.match(/\[(.*?)\]\((.*?)\)/);
            if (match) {
                return (
                    <a key={i} href={match[2]} target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-medium hover:underline">
                        {parseInline(match[1])}
                    </a>
                );
            }
        }

        return part;
    });
};

/**
 * Robust Markdown Renderer for tables, headers, lists, and rich text[cite: 8, 9].
 */
export const MarkdownRenderer = ({ content }) => {
    if (!content) return null;

    const rawLines = content.replace(/\\n/g, '\n').split('\n');
    const blocks = [];
    let currentTable = null;

    // Block Grouping Logic[cite: 8]
    rawLines.forEach((line) => {
        const trimmed = line.trim();

        if (trimmed.startsWith('|')) {
            if (!currentTable) currentTable = [];
            currentTable.push(trimmed);
        } else {
            if (currentTable) {
                blocks.push({ type: 'table', rows: currentTable });
                currentTable = null;
            }
            if (trimmed) blocks.push({ type: 'text', content: trimmed });
            else blocks.push({ type: 'space' });
        }
    });
    if (currentTable) blocks.push({ type: 'table', rows: currentTable });

    const getCells = (line) => {
        let cells = line.split('|');
        if (line.startsWith('|')) cells.shift();
        if (line.endsWith('|')) cells.pop();
        return cells.map(c => c.trim());
    };

    return (
        <div className="markdown-output space-y-3 text-sm text-gray-700 w-full overflow-x-auto">
            {blocks.map((block, idx) => {
                if (block.type === 'space') return <div key={idx} className="h-1" />;

                if (block.type === 'table') {
                    const separatorIdx = block.rows.findIndex(r => /^\|?[:\s- |]+\|?$/.test(r) && r.includes('-'));
                    const hasHeader = separatorIdx === 1;
                    const dataLines = block.rows.filter((_, i) => i !== separatorIdx);

                    return (
                        <table key={idx} className="min-w-full border-collapse border border-gray-200 my-4 bg-white rounded-lg shadow-sm">
                            <thead>
                                {hasHeader && (
                                    <tr className="bg-gray-100">
                                        {getCells(dataLines[0]).map((cell, i) => (
                                            <th key={i} className="border border-gray-200 p-3 text-left font-extrabold text-gray-900">
                                                {parseInline(cell)}
                                            </th>
                                        ))}
                                    </tr>
                                )}
                            </thead>
                            <tbody>
                                {dataLines.slice(hasHeader ? 1 : 0).map((row, i) => (
                                    <tr key={i} className="hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0">
                                        {getCells(row).map((cell, j) => (
                                            <td key={j} className="border border-gray-200 p-3 text-gray-700 leading-relaxed">
                                                {parseInline(cell)}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    );
                }

                const { content } = block;
                if (content.startsWith('#')) {
                    const level = (content.match(/^#+/) || ['#'])[0].length;
                    const text = content.replace(/^#+\s*/, '');
                    const sizeClass = level === 1 ? 'text-2xl' : level === 2 ? 'text-xl' : 'text-lg';
                    return <h4 key={idx} className={`${sizeClass} font-bold text-blue-900 mt-6 mb-2 border-b pb-1 border-gray-100`}>{parseInline(text)}</h4>;
                }

                if (content.startsWith('* ') || content.startsWith('- ')) {
                    return (
                        <div key={idx} className="flex items-start gap-3 ml-2">
                            <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                            <span className="leading-relaxed">{parseInline(content.replace(/^[*|-]\s*/, ''))}</span>
                        </div>
                    );
                }

                return <p key={idx} className="leading-relaxed">{parseInline(content)}</p>;
            })}
        </div>
    );
};