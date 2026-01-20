"use client"
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Bell, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AlertsPage() {
    const [alerts] = useState<any[]>([]);

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

            {/* Empty State / Stable Message */}
            <div className="flex flex-col items-center justify-center py-32 bg-white/50 backdrop-blur-sm rounded-[3rem] border border-slate-100 shadow-sm">
                <div className="p-6 bg-blue-50/50 rounded-[2rem] text-blue-600 animate-pulse mb-6">
                    <CheckCircle className="h-12 w-12" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">System is Stable</h2>
                <p className="text-slate-500 text-sm mt-2 max-w-xs text-center leading-relaxed">
                    No critical events or water flow anomalies have been detected in the last 24 hours.
                </p>
                <div className="mt-8 flex items-center gap-2">
                    <Badge variant="outline" className="border-slate-200 text-slate-400 font-bold uppercase tracking-tighter text-[9px] px-3 py-1">
                        Monitoring Active
                    </Badge>
                </div>
            </div>

            {/* Summary indicator */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm">
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Active Alerts</div>
                    <div className="text-2xl font-black text-slate-900">0</div>
                </div>
                <div className="p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm">
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Meters Monitored</div>
                    <div className="text-2xl font-black text-slate-900">Active</div>
                </div>
                <div className="p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm">
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Last Update</div>
                    <div className="text-2xl font-black text-slate-900">Just Now</div>
                </div>
            </div>
        </div>
    );
}
