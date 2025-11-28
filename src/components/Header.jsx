import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { IconBook, IconSearch, IconChartBar, IconPlus, IconTarget, IconHeart, IconUsers, IconDownload, IconUpload, IconEye, IconEyeOff } from '@tabler/icons-react'

function Header({ q, setQ, onExport, onImport, onOpenGoals, onOpenWishlist, onOpenLending, isCoverHidden, setIsCoverHidden }) {
    const fileInputRef = useRef(null)
    const [menuOpen, setMenuOpen] = useState(false)

    return (
        <header className="flex items-center justify-between gap-4 p-4 border-b bg-white shadow-sm sticky top-0 z-40">
            <div className="flex items-center gap-4">
                <Link to="/" className="font-bold text-xl text-emerald-700 flex items-center gap-2">
                    <IconBook size={28} />
                    <span>IlmShelf</span>
                </Link>
                <div className="hidden sm:flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border">
                    <IconSearch size={18} className="text-gray-400" />
                    <input
                        value={q}
                        onChange={e => setQ(e.target.value)}
                        placeholder="Search books, authors..."
                        className="bg-transparent outline-none text-sm w-48 md:w-64"
                    />
                </div>
            </div>
            <nav className="flex items-center gap-4">
                <Link to="/" className="text-sm font-medium hover:text-emerald-700 transition-colors hidden md:inline">Books</Link>
                <Link to="/shelves" className="text-sm font-medium hover:text-emerald-700 transition-colors hidden md:inline">Shelves</Link>
                <Link to="/summary" className="text-sm font-medium hover:text-emerald-700 transition-colors flex items-center gap-1">
                    <IconChartBar size={16} />
                    <span className="hidden sm:inline">Summary</span>
                </Link>

                <div className="relative">
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Features"
                    >
                        <IconPlus size={20} />
                    </button>

                    {menuOpen && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-20 py-2">
                                <button
                                    onClick={() => { onOpenGoals(); setMenuOpen(false) }}
                                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                                >
                                    <IconTarget size={16} />
                                    Reading Goals
                                </button>
                                <button
                                    onClick={() => { onOpenWishlist(); setMenuOpen(false) }}
                                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                                >
                                    <IconHeart size={16} />
                                    Wishlist
                                </button>
                                <button
                                    onClick={() => { onOpenLending(); setMenuOpen(false) }}
                                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                                >
                                    <IconUsers size={16} />
                                    Lending Tracker
                                </button>
                                <button
                                    onClick={() => {
                                        setIsCoverHidden(!isCoverHidden);
                                        setMenuOpen(false)
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                                >
                                    {
                                        isCoverHidden ?
                                            <IconEye size={16} /> :
                                            <IconEyeOff size={16} />
                                    }
                                    {
                                        isCoverHidden ?
                                            'Show Covers' :
                                            'Hide Covers'
                                    }
                                </button>
                                <div className="border-t my-2" />
                                <button
                                    onClick={() => { onExport(); setMenuOpen(false) }}
                                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                                >
                                    <IconDownload size={16} />
                                    Export Data
                                </button>
                                <button
                                    onClick={() => { fileInputRef.current?.click(); setMenuOpen(false) }}
                                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                                >
                                    <IconUpload size={16} />
                                    Import Data
                                </button>
                            </div>
                        </>
                    )}
                </div>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={onImport}
                    className="hidden"
                />
            </nav>
        </header>
    )
}

export default Header;