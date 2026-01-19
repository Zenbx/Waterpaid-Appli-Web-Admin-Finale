"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    Activity,
    LogOut,
    Droplet
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
        icon: Droplet, // Using Droplet for meters/water
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

    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Sidebar */}
            <aside className="fixed inset-y-0 left-0 z-50 w-64 border-r border-slate-200 bg-white">
                <div className="flex h-16 items-center border-b border-slate-200 px-6">
                    <div className="flex items-center gap-2 font-bold text-slate-900">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white">
                            <Droplet className="h-5 w-5" />
                        </div>
                        <span>WaterPaid Admin</span>
                    </div>
                </div>

                <div className="flex flex-col justify-between h-[calc(100vh-64px)] p-4">
                    <nav className="space-y-1">
                        {sidebarItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                        isActive
                                            ? "bg-slate-100 text-slate-900"
                                            : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                    )}
                                >
                                    <item.icon className="h-4 w-4" />
                                    {item.title}
                                </Link>
                            );
                        })}
                    </nav>

                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                    >
                        <LogOut className="h-4 w-4" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="pl-64 w-full">
                <div className="container mx-auto p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
