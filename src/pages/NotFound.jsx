import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

/**
 * 404 Not Found Page Component
 * Displays when user navigates to non-existent route
 */
function NotFound() {
    const location = useLocation();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                <div className="mb-8">
                    <h1 className="text-9xl font-bold text-white mb-4">404</h1>
                    <h2 className="text-3xl font-semibold text-white mb-2">
                        Page Not Found
                    </h2>
                    <p className="text-slate-300 mb-2">
                        The page you're looking for doesn't exist.
                    </p>
                    <p className="text-sm text-slate-400 font-mono">
                        {location.pathname}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-lg font-semibold hover:bg-slate-100 transition-colors"
                    >
                        <Home size={20} />
                        Go Home
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-lg font-semibold hover:bg-slate-700 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        Go Back
                    </button>
                </div>

                <div className="mt-12 p-6 bg-slate-800/50 rounded-lg backdrop-blur">
                    <h3 className="text-white font-semibold mb-4">Quick Links</h3>
                    <div className="space-y-2">
                        <Link
                            to="/"
                            className="block text-slate-300 hover:text-white transition-colors"
                        >
                            → Book Management App
                        </Link>
                        <Link
                            to="/usapp"
                            className="block text-slate-300 hover:text-white transition-colors"
                        >
                            → UdyoktaStudio
                        </Link>
                        <Link
                            to="/usapp/demo/fashion"
                            className="block text-slate-300 hover:text-white transition-colors"
                        >
                            → Fashion Demo Store
                        </Link>
                        <Link
                            to="/usapp/demo/cosmetics"
                            className="block text-slate-300 hover:text-white transition-colors"
                        >
                            → Cosmetics Demo Store
                        </Link>
                        <Link
                            to="/usapp/demo/gadgets"
                            className="block text-slate-300 hover:text-white transition-colors"
                        >
                            → Gadgets Demo Store
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NotFound;