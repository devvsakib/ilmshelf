import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import { IconBook } from '@tabler/icons-react'

function ShelvesPage({ shelves, books }) {
  const navigate = useNavigate()

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-emerald-800 mb-6">My Shelves</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shelves.map(shelf => {
          const shelfBooks = books.filter(b => b.shelfId === shelf.id)
          const total = shelfBooks.reduce((sum, b) => sum + (b.price || 0), 0)

          return (
            <motion.div
              key={shelf.id}
              whileHover={{ y: -4 }}
              className="bg-white border-2 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all cursor-pointer"
              onClick={() => navigate(`/shelf/${shelf.id}`)}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{shelf.name}</h2>
                  <p className="text-sm text-slate-600">{shelf.description}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg bg-${shelf.color}-100 flex items-center justify-center`}>
                  <IconBook size={24} className={`text-${shelf.color}-600`} />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <div className="text-2xl font-bold text-slate-900">{shelfBooks.length}</div>
                  <div className="text-xs text-slate-600">Books</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-emerald-600">{total} ৳</div>
                  <div className="text-xs text-slate-600">Total Value</div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

export default ShelvesPage;