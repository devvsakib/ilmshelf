import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    IconBook,
    IconSearch,
    IconChartBar,
    IconBooks,
    IconBookmark,
    IconDots,
    IconTarget,
    IconHeart,
    IconUsers,
    IconDownload,
    IconUpload,
    IconEye,
    IconEyeOff,
    IconMenu2,
    IconX,
    IconUser,
    IconLockOpen,
    IconLock,
} from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

export default function Header({
    q,
    setQ,
    onExport,
    onImport,
    onOpenGoals,
    onOpenWishlist,
    onOpenLending,
    isCoverHidden,
    setIsCoverHidden,
    isAdmin,
    onOpenAdmin,
}) {
    const fileInputRef = useRef(null);
    const searchInputRef = useRef(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
    const { pathname } = useLocation();

    // Press "/" anywhere (outside inputs) to focus catalog search
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (
                e.key === '/' &&
                !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)
            ) {
                e.preventDefault();
                searchInputRef.current?.focus();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const navItems = [
        { label: 'Catalog', to: '/', icon: IconBooks },
        { label: 'Shelves', to: '/shelves', icon: IconBookmark },
        { label: 'Summary', to: '/summary', icon: IconChartBar },
        { label: 'Analytics', to: '/analytics', icon: IconChartBar },
    ];

    const utilityItems = [
        { label: 'Reading Goals', icon: IconTarget, action: onOpenGoals },
        { label: 'Wishlist', icon: IconHeart, action: onOpenWishlist },
        { label: 'Lending Tracker', icon: IconUsers, action: onOpenLending },
        { label: <Link to="/writters">Writters</Link>, icon: IconUser }
    ];

    return (
        <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 gap-4">
                    {/* Left: Editorial Wordmark & Navigation */}
                    <div className="flex items-center gap-8 min-w-0">
                        <Link
                            to="/"
                            className="flex items-center gap-2.5 text-foreground group shrink-0"
                        >
                            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary text-primary-foreground shadow-xs transition-transform duration-200 group-hover:scale-[1.03]">
                                <IconBook size={18} stroke={2} />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-editorial text-lg font-semibold tracking-tight leading-none text-foreground">
                                    IlmShelf
                                </span>
                                <span className="hidden sm:block text-[10px] uppercase tracking-[0.14em] text-muted-foreground mt-0.5">
                                    Personal Archive
                                </span>
                            </div>
                        </Link>

                        {/* Primary Books Navigation */}
                        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
                            {navItems.map(({ label, to, icon: Icon }) => {
                                const isActive =
                                    to === '/'
                                        ? pathname === '/'
                                        : pathname.startsWith(to);

                                return (
                                    <Link
                                        key={to}
                                        to={to}
                                        className={cn(
                                            'relative flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                                            isActive
                                                ? 'text-primary bg-primary/8 font-semibold'
                                                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/70'
                                        )}
                                    >
                                        <Icon size={16} stroke={1.85} />
                                        <span>{label}</span>
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Right: Search + Library Tools */}
                    <div className="flex items-center gap-2.5">
                        {/* Desktop Search Input */}
                        <div className="hidden sm:flex items-center gap-2 bg-card hover:border-input focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/10 transition-all rounded-md px-3 h-9 border border-border">
                            <IconSearch size={15} className="text-muted-foreground shrink-0" />
                            <Input
                                ref={searchInputRef}
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                placeholder="Search title, author..."
                                className="bg-transparent border-0 p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0 w-44 md:w-60 text-sm placeholder:text-muted-foreground/75 shadow-none"
                            />
                            {q ? (
                                <button
                                    type="button"
                                    onClick={() => setQ('')}
                                    className="text-muted-foreground hover:text-foreground p-0.5"
                                    aria-label="Clear search"
                                >
                                    <IconX size={13} />
                                </button>
                            ) : (
                                <kbd className="hidden lg:inline-flex items-center justify-center h-5 px-1.5 text-[10px] font-mono font-medium text-muted-foreground bg-secondary border border-border rounded">
                                    /
                                </kbd>
                            )}
                        </div>

                        {/* Mobile Search Trigger */}
                        <Sheet open={mobileSearchOpen} onOpenChange={setMobileSearchOpen}>
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="sm:hidden h-9 w-9 text-muted-foreground hover:text-foreground"
                                    aria-label="Search books"
                                >
                                    <IconSearch size={18} />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="top" className="bg-background border-b border-border p-4 [&>button]:hidden">
                                <div className="flex items-center gap-2 bg-card border border-border rounded-md px-3 h-10">
                                    <IconSearch size={16} className="text-muted-foreground" />
                                    <Input
                                        value={q}
                                        onChange={(e) => setQ(e.target.value)}
                                        placeholder="Search Bengali or English title, author..."
                                        className="border-0 bg-transparent p-0 focus-visible:ring-0 shadow-none text-sm"
                                        autoFocus
                                    />
                                    {q && (
                                        <button
                                            type="button"
                                            onClick={() => setQ('')}
                                            className="text-xs text-muted-foreground hover:text-foreground"
                                        >
                                            Clear
                                        </button>
                                    )}
                                </div>
                            </SheetContent>
                        </Sheet>

                        {/* Desktop Library Tools Dropdown */}
                        <div className="hidden sm:block">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-9 px-2.5 bg-card border-border hover:bg-secondary/80 text-foreground gap-1.5 font-medium"
                                        title="Library Tools & Archive Data"
                                    >
                                        <IconDots size={16} />
                                        <span className="hidden lg:inline text-xs">Tools</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className="w-52 bg-popover border-border text-popover-foreground shadow-md"
                                >
                                    <DropdownMenuLabel className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                                        Reading Tools
                                    </DropdownMenuLabel>

                                    {utilityItems.map(({ label, icon: Icon, action }) => (
                                        <DropdownMenuItem
                                            key={label}
                                            onClick={() => action?.()}
                                            className="flex items-center gap-2.5 cursor-pointer py-2"
                                        >
                                            <Icon size={16} className="text-muted-foreground" />
                                            <span>{label}</span>
                                        </DropdownMenuItem>
                                    ))}

                                    <DropdownMenuItem
                                        onClick={() => setIsCoverHidden(!isCoverHidden)}
                                        className="flex items-center gap-2.5 cursor-pointer py-2"
                                    >
                                        {isCoverHidden ? (
                                            <IconEye size={16} className="text-muted-foreground" />
                                        ) : (
                                            <IconEyeOff size={16} className="text-muted-foreground" />
                                        )}
                                        <span>{isCoverHidden ? 'Show Book Covers' : 'Hide Book Covers'}</span>
                                    </DropdownMenuItem>

                                    <DropdownMenuSeparator className="bg-border" />

                                    <DropdownMenuLabel className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                                        Archive Backup
                                    </DropdownMenuLabel>

                                    <DropdownMenuItem
                                        onClick={() => onExport?.()}
                                        className="flex items-center gap-2.5 cursor-pointer py-2"
                                    >
                                        <IconDownload size={16} className="text-muted-foreground" />
                                        <span>Export JSON</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => fileInputRef.current?.click()}
                                        className="flex items-center gap-2.5 cursor-pointer py-2"
                                    >
                                        <IconUpload size={16} className="text-muted-foreground" />
                                        <span>Import JSON</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        {/* Mobile Drawer Navigation */}
                        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="md:hidden h-9 w-9 text-foreground"
                                    aria-label="Open library menu"
                                >
                                    <IconMenu2 size={20} />
                                </Button>
                            </SheetTrigger>
                            <SheetContent
                                side="right"
                                className="w-72 bg-background border-l border-border p-5 flex flex-col justify-between"
                            >
                                <div className="space-y-6">
                                    {/* Drawer Header */}
                                    <div className="flex items-center gap-2.5 pb-4 border-b border-border">
                                        <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary text-primary-foreground">
                                            <IconBook size={18} />
                                        </div>
                                        <div>
                                            <p className="font-editorial font-semibold text-base leading-none">
                                                IlmShelf
                                            </p>
                                            <p className="text-[11px] text-muted-foreground mt-1">
                                                Personal Islamic Library
                                            </p>
                                        </div>
                                    </div>

                                    {/* Navigation Links */}
                                    <div className="space-y-1">
                                        <p className="px-2 text-[11px] uppercase tracking-wider text-muted-foreground font-medium mb-2">
                                            Library
                                        </p>
                                        {navItems.map(({ label, to, icon: Icon }) => {
                                            const isActive =
                                                to === '/'
                                                    ? pathname === '/'
                                                    : pathname.startsWith(to);

                                            return (
                                                <Link
                                                    key={to}
                                                    to={to}
                                                    onClick={() => setMobileMenuOpen(false)}
                                                    className={cn(
                                                        'flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm font-medium transition-colors',
                                                        isActive
                                                            ? 'bg-primary/10 text-primary font-semibold'
                                                            : 'text-foreground hover:bg-secondary'
                                                    )}
                                                >
                                                    <Icon size={17} />
                                                    <span>{label}</span>
                                                </Link>
                                            );
                                        })}
                                    </div>

                                    {/* Reading Tools */}
                                    <div className="space-y-1 pt-2 border-t border-border">
                                        <p className="px-2 text-[11px] uppercase tracking-wider text-muted-foreground font-medium mb-2">
                                            Tools
                                        </p>
                                        {utilityItems.map(({ label, icon: Icon, action }) => (
                                            <button
                                                key={label}
                                                type="button"
                                                onClick={() => {
                                                    setMobileMenuOpen(false);
                                                    action?.();
                                                }}
                                                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm text-foreground hover:bg-secondary transition-colors text-left"
                                            >
                                                <Icon size={17} className="text-muted-foreground" />
                                                <span>{label}</span>
                                            </button>
                                        ))}

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsCoverHidden(!isCoverHidden);
                                                setMobileMenuOpen(false);
                                            }}
                                            className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm text-foreground hover:bg-secondary transition-colors text-left"
                                        >
                                            {isCoverHidden ? (
                                                <IconEye size={17} className="text-muted-foreground" />
                                            ) : (
                                                <IconEyeOff size={17} className="text-muted-foreground" />
                                            )}
                                            <span>{isCoverHidden ? 'Show Covers' : 'Hide Covers'}</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Footer Backup Actions */}
                                <div className="pt-4 border-t border-border grid grid-cols-2 gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full bg-card border-border text-xs gap-1.5"
                                        onClick={() => {
                                            setMobileMenuOpen(false);
                                            onExport?.();
                                        }}
                                    >
                                        <IconDownload size={14} />
                                        Export
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full bg-card border-border text-xs gap-1.5"
                                        onClick={() => {
                                            setMobileMenuOpen(false);
                                            fileInputRef.current?.click();
                                        }}
                                    >
                                        <IconUpload size={14} />
                                        Import
                                    </Button>
                                </div>
                            </SheetContent>
                        </Sheet>
                        <button
                            type="button"
                            onClick={onOpenAdmin}
                            title={isAdmin ? 'Admin Unlocked (Click to Lock)' : 'Unlock Admin Mode'}
                            className={`p-2 rounded-lg border transition-colors ${isAdmin
                                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                }`}
                        >
                            {isAdmin ? <IconLockOpen size={18} /> : <IconLock size={18} />}
                        </button>

                        {/* Hidden JSON Import Input */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".json"
                            onChange={onImport}
                            className="hidden"
                        />
                    </div>
                </div>
            </div>
        </header>
    );
}