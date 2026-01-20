"use client"
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Info, CheckCircle, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const alerts = [
    { id: 1, type: 'critical', message: 'Meter #1300 offline for > 24h', date: '2024-03-30 10:00 AM' },
    { id: 2, type: 'warning', message: 'Low water pressure reported in Zone A', date: '2024-03-29 02:30 PM' },
    { id: 3, type: 'info', message: 'Scheduled maintenance for tomorrow', date: '2024-03-28 09:00 AM' },
];

export default function AlertsPage() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">System Monitoring</h1>
                    <p className="text-sm text-slate-500 mt-1">Real-time alerts and critical event notifications.</p>
                </div>
                <Button variant="outline" className="rounded-xl border-slate-200 hover:bg-slate-50 text-xs font-bold uppercase tracking-wider h-11 px-6 transition-all active:scale-95">
                    Clear Workspace
                </Button>
            </div>

            {/* Alerts List */}
            <div className="grid gap-4">
                {alerts.map((alert) => (
                    <div
                        key={alert.id}
                        className={cn(
                            "group relative overflow-hidden flex items-start gap-5 p-6 bg-white rounded-[2rem] border border-slate-200 transition-all hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-0.5"
                        )}
                    >
                        {/* Status Accent Line */}
                        <div className={cn(
                            "absolute left-0 top-0 bottom-0 w-1.5",
                            alert.type === 'critical' ? "bg-red-500" : alert.type === 'warning' ? "bg-amber-500" : "bg-blue-500"
                        )} />

                        <div className={cn(
                            "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-sm transition-transform group-hover:scale-110",
                            alert.type === 'critical' ? "bg-red-50 text-red-600" : alert.type === 'warning' ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600"
                        )}>
                            {alert.type === 'critical' && <AlertTriangle className={cn("h-6 w-6", alert.type === 'critical' && "animate-pulse")} />}
                            {alert.type === 'warning' && <Bell className="h-6 w-6" />}
                            {alert.type === 'info' && <Info className="h-6 w-6" />}
                        </div>

                        <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{alert.message}</h3>
                                <time className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{alert.date}</time>
                            </div>
                            <p className="text-sm text-slate-500 leading-relaxed max-w-2xl">
                                System automatic detection triggered this {alert.type} notification. Reviewing required if status is critical.
                            </p>

                            <div className="pt-2 flex items-center gap-2">
                                <Badge className={cn(
                                    "text-[9px] font-black uppercase tracking-tighter px-2.5 py-0.5 rounded-full border-0",
                                    alert.type === 'critical' ? "bg-red-100 text-red-700" : alert.type === 'warning' ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                                )}>
                                    {alert.type} priority
                                </Badge>
                                <span className="h-1 w-1 rounded-full bg-slate-200" />
                                <span className="text-[10px] text-slate-400 font-medium">Auto-generated via Gateway</span>
                            </div>
                        </div>

                        <Button variant="ghost" size="icon" className="text-slate-300 hover:text-slate-600 transition-colors">
                            <CheckCircle className="h-5 w-5" />
                        </Button>
                    </div>
                ))}
            </div>

            {alerts.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-200">
                    <div className="h-16 w-16 bg-white rounded-3xl flex items-center justify-center shadow-lg text-slate-200">
                        <Bell className="h-8 w-8" />
                    </div>
                    <p className="mt-6 text-slate-400 font-bold uppercase tracking-widest text-[11px]">No active alerts</p>
                </div>
            )}
        </div>
    );
}
