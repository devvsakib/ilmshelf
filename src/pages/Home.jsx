import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";

function Home({ books, shelves, totalCost }) {
  return (
    <div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Your Books ({books.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {books.map(book => (
              <Card key={book.id} className="p-4">
                <CardContent className="flex gap-4 items-start">
                  <img src={book.cover} alt={book.title.bn || book.title.en} className="w-20 h-28 object-cover rounded" />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold">{book.title.bn}</div>
                        <div className="text-sm text-slate-600">{book.authors?.writter}</div>
                      </div>
                      <div className="text-sm">৳{book.price}</div>
                    </div>
                    <div className="mt-2 text-xs flex gap-2">
                      <div className="px-2 py-1 rounded bg-slate-100">{book.readStatus.replace('_', ' ')}</div>
                      <div className="px-2 py-1 rounded bg-slate-100">{book.private ? 'Private' : 'Public'}</div>
                    </div>
                  </div>
                </CardContent>
                <div className="flex justify-end mt-3">
                  <Link to={`/book/${book.id}`} className="text-sm underline">Details</Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
        <aside className="space-y-4">
          <Card>
            <CardContent>
              <div className="text-sm text-slate-600">Shelves</div>
              <div className="mt-2 flex flex-col gap-2">
                {shelves.map(s => <Link key={s.id} to={`/shelf/${s.id}`} className="text-emerald-700">{s.name}</Link>)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="text-sm text-slate-600">Total Spent</div>
              <div className="text-2xl font-bold">৳{totalCost}</div>
            </CardContent>
          </Card>
        </aside>
      </motion.div>
    </div>
  )
}
export default Home;