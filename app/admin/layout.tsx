"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    Activity,
    LogOut,
    Droplet,
    Bell,
    FileText,
    Settings,
    FileDown
} from "lucide-react";
import axios from "axios";
import { useAdminStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { useToast } from "@/lib/toast";

const sidebarItems = [
    {
        title: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
    },
    {
        title: "Meters",
        href: "/admin/meters",
        icon: Droplet,
    },
    {
        title: "Users",
        href: "/admin/users",
        icon: Users,
    },
    {
        title: "History",
        href: "/admin/history",
        icon: Activity,
    },
    {
        title: "Alerts",
        href: "/admin/alerts",
        icon: Bell,
    },
    {
        title: "Audit Logs",
        href: "/admin/audit-logs",
        icon: FileText,
    },
    {
        title: "Reports",
        href: "/admin/reports",
        icon: FileDown,
    },
    {
        title: "Settings",
        href: "/admin/settings",
        icon: Settings,
    },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const { logout } = useAdminStore();
    const toast = useToast();

    const handleLogout = async () => {
        try {
            await axios.post('/api/auth/logout');
            logout();
            toast.success("Successfully logged out");
            router.push("/auth/login");
        } catch (error) {
            toast.error("Failed to logout");
        }
    };

    const getPageTitle = () => {
        const item = sidebarItems.find(item => item.href === pathname);
        return item?.title || "Dashboard";
    };

    return (
        <div className="flex min-h-screen bg-[#F8FAFC]">
            {/* Sidebar */}
            <aside className="fixed inset-y-0 left-0 z-50 w-72 border-r border-slate-200 bg-white/80 backdrop-blur-md">
                <div className="flex h-20 items-center px-8">
                    <div className="flex items-center gap-3 font-bold text-slate-900 tracking-tight">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-200">
                            <Droplet className="h-6 w-6" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg leading-none">WaterPaid</span>
                            <span className="text-[10px] uppercase tracking-widest text-slate-400 mt-1">Admin Portal</span>
                        </div>
                    </div>
                </div>

                <div className="mt-8 px-4">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-4 mb-4">
                        Management
                    </div>
                    <nav className="space-y-1">
                        {sidebarItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                                        isActive
                                            ? "bg-blue-50 text-blue-600 shadow-sm shadow-blue-100"
                                            : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                    )}
                                >
                                    <item.icon className={cn(
                                        "h-5 w-5 transition-transform group-hover:scale-110",
                                        isActive ? "text-blue-600" : "text-slate-400"
                                    )} />
                                    {item.title}
                                    {isActive && (
                                        <div className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-600" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="absolute bottom-0 w-full p-4 border-t border-slate-100">
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-500 transition-all duration-200"
                    >
                        <LogOut className="h-5 w-5" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 pl-72">
                {/* Header */}
                <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-slate-200 bg-[#F8FAFC]/80 px-10 backdrop-blur-md">
                    <div className="flex items-center gap-4">
                        <div className="h-8 w-[1px] bg-slate-200" />
                        <h2 className="text-sm font-semibold text-slate-900">
                            {getPageTitle()}
                        </h2>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-slate-600 font-bold text-xs">
                                AD
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-slate-900 leading-none">Administrator</span>
                                <span className="text-[10px] text-slate-500 mt-1">Super User</span>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="p-10">
                    {children}
                </main>
            </div>
        </div>
    );
}
