import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
    IconBookOff,
    IconHome,
    IconArrowLeft,
    IconBooks,
    IconLayoutGrid,
    IconChartBar,
    IconFeather,
    IconSparkles,
} from '@tabler/icons-react';

export default function NotFound() {
    const location = useLocation();
    const navigate = useNavigate();

    const quickLinks = [
        { to: '/', label: 'All Books', icon: IconBooks },
        { to: '/shelves', label: 'Shelves', icon: IconLayoutGrid },
        { to: '/summary', label: 'Collection Summary', icon: IconChartBar },
        { to: '/writters', label: 'Writers', icon: IconFeather }
    ];

    return (
        <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="max-w-lg w-full bg-white border border-slate-200/80 rounded-2xl shadow-sm p-8 text-center"
            >
                <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <IconBookOff size={34} stroke={1.75} />
                </div>

                <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold tracking-wide uppercase mb-3">
                    404 Error
                </span>

                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                    Page Not Found
                </h1>

                <p className="text-slate-600 text-sm mb-3">
                    This shelf or page doesn&apos;t exist or may have been moved.
                </p>

                <div className="inline-block max-w-full truncate px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-mono mb-7">
                    {location.pathname}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors shadow-xs"
                    >
                        <IconHome size={18} />
                        Back to My Books
                    </Link>

                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
                    >
                        <IconArrowLeft size={18} />
                        Go Back
                    </button>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 text-left">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                        Quick Navigation
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {quickLinks.map(({ to, label, icon: Icon }) => (
                            <Link
                                key={to}
                                to={to}
                                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                            >
                                <Icon size={17} className="text-emerald-600 shrink-0" />
                                <span>{label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}