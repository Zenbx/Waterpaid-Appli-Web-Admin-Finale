"use client";

import { useEffect, useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { adminApi } from "@/lib/client";
import { Input } from "@/components/ui/input";

export default function UsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        loadUsers();
    }, []);

    async function loadUsers() {
        setLoading(true);
        try {
            // getUsers(skip, limit)
            const res = await adminApi.getUsers(0, 100);
            setUsers(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const filteredUsers = users.filter(u =>
        (u.user_pseudo && u.user_pseudo.toLowerCase().includes(search.toLowerCase())) ||
        (u.user_phone && u.user_phone.includes(search))
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">User Directory</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage and monitor subscribers connected to the network.</p>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        className="pl-10 bg-slate-50 border-none focus-visible:ring-1 focus-visible:ring-blue-500 rounded-xl"
                        placeholder="Search by Pseudo or Phone..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-6 px-2">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Total Users</span>
                        <span className="text-lg font-bold text-slate-900">{users.length}</span>
                    </div>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-5 font-semibold text-slate-600 uppercase tracking-wider text-[11px]">Subscriber Info</th>
                                <th className="px-8 py-5 font-semibold text-slate-600 uppercase tracking-wider text-[11px]">Phone Identity</th>
                                <th className="px-8 py-5 font-semibold text-slate-600 uppercase tracking-wider text-[11px]">Email Address</th>
                                <th className="px-8 py-5 font-semibold text-slate-600 uppercase tracking-wider text-[11px] text-right">System ID</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                                            <span className="text-slate-400 font-medium">Fetching user records...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="py-20 text-center text-slate-400 italic">
                                        No users found matching your search.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map(user => (
                                    <tr key={user.user_id || Math.random()} className="group hover:bg-blue-50/30 transition-colors">
                                        <td className="px-8 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 font-bold text-xs ring-2 ring-white shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                                    {(user.user_pseudo || 'U').charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-slate-900 tracking-tight leading-none">
                                                        {user.user_pseudo || 'Anonymous'}
                                                    </span>
                                                    <span className="text-[10px] text-slate-400 mt-1 uppercase tracking-tight">Active Member</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <span className="font-medium text-slate-600">{user.user_phone}</span>
                                        </td>
                                        <td className="px-8 py-4">
                                            <span className="text-slate-500">{user.user_email || <span className="text-slate-300 italic">Not provided</span>}</span>
                                        </td>
                                        <td className="px-8 py-4 text-right">
                                            <span className="font-mono text-[10px] text-slate-400 py-1 px-2 border border-slate-100 rounded-lg">
                                                {user.user_id?.substring(0, 13) || 'N/A'}...
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
