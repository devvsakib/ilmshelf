import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
    IconBook,
    IconSearch,
    IconChartBar,
    IconPlus,
    IconTarget,
    IconHeart,
    IconUsers,
    IconDownload,
    IconUpload,
    IconEye,
    IconEyeOff,
    IconMenu,
    IconX,
} from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

// Keep the component signature and all functions/props unchanged
export default function Header({ q, setQ, onExport, onImport, onOpenGoals, onOpenWishlist, onOpenLending, isCoverHidden, setIsCoverHidden }) {
    const fileInputRef = useRef(null)
    const [menuOpen, setMenuOpen] = useState(false)

    return (
        <header className="sticky top-0 z-40 bg-white border-b shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 gap-4">

                    {/* left: brand + search (search collapses into sheet on mobile) */}
                    <div className="flex items-center gap-4 min-w-0">
                        <Link to="/" className="flex items-center gap-2 text-emerald-700 font-bold text-lg shrink-0">
                            <IconBook size={26} />
                            <span className="hidden sm:inline">IlmShelf</span>
                        </Link>

                        {/* Desktop Search */}
                        <div className="hidden sm:flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border">
                            <IconSearch size={18} className="text-gray-400" />
                            <Input
                                value={q}
                                onChange={e => setQ(e.target.value)}
                                placeholder="Search books, authors..."
                                className="bg-transparent border-0 p-0 focus:ring-0 w-48 md:w-64 text-sm"
                            />
                        </div>

                        {/* Mobile search trigger (opens sheet) */}
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="sm:hidden">
                                    <IconSearch />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="top" className="p-4 [&>button]:hidden">
                                <Input
                                    value={q}
                                    onChange={e => setQ(e.target.value)}
                                    placeholder="Search books, authors..."
                                    className="w-full"
                                    autoFocus
                                />
                            </SheetContent>
                        </Sheet>
                    </div>

                    {/* right: nav + actions */}
                    <div className="flex items-center gap-2">
                        <nav className="hidden md:flex items-center gap-4">
                            <Link to="/" className="text-sm font-medium hover:text-emerald-700 transition-colors">Books</Link>
                            <Link to="/shelves" className="text-sm font-medium hover:text-emerald-700 transition-colors">Shelves</Link>
                            <Link to="/summary" className="text-sm font-medium hover:text-emerald-700 transition-colors flex items-center gap-1">
                                <IconChartBar size={16} />
                                <span className="hidden sm:inline">Summary</span>
                            </Link>
                        </nav>

                        {/* Desktop: Dropdown (features) */}
                        <div className="hidden sm:block">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" title="Features">
                                        <IconPlus />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuItem onClick={() => { onOpenGoals(); }}>
                                        <div className="flex items-center gap-2 cursor-pointer"><IconTarget size={16} />Reading Goals</div>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => { onOpenWishlist(); }}>
                                        <div className="flex items-center gap-2 cursor-pointer"><IconHeart size={16} />Wishlist</div>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => { onOpenLending(); }}>
                                        <div className="flex items-center gap-2 cursor-pointer"><IconUsers size={16} />Lending Tracker</div>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => { setIsCoverHidden(!isCoverHidden); }}>
                                        <div className="flex items-center gap-2 cursor-pointer">
                                            {isCoverHidden ? <IconEye size={16} /> : <IconEyeOff size={16} />}
                                            {isCoverHidden ? 'Show Covers' : 'Hide Covers'}
                                        </div>
                                    </DropdownMenuItem>

                                    <div className="border-t my-2" />

                                    <DropdownMenuItem onClick={() => { onExport(); }}>
                                        <div className="flex items-center gap-2 cursor-pointer"><IconDownload size={16} />Export Data</div>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => { fileInputRef.current?.click(); }}>
                                        <div className="flex items-center gap-2 cursor-pointer"><IconUpload size={16} />Import Data</div>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        {/* Mobile: sheet menu (contains same items + nav) */}
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="sm:hidden">
                                    <IconMenu />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-72 p-4 [&>button]:hidden">
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-emerald-700">
                                            <IconBook />
                                            <span className="font-bold">IlmShelf</span>
                                        </div>
                                    </div>

                                    <nav className="flex flex-col gap-1 mt-2">
                                        <Link to="/" className="px-2 py-2 rounded hover:bg-gray-50">Books</Link>
                                        <Link to="/shelves" className="px-2 py-2 rounded hover:bg-gray-50">Shelves</Link>
                                        <Link to="/summary" className="px-2 py-2 rounded hover:bg-gray-50 flex items-center gap-2"><IconChartBar />Summary</Link>
                                    </nav>

                                    <div className="border-t my-2" />

                                    <Button variant="ghost" className="justify-start" onClick={() => onOpenGoals()}>
                                        <IconTarget />
                                        <span className="ml-2">Reading Goals</span>
                                    </Button>
                                    <Button variant="ghost" className="justify-start" onClick={() => onOpenWishlist()}>
                                        <IconHeart />
                                        <span className="ml-2">Wishlist</span>
                                    </Button>
                                    <Button variant="ghost" className="justify-start" onClick={() => onOpenLending()}>
                                        <IconUsers />
                                        <span className="ml-2">Lending Tracker</span>
                                    </Button>
                                    <Button variant="ghost" className="justify-start" onClick={() => setIsCoverHidden(!isCoverHidden)}>
                                        {isCoverHidden ? <IconEye /> : <IconEyeOff />}
                                        <span className="ml-2">{isCoverHidden ? 'Show Covers' : 'Hide Covers'}</span>
                                    </Button>

                                    <div className="border-t my-2" />

                                    <Button variant="ghost" className="justify-start" onClick={() => onExport()}>
                                        <IconDownload />
                                        <span className="ml-2">Export Data</span>
                                    </Button>
                                    <Button variant="ghost" className="justify-start" onClick={() => fileInputRef.current?.click()}>
                                        <IconUpload />
                                        <span className="ml-2">Import Data</span>
                                    </Button>
                                </div>
                            </SheetContent>
                        </Sheet>

                        {/* hidden file input remains unchanged */}
                        <input ref={fileInputRef} type="file" accept=".json" onChange={onImport} className="hidden" />
                    </div>
                </div>
            </div>
        </header>
    )
}
