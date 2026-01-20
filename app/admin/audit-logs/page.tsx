"use client"
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function AuditLogsPage() {
    const [logs] = useState<any[]>([]);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">System Logs</h1>
                    <p className="text-sm text-slate-500 mt-1">Detailed audit trail of all administrative and system actions.</p>
                </div>
            </div>

            {/* Data Grid */}
            <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden min-h-[400px] flex flex-col">
                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-sm text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-5 font-bold text-slate-400 uppercase tracking-widest text-[9px]">Timestamp</th>
                                <th className="px-8 py-5 font-bold text-slate-400 uppercase tracking-widest text-[9px]">Subject / Entity</th>
                                <th className="px-8 py-5 font-bold text-slate-400 uppercase tracking-widest text-[9px]">Action</th>
                                <th className="px-8 py-5 font-bold text-slate-400 uppercase tracking-widest text-[9px] text-right">Source IP</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {logs.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="py-32 text-center text-slate-300 italic font-medium">
                                        No recent system activity found.
                                    </td>
                                </tr>
                            ) : (
                                logs.map((log) => (
                                    <tr key={log.id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-4">
                                            <span className="font-mono text-[10px] text-slate-500">{log.timestamp}</span>
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="text-[9px] font-black tracking-tighter uppercase px-2 py-0 border-slate-200">
                                                    {log.entity}
                                                </Badge>
                                                <span className="font-bold text-slate-900 text-xs">ID: {log.entityId}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <span className="text-slate-600 font-medium">{log.action}</span>
                                        </td>
                                        <td className="px-8 py-4 text-right font-mono text-[10px] text-slate-400">
                                            {log.ip}
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
