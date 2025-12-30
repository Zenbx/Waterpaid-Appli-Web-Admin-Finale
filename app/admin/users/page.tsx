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
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">Users</h2>
                <p className="text-slate-500">View users assigned to your meters.</p>
            </div>

            <div className="flex items-center gap-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                    <Input
                        className="pl-9"
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="rounded-md border border-slate-200 bg-white shadow-sm overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                        <tr>
                            <th className="px-4 py-3">User ID</th>
                            <th className="px-4 py-3">Pseudo</th>
                            <th className="px-4 py-3">Phone</th>
                            <th className="px-4 py-3">Email</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr><td colSpan={4} className="p-8 text-center text-slate-500">Loading...</td></tr>
                        ) : filteredUsers.length === 0 ? (
                            <tr><td colSpan={4} className="p-8 text-center text-slate-500">No users found.</td></tr>
                        ) : (
                            filteredUsers.map(user => (
                                <tr key={user.user_id || Math.random()} className="hover:bg-slate-50/50">
                                    <td className="px-4 py-3 font-mono text-xs text-slate-500">
                                        {user.user_id?.substring(0, 8)}...
                                    </td>
                                    <td className="px-4 py-3 font-medium text-slate-900">
                                        {user.user_pseudo || 'N/A'}
                                    </td>
                                    <td className="px-4 py-3 text-slate-600">
                                        {user.user_phone}
                                    </td>
                                    <td className="px-4 py-3 text-slate-600">
                                        {user.user_email || '-'}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
