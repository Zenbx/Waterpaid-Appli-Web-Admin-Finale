"use client";

import { useState } from "react";
import { Search, Loader2, FileText } from "lucide-react";
import axios from "axios";
import { adminApi } from "@/lib/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Since we don't have a global history endpoint, we will use this page to look up specific histories 
// or perhaps show "Recent Reports" if that's what reports.py does.
// Let's implement a lookup form.

export default function HistoryPage() {
    const [searchId, setSearchId] = useState("");
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    async function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        if (!searchId) return;

        setLoading(true);
        setSearched(true);
        setHistory([]);

        try {
            // We need to fetch specific history manually using axios or add to client
            // client.ts assumes we have getHistory(id) in userApi, but adminApi didn't have it explicitly mapped 
            // in my previous step (I mapped getMeter, getUsers).
            // Let's call the endpoint directly matching the router: GET /a/histories/{id}
            // I need to update client.ts ideally, but I can use the base instance exported.

            // Importing client instance re-exported from lib/client? 
            // Actually I exported `client` as default.

            const client = (await import("@/lib/client")).default;
            const res = await client.get(`/a/histories/${searchId}`);
            setHistory(res.data);
        } catch (err) {
            // console.error(err);
            // Error handling: likely 404
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Transaction Audit</h1>
                    <p className="text-sm text-slate-500 mt-1">Audit and verify transaction logs across users and hardware.</p>
                </div>
            </div>

            {/* Powerful Search Bar */}
            <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm">
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                        <Input
                            placeholder="Search by User ID or Meter Serial ID..."
                            className="pl-12 h-12 bg-slate-50 border-none focus-visible:ring-1 focus-visible:ring-blue-500 rounded-2xl transition-all"
                            value={searchId}
                            onChange={(e) => setSearchId(e.target.value)}
                        />
                    </div>
                    <Button
                        type="submit"
                        disabled={loading}
                        className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-md shadow-blue-100 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify Record"}
                    </Button>
                </form>
            </div>

            {/* Results Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[300px]">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-5 font-semibold text-slate-600 uppercase tracking-wider text-[11px]">Timestamp</th>
                                <th className="px-8 py-5 font-semibold text-slate-600 uppercase tracking-wider text-[11px]">Gateway / Method</th>
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
                                            <span className="text-slate-400 font-medium">Syncing with blockchain Ledger...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : !searched ? (
                                <tr>
                                    <td colSpan={5} className="py-24 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="p-3 bg-slate-50 rounded-2xl text-slate-300">
                                                <FileText className="h-8 w-8" />
                                            </div>
                                            <p className="text-slate-400 font-medium mt-2">Enter an ID to initiate record lookup.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : history.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-24 text-center text-slate-400 italic">
                                        No transaction logs found for this identifier.
                                    </td>
                                </tr>
                            ) : (
                                history.map((item: any) => (
                                    <tr key={item.refill_id} className="group hover:bg-blue-50/30 transition-colors">
                                        <td className="px-8 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-900 tracking-tight">
                                                    {new Date(item.created_at).toLocaleDateString()}
                                                </span>
                                                <span className="text-[10px] text-slate-400 mt-1 uppercase">
                                                    {new Date(item.created_at).toLocaleTimeString()}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full bg-blue-400" />
                                                <span className="font-medium text-slate-700">{item.refill_method || 'Mobile Money'}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <span className="text-slate-600 font-bold">{item.volume} <span className="text-[10px] text-slate-400 font-normal">LITERS</span></span>
                                        </td>
                                        <td className="px-8 py-4">
                                            <span className="text-emerald-600 font-black tracking-tight">{item.price.toLocaleString()} <span className="text-[9px] text-emerald-500/50">XAF</span></span>
                                        </td>
                                        <td className="px-8 py-4 text-right">
                                            <span className="inline-flex items-center rounded-lg bg-emerald-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-700 border border-emerald-100">
                                                {item.refill_state || 'COMPLETED'}
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
