import { useState } from 'react';
import { IconLock, IconLockOpen, IconCheck, IconX } from '@tabler/icons-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { bookApi, authStorage } from '../services/bookApi';

export default function AdminLoginModal({ open, onClose, onAuthChange }) {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const isLoggedIn = authStorage.isLoggedIn();

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!password.trim()) return;

        try {
            setLoading(true);
            setError('');
            await bookApi.login(password);
            setPassword('');
            onAuthChange?.(true);
            onClose?.();
        } catch (err) {
            setError(err.message || 'Invalid password');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        bookApi.logout();
        onAuthChange?.(false);
        onClose?.();
    };

    return (
        <Dialog open={open} onOpenChange={(val) => { if (!val) onClose?.(); }}>
            <DialogContent className="max-w-sm w-11/12">
                <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        {isLoggedIn ? <IconLockOpen size={20} /> : <IconLock size={20} />}
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">
                            {isLoggedIn ? 'Admin Mode Active' : 'Admin Access'}
                        </h2>
                        <p className="text-xs text-slate-500">
                            {isLoggedIn
                                ? 'Private books & editing are unlocked.'
                                : 'Enter password to view private books & edit.'}
                        </p>
                    </div>
                </div>

                {isLoggedIn ? (
                    <div className="mt-4 flex justify-end gap-2">
                        <Button variant="outline" onClick={onClose}>
                            Close
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleLogout}
                            className="flex items-center gap-1.5"
                        >
                            <IconX size={16} />
                            Lock Admin
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={handleLogin} className="space-y-3 mt-3">
                        <Input
                            type="password"
                            placeholder="Admin password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoFocus
                        />

                        {error && <p className="text-xs text-red-600">{error}</p>}

                        <div className="flex justify-end gap-2 pt-1">
                            <Button type="button" variant="outline" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading} className="flex items-center gap-1.5">
                                <IconCheck size={16} />
                                {loading ? 'Unlocking...' : 'Unlock'}
                            </Button>
                        </div>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}