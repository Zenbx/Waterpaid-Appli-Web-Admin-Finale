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
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">History Lookup</h2>
                <p className="text-slate-500">Search for transactions by User ID or Meter ID.</p>
            </div>

            <form onSubmit={handleSearch} className="flex items-center gap-2 max-w-md">
                <Input
                    placeholder="Enter User ID or Meter ID..."
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                />
                <Button type="submit" disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                </Button>
            </form>

            <div className="rounded-md border border-slate-200 bg-white shadow-sm overflow-hidden min-h-[200px]">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                        <tr>
                            <th className="px-4 py-3">Date</th>
                            <th className="px-4 py-3">Method</th>
                            <th className="px-4 py-3">Amount</th>
                            <th className="px-4 py-3">Volume</th>
                            <th className="px-4 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr><td colSpan={5} className="p-8 text-center text-slate-500">Searching...</td></tr>
                        ) : !searched ? (
                            <tr><td colSpan={5} className="p-8 text-center text-slate-500">Enter an ID to view transaction history.</td></tr>
                        ) : history.length === 0 ? (
                            <tr><td colSpan={5} className="p-8 text-center text-slate-500">No transactions found for this ID.</td></tr>
                        ) : (
                            history.map((item: any) => (
                                <tr key={item.refill_id} className="hover:bg-slate-50/50">
                                    <td className="px-4 py-3 text-slate-600">
                                        {new Date(item.created_at).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3 font-medium text-slate-900">
                                        {item.refill_method}
                                    </td>
                                    <td className="px-4 py-3 text-green-600 font-bold">
                                        {item.price} XAF
                                    </td>
                                    <td className="px-4 py-3 text-slate-600">
                                        {item.volume} L
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                                            {item.refill_state || 'Completed'}
                                        </span>
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
