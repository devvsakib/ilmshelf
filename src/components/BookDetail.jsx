import { useParams, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { IconEdit, IconTrash, IconShare, IconEye, IconEyeOff } from "@tabler/icons-react";

function BookDetail({ books, setBooks, deleteBook, openEdit }) {
    const { id } = useParams()
    const navigate = useNavigate()
    const book = books.find(x => x.id === id)

    if (!book) {
        return (
            <div className="p-6 text-center">
                <IconBook size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">Book not found</p>
                <button
                    onClick={() => navigate('/')}
                    className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg"
                >
                    Go Home
                </button>
            </div>
        )
    }

    const updateStatus = (status) => {
        setBooks(prev => prev.map(x => x.id === book.id ? { ...x, readStatus: status } : x))
    }

    const togglePrivacy = () => {
        setBooks(prev => prev.map(x => x.id === book.id ? { ...x, private: !x.private } : x))
    }

    const share = async () => {
        const url = `${window.location.origin}/book/${book.id}`
        const shareData = {
            title: book.title.bn,
            text: `Check out "${book.title.bn}" on IlmShelf`,
            url
        }

        try {
            if (navigator.share && navigator.canShare(shareData)) {
                await navigator.share(shareData)
            } else {
                await navigator.clipboard.writeText(url)
                alert('Link copied to clipboard!')
            }
        } catch (err) {
            console.error('Error sharing:', err)
        }
    }

    return (
        <div className="max-w-5xl mx-auto p-6">
            <button
                onClick={() => navigate(-1)}
                className="mb-4 text-sm text-emerald-700 hover:underline"
            >
                ← Back
            </button>

            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="grid md:grid-cols-[200px,1fr] gap-6">
                    <div>
                        <img
                            src={book.cover}
                            alt={book.title.bn}
                            className="w-full rounded-lg shadow-md"
                            onError={(e) => {
                                e.target.src = `https://via.placeholder.com/200x300/059669/ffffff?text=${encodeURIComponent(book.title.bn.slice(0, 3))}`
                            }}
                        />
                    </div>

                    <div>
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900">{book.title.bn}</h1>
                                {book.title.en && (
                                    <p className="text-lg text-slate-600 mt-1">{book.title.en}</p>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => openEdit(book.id)}
                                    className="p-2 border rounded-lg hover:bg-gray-50 transition-colors"
                                    title="Edit"
                                >
                                    <IconEdit size={18} />
                                </button>
                                <button
                                    onClick={() => {
                                        if (confirm('Are you sure you want to delete this book?')) {
                                            deleteBook(book.id)
                                            navigate('/')
                                        }
                                    }}
                                    className="p-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                                    title="Delete"
                                >
                                    <IconTrash size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-3 mb-6">
                            {book.authors?.writter && (
                                <div className="flex items-center gap-2 text-slate-700">
                                    <span className="font-medium">লেখক:</span>
                                    <span>{book.authors.writter}</span>
                                </div>
                            )}
                            {book.authors?.translator && (
                                <div className="flex items-center gap-2 text-slate-700">
                                    <span className="font-medium">অনুবাদক:</span>
                                    <span>{book.authors.translator}</span>
                                </div>
                            )}
                            {book.authors?.publisher && (
                                <div className="flex items-center gap-2 text-slate-700">
                                    <span className="font-medium">প্রকাশক:</span>
                                    <span>{book.authors.publisher}</span>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-emerald-50 rounded-lg p-3">
                                <div className="text-xs text-emerald-600 font-medium">Price</div>
                                <div className="text-xl font-bold text-emerald-700">{book.price} ৳</div>
                            </div>
                            {book.pages > 0 && (
                                <div className="bg-blue-50 rounded-lg p-3">
                                    <div className="text-xs text-blue-600 font-medium">Pages</div>
                                    <div className="text-xl font-bold text-blue-700">{book.pages}</div>
                                </div>
                            )}
                            {book.publishedYear && (
                                <div className="bg-purple-50 rounded-lg p-3">
                                    <div className="text-xs text-purple-600 font-medium">Year</div>
                                    <div className="text-xl font-bold text-purple-700">{book.publishedYear}</div>
                                </div>
                            )}
                            {book.isbn && (
                                <div className="bg-orange-50 rounded-lg p-3">
                                    <div className="text-xs text-orange-600 font-medium">ISBN</div>
                                    <div className="text-sm font-bold text-orange-700">{book.isbn}</div>
                                </div>
                            )}
                        </div>

                        <div className="grid md:grid-cols-3 gap-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">Reading Status</label>
                                <select
                                    value={book.readStatus}
                                    onChange={e => updateStatus(e.target.value)}
                                    className="w-full p-2 border rounded-lg"
                                >
                                    <option value="NOT_STARTED">Not Started</option>
                                    <option value="IN_PROGRESS">In Progress</option>
                                    <option value="COMPLETED">Completed</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Privacy</label>
                                <button
                                    onClick={togglePrivacy}
                                    className={`w-full p-2 border rounded-lg flex items-center justify-center gap-2 transition-colors ${book.private ? 'bg-gray-100 border-gray-300' : 'bg-emerald-50 border-emerald-300'
                                        }`}
                                >
                                    {book.private ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                                    {book.private ? 'Private' : 'Public'}
                                </button>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Share</label>
                                <button
                                    onClick={share}
                                    className="w-full p-2 border rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
                                >
                                    <IconShare size={18} />
                                    Share Book
                                </button>
                            </div>
                        </div>

                        {book.description && (
                            <div className="mb-6">
                                <h3 className="font-semibold mb-2">Description</h3>
                                <p className="text-slate-700 bg-gray-50 p-4 rounded-lg">{book.description}</p>
                            </div>
                        )}

                        {book.notes && (
                            <div>
                                <h3 className="font-semibold mb-2">Personal Notes</h3>
                                <p className="text-slate-700 bg-amber-50 p-4 rounded-lg border border-amber-200">{book.notes}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BookDetail;