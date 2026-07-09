import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode, useState } from 'react';
import { 
    LayoutDashboard, Users, ShoppingBag, Settings, 
    LogOut, Menu, Bell, Waves, FileText, Inbox, User
} from 'lucide-react';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function SidebarLayout({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const user = usePage().props.auth.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [notifOpen, setNotifOpen] = useState(false);

    const fetchNotifications = async () => {
        try {
            const response = await fetch(route('pelanggan.notifications.index'));
            const data = await response.json();
            setNotifications(data);
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        }
    };

    const markAsRead = async (id: string) => {
        try {
            await fetch(route('pelanggan.notifications.read', id), {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                    'Content-Type': 'application/json',
                }
            });
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read_at: new Date() } : n));
        } catch (error) {
            console.error('Failed to mark as read', error);
        }
    };

    const unreadCount = notifications.filter(n => !n.read_at).length;

    useState(() => {
        if (user.role === 'pelanggan') {
            fetchNotifications();
        }
    });

    return (
        <div className="flex h-screen bg-blue-50/30 font-sans text-slate-900 overflow-hidden">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-blue-50 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    {/* Logo Section */}
                    <div className="h-20 flex items-center px-6 border-b border-blue-50">
                        <Link href="/" className="flex items-center justify-center w-full">
                            <ApplicationLogo className="h-10 w-auto" />
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                        <Link 
                            href={route('dashboard')} 
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${route().current('*.dashboard') || route().current('dashboard') ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-600 hover:bg-blue-50'}`}
                        >
                            <LayoutDashboard className="w-4 h-4" />
                            Dashboard
                        </Link>

                        {user.role === 'kasir' && (
                            <>
                                <Link 
                                    href={route('kasir.transactions.index')} 
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${route().current('kasir.transactions.*') ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-600 hover:bg-blue-50'}`}
                                >
                                    <Inbox className="w-4 h-4" />
                                    Transaksi
                                </Link>
                                <Link 
                                    href={route('kasir.services.index')} 
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${route().current('kasir.services.*') ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-600 hover:bg-blue-50'}`}
                                >
                                    <Waves className="w-4 h-4" />
                                    Layanan
                                </Link>
                                <Link 
                                    href={route('kasir.customers.index')} 
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${route().current('kasir.customers.*') ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-600 hover:bg-blue-50'}`}
                                >
                                    <Users className="w-4 h-4" />
                                    Pelanggan
                                </Link>
                            </>
                        )}

                        {user.role === 'pelanggan' && (
                            <Link 
                                href={route('pelanggan.orders')} 
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${route().current('pelanggan.orders') ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-600 hover:bg-blue-50'}`}
                            >
                                <ShoppingBag className="w-4 h-4" />
                                Pesanan Saya
                            </Link>
                        )}
                        
                        <div className="pt-4 mt-4 border-t border-blue-50">
                            <Link 
                                href={route('logout')} 
                                method="post" 
                                as="button"
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-50 transition-all"
                            >
                                <LogOut className="w-4 h-4" />
                                Keluar
                            </Link>
                        </div>
                    </nav>

                    {/* User Profile Info (Static) */}
                    <div className="p-4 border-t border-blue-50">
                        <div className="flex items-center gap-3 px-2">
                            <div className="w-10 h-10 rounded-xl bg-amber-400 flex items-center justify-center text-blue-950 font-black text-xs uppercase shadow-sm">
                                {user.name.charAt(0)}
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-black text-slate-900 truncate">{user.name}</p>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{user.role}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-white border-b border-blue-50 flex items-center justify-between px-4 sm:px-8 z-10">
                    <div className="flex items-center gap-4">
                        <button 
                            className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        {header && (
                            <div className="text-lg font-black tracking-tight text-slate-900">
                                {header}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-3 relative">
                        <button 
                            onClick={() => setNotifOpen(!notifOpen)}
                            className="p-2 text-slate-400 hover:text-blue-600 transition-colors relative"
                        >
                            <Bell className="w-5 h-5" />
                            {unreadCount > 0 && (
                                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                            )}
                        </button>

                        {/* Notifications Dropdown */}
                        {notifOpen && (
                            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-blue-50 z-50 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
                                <div className="p-4 border-b border-blue-50 flex items-center justify-between">
                                    <h3 className="font-black text-slate-900">Notifikasi</h3>
                                    {unreadCount > 0 && (
                                        <span className="text-[10px] font-black bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                            {unreadCount} Baru
                                        </span>
                                    )}
                                </div>
                                <div className="max-h-[320px] overflow-y-auto">
                                    {notifications.length > 0 ? (
                                        notifications.map((notif) => (
                                            <div 
                                                key={notif.id}
                                                className={`p-4 border-b border-blue-50 last:border-0 hover:bg-blue-50 transition-colors cursor-pointer ${!notif.read_at ? 'bg-blue-50/30' : ''}`}
                                                onClick={() => markAsRead(notif.id)}
                                            >
                                                <div className="flex gap-3">
                                                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${!notif.read_at ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                                        <Bell className="w-4 h-4" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className={`text-xs leading-relaxed ${!notif.read_at ? 'font-bold text-slate-900' : 'text-slate-600'}`}>
                                                            {notif.data.message}
                                                        </p>
                                                        <p className="text-[10px] text-slate-400 mt-1 font-bold italic uppercase tracking-tighter">
                                                            {new Date(notif.created_at).toLocaleString('id-ID')}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center">
                                            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3 text-blue-200">
                                                <Inbox className="w-6 h-6" />
                                            </div>
                                            <p className="text-sm font-bold text-slate-400">Belum ada notifikasi</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-blue-50/30">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
