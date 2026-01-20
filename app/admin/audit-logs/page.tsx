"use client"
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const logs = [
    { id: 1, action: 'User Created', user: 'Admin', details: 'Created account for John Doe', ip: '192.168.1.1', date: '2024-03-30 10:45 AM' },
    { id: 2, action: 'Meter Linked', user: 'System', details: 'Meter #1300 linked to User #45', ip: '10.0.0.5', date: '2024-03-29 03:20 PM' },
    { id: 3, action: 'Settings Updated', user: 'SuperAdmin', details: 'Changed water price to 2.5 CFA', ip: '192.168.1.15', date: '2024-03-28 09:15 AM' },
    { id: 4, action: 'Login Failed', user: 'Unknown', details: 'Failed login attempt for admin', ip: '45.32.1.2', date: '2024-03-28 08:30 AM' },
];

export default function AuditLogsPage() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">System Trace</h1>
                    <p className="text-sm text-slate-500 mt-1">Immutable audit logs of all administrative interactions.</p>
                </div>
            </div>

            {/* Content Card */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
                <div className="p-8 border-b border-slate-50">
                    <h2 className="text-lg font-bold text-slate-900">Infrastructure Logs</h2>
                    <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-bold">Secure Trace Database • Live</p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-5 font-semibold text-slate-600 uppercase tracking-wider text-[11px]">Event Action</th>
                                <th className="px-8 py-5 font-semibold text-slate-600 uppercase tracking-wider text-[11px]">Identity</th>
                                <th className="px-8 py-5 font-semibold text-slate-600 uppercase tracking-wider text-[11px]">Event Narrative</th>
                                <th className="px-8 py-5 font-semibold text-slate-600 uppercase tracking-wider text-[11px]">Network Origin</th>
                                <th className="px-8 py-5 font-semibold text-slate-600 uppercase tracking-wider text-[11px] text-right">Synchronization</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {logs.map((log) => (
                                <tr key={log.id} className="group hover:bg-blue-50/20 transition-all">
                                    <td className="px-8 py-4 font-bold text-slate-900 tracking-tight">
                                        {log.action}
                                    </td>
                                    <td className="px-8 py-4">
                                        <Badge variant="outline" className="border-slate-200 text-slate-600 bg-slate-50/50 font-bold text-[10px] rounded-lg">
                                            {log.user.toUpperCase()}
                                        </Badge>
                                    </td>
                                    <td className="px-8 py-4 text-slate-500 text-xs italic">
                                        "{log.details}"
                                    </td>
                                    <td className="px-8 py-4">
                                        <span className="font-mono text-[10px] text-slate-400 py-1 px-2 bg-slate-50 border border-slate-100 rounded-lg">
                                            {log.ip}
                                        </span>
                                    </td>
                                    <td className="px-8 py-4 text-right">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                            {log.date}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
