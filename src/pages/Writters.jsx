import React from "react";

const Writters = ({ books }) => {
    const writters = Array.from(new Set(books.map(book => book.authors?.writter))).sort();
    const translators = Array.from(
        new Set(
            books.flatMap(book =>
                (book.authors?.translator || "")
                    .split(",")
                    .map(t => t.trim())
                    .filter(Boolean)
            )
        )
    ).sort();

    const allAuthors = Array.from(new Set([...writters, ...translators])).sort();

    if (!allAuthors.length) {
        return <div className="max-w-6xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Writters</h2>
            <p className="text-gray-500">No writters found</p>
        </div>;
    }

    return <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Writters</h2>
        <ul className="pl-5 grid gap-2">
            {allAuthors.map(author => author && (
                <li key={author} className="flex  items-center gap-2"> <div className="shrink-0">
                    <div className="w-8 h-8 rounded-full bg-gray-500/40 flex items-center justify-center text-sm font-semibold text-gray-800 dark:text-gray-200"></div>
                </div>{author}</li>
            ))}
        </ul>
    </div>;
};

export default Writters;
