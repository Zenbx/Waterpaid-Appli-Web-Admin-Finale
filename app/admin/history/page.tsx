"use client";

import { useState, useEffect } from "react";
import { Search, Loader2, FileText, Users as UsersIcon, Droplet } from "lucide-react";
import { adminApi } from "@/lib/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { User, Meter } from "@/types/api";

export default function HistoryPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [meters, setMeters] = useState<Meter[]>([]);
    const [selectedType, setSelectedType] = useState<'user' | 'meter'>('user');
    const [selectedId, setSelectedId] = useState("");
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingLists, setLoadingLists] = useState(true);
    const [searched, setSearched] = useState(false);
    const [filterText, setFilterText] = useState("");

    useEffect(() => {
        async function loadLists() {
            setLoadingLists(true);
            try {
                const [uRes, mRes] = await Promise.all([
                    adminApi.getUsers(),
                    adminApi.getMeters()
                ]);
                setUsers(uRes.data);
                setMeters(mRes.data);
            } catch (err) {
                console.error("Failed to load users/meters", err);
            } finally {
                setLoadingLists(false);
            }
        }
        loadLists();
    }, []);

    async function handleSearch(id: string) {
        if (!id) return;

        setLoading(true);
        setSearched(true);
        setSelectedId(id);
        setHistory([]);

        try {
            const res = await adminApi.getTransactionHistory(
                selectedType === 'user' ? { user_id: id } : { meter_id: id }
            );
            setHistory(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    const filteredUsers = users.filter(u =>
        u.user_pseudo.toLowerCase().includes(filterText.toLowerCase()) ||
        u.user_phone.includes(filterText)
    );

    const filteredMeters = meters.filter(m =>
        m.serial_id.toLowerCase().includes(filterText.toLowerCase()) ||
        (m.device_id && m.device_id.toLowerCase().includes(filterText.toLowerCase()))
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Transaction Audit</h1>
                    <p className="text-sm text-slate-500 mt-1">Select a subject to audit technical and financial logs.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Selection Sidebar */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden h-[600px] flex flex-col">
                        <div className="p-4 border-b border-slate-50 flex gap-2">
                            <Button
                                variant={selectedType === 'user' ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => setSelectedType('user')}
                                className="flex-1 rounded-xl text-[10px] font-black uppercase tracking-wider h-9"
                            >
                                <UsersIcon className="h-3 w-3 mr-2" /> Users
                            </Button>
                            <Button
                                variant={selectedType === 'meter' ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => setSelectedType('meter')}
                                className="flex-1 rounded-xl text-[10px] font-black uppercase tracking-wider h-9"
                            >
                                <Droplet className="h-3 w-3 mr-2" /> Meters
                            </Button>
                        </div>
                        <div className="p-4 border-b border-slate-50">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    placeholder={`Filter ${selectedType}s...`}
                                    className="pl-9 h-10 bg-slate-50 border-none focus-visible:ring-1 focus-visible:ring-blue-500 rounded-xl text-xs"
                                    value={filterText}
                                    onChange={(e) => setFilterText(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2 space-y-1">
                            {loadingLists ? (
                                <div className="flex items-center justify-center h-full">
                                    <Loader2 className="h-6 w-6 animate-spin text-slate-200" />
                                </div>
                            ) : selectedType === 'user' ? (
                                filteredUsers.map(u => (
                                    <button
                                        key={u.user_id}
                                        onClick={() => handleSearch(u.user_id)}
                                        className={cn(
                                            "w-full text-left p-3 rounded-2xl transition-all group",
                                            selectedId === u.user_id ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "hover:bg-slate-50"
                                        )}
                                    >
                                        <div className="font-bold text-xs truncate">{u.user_pseudo}</div>
                                        <div className={cn("text-[10px] mt-0.5", selectedId === u.user_id ? "text-blue-100" : "text-slate-400")}>{u.user_phone}</div>
                                    </button>
                                ))
                            ) : (
                                filteredMeters.map(m => (
                                    <button
                                        key={m.meter_id}
                                        onClick={() => handleSearch(m.meter_id)}
                                        className={cn(
                                            "w-full text-left p-3 rounded-2xl transition-all group",
                                            selectedId === m.meter_id ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "hover:bg-slate-50"
                                        )}
                                    >
                                        <div className="font-bold text-xs truncate">{m.serial_id}</div>
                                        <div className={cn("text-[10px] mt-0.5", selectedId === m.meter_id ? "text-blue-100" : "text-slate-400")}>{m.device_id || 'unlinked'}</div>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Results Area */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden min-h-[600px]">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50 border-b border-slate-100">
                                        <th className="px-8 py-5 font-semibold text-slate-600 uppercase tracking-wider text-[11px]">Timestamp</th>
                                        <th className="px-8 py-5 font-semibold text-slate-600 uppercase tracking-wider text-[11px]">Provider / Method</th>
                                        <th className="px-8 py-5 font-semibold text-slate-600 uppercase tracking-wider text-[11px]">Flow Volume</th>
                                        <th className="px-8 py-5 font-semibold text-slate-600 uppercase tracking-wider text-[11px]">Financials</th>
                                        <th className="px-8 py-5 font-semibold text-slate-600 uppercase tracking-wider text-[11px] text-right">Audit Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={5} className="py-24 text-center">
                                                <div className="flex flex-col items-center gap-3">
                                                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                                                    <span className="text-slate-400 font-medium">Fetching Audit Trails...</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : !searched ? (
                                        <tr>
                                            <td colSpan={5} className="py-24 text-center">
                                                <div className="flex flex-col items-center gap-2">
                                                    <div className="p-4 bg-slate-50 rounded-[2rem] text-slate-200">
                                                        <FileText className="h-10 w-10" />
                                                    </div>
                                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[11px] mt-4">Select a User or Meter to begin</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : history.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="py-24 text-center">
                                                <p className="text-slate-400 italic font-medium">No recorded transactions for this subject.</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        history.map((item: any) => (
                                            <tr key={item.transaction_id || item.refill_id} className="group hover:bg-blue-50/20 transition-all">
                                                <td className="px-8 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-slate-900 tracking-tight">
                                                            {new Date(item.created_at).toLocaleDateString()}
                                                        </span>
                                                        <span className="text-[10px] text-slate-400 mt-1 uppercase font-medium">
                                                            {new Date(item.created_at).toLocaleTimeString()}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.5)]" />
                                                        <span className="font-bold text-slate-600 text-xs">{item.payment_method || item.refill_method || 'DIGITAL GATEWAY'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-4">
                                                    <span className="text-slate-900 font-black tracking-tight">{item.volume_liters || item.volume || 0} <span className="text-[9px] text-slate-400 font-bold uppercase">Liters</span></span>
                                                </td>
                                                <td className="px-8 py-4">
                                                    <span className="text-emerald-600 font-black tracking-tighter text-[15px]">{item.amount || item.price || 0} <span className="text-[9px] text-emerald-400 uppercase">XAF</span></span>
                                                </td>
                                                <td className="px-8 py-4 text-right">
                                                    <Badge className={cn(
                                                        "text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg border-0",
                                                        (item.status || item.refill_state) === 'COMPLETED' || (item.status || item.refill_state) === 'SUCCEEDED' ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                                                    )}>
                                                        {item.status || item.refill_state || 'UNKNOWN'}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
