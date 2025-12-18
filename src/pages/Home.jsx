import BookList from "@/components/BookList";
import { IconPlus } from "@tabler/icons-react";

function Home({ filteredBooks, isCoverHidden, setIsAddingBook }) {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Books</h1>
          <p className="text-slate-600 mt-1">
            {filteredBooks?.length} {filteredBooks?.length === 1 ? 'book' : 'books'} in collection
          </p>
        </div>
        <button
          onClick={() => setIsAddingBook(true)}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-md"
        >
          <IconPlus size={20} />
          Add Book
        </button>
      </div>
      <BookList
        books={filteredBooks}
        onOpen={(id) => window.location.href = `/book/${id}`}
        isCoverHidden={isCoverHidden}
      />

      <footer>
        <p className="text-center text-sm text-slate-500 mt-12 mb-6">
          &copy; {new Date().getFullYear()} ILMShelf. All rights reserved. |
          <a className="ml-1" href="https://github.com/devvsakib/ilmshelf" target="_blank" rel="noopener noreferrer">GitHub</a> |
          <a className="ml-1" href="https://devvsakib.vercel.app" target="_blank" rel="noopener noreferrer">Developed By Sakib Ahmed</a>
        </p>
      </footer>
    </div>
  )
}
export default Home;