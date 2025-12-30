"use client";

import { useEffect, useState } from "react";
import {
    Plus,
    Search,
    MoreHorizontal,
    Link as LinkIcon,
    Trash2,
    CheckCircle,
    XCircle,
    Loader2
} from "lucide-react";
import { adminApi } from "@/lib/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function MetersPage() {
    const [meters, setMeters] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        loadMeters();
    }, []);

    async function loadMeters() {
        setLoading(true);
        try {
            const res = await adminApi.getMeters();
            setMeters(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    async function handleCreateMeter() {
        // For MVP, simple creation with defaults or random serials if backend supports it.
        // The schema MeterCreate requires serial_id and device_id.
        // We might need a modal form. For now, let's just use window.prompt for a quick test or mock it.
        const serial = window.prompt("Enter Serial ID:");
        if (!serial) return;
        const deviceId = window.prompt("Enter Device ID (Optional, for reference):") || `DEV-${Math.floor(Math.random() * 10000)}`;

        setCreating(true);
        try {
            await adminApi.createMeter({ serial_id: serial, device_id: deviceId });
            await loadMeters();
        } catch (err) {
            alert('Failed to create meter');
        } finally {
            setCreating(false);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Are you sure?")) return;
        try {
            await adminApi.deleteMeter(id);
            setMeters(meters.filter(m => m.meter_id !== id));
        } catch (err) {
            alert('Failed to delete');
        }
    }

    async function handleLinkDevice(id: string) {
        const devEui = window.prompt("Enter LoRa Device EUI:");
        if (!devEui) return;
        try {
            await adminApi.linkDevice(id, devEui);
            alert("Linked successfully!");
            loadMeters(); // Refresh to show attributed state if changed
        } catch (err) {
            alert("Failed to link device.");
        }
    }

    const filteredMeters = meters.filter(m =>
        m.serial_id.toLowerCase().includes(search.toLowerCase()) ||
        (m.device_id && m.device_id.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Meters</h2>
                    <p className="text-slate-500">Manage water meters and assignments.</p>
                </div>
                <Button onClick={handleCreateMeter} disabled={creating}>
                    {creating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                    Add Meter
                </Button>
            </div>

            <div className="flex items-center gap-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                    <Input
                        className="pl-9"
                        placeholder="Search meters..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="rounded-md border border-slate-200 bg-white shadow-sm overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                        <tr>
                            <th className="px-4 py-3">Serial ID / Device ID</th>
                            <th className="px-4 py-3">User</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">State</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr><td colSpan={5} className="p-8 text-center text-slate-500">Loading...</td></tr>
                        ) : filteredMeters.length === 0 ? (
                            <tr><td colSpan={5} className="p-8 text-center text-slate-500">No meters found.</td></tr>
                        ) : (
                            filteredMeters.map(meter => (
                                <tr key={meter.meter_id} className="hover:bg-slate-50/50">
                                    <td className="px-4 py-3 font-medium text-slate-900">
                                        <div>{meter.serial_id}</div>
                                        <div className="text-xs text-slate-500">{meter.device_id}</div>
                                    </td>
                                    <td className="px-4 py-3 text-slate-600">
                                        {meter.User ? (
                                            <span className="flex items-center gap-1">
                                                <UsersIcon className="h-3 w-3" />
                                                {meter.User.pseudo || meter.User.user_phone}
                                            </span>
                                        ) : (
                                            <span className="text-slate-400 italic">Unassigned</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        {meter.attributed ? (
                                            <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                                Attributed
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                                                Free
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        {meter.meter_state === 'ON' ? (
                                            <div className="flex items-center text-green-600"><CheckCircle className="mr-1 h-3 w-3" /> ON</div>
                                        ) : (
                                            <div className="flex items-center text-red-600"><XCircle className="mr-1 h-3 w-3" /> OFF</div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => handleLinkDevice(meter.meter_id)} title="Link Physical Device">
                                                <LinkIcon className="h-4 w-4 text-blue-500" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(meter.meter_id)} title="Delete Meter">
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </div>
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

function UsersIcon(props: any) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
}
