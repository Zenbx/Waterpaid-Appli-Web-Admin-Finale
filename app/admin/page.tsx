"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
    Users,
    Activity,
    Droplets,
    Wallet,
    BarChart3,
    History
} from "lucide-react";
import { adminApi } from "@/lib/client";
import { cn } from "@/lib/utils";

export default function AdminDashboard() {
    // Live Chart placeholder (Only show if we have historical data, for now clean empty state)
    const MetricsPlaceholder = () => (
        <div className="flex flex-col items-center justify-center h-48 bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-200">
            <div className="p-3 bg-white rounded-2xl text-slate-200 mb-2">
                <BarChart3 className="h-6 w-6" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Detailed analytics pending</p>
        </div>
    );

    const [stats, setStats] = React.useState({
        totalRevenue: 0,
        totalWaterDistributed: 0,
        activeMeters: 0,
        totalUsers: 0
    });
    const [recentRefills, setRecentRefills] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [usersRes, metersRes, historyRes] = await Promise.all([
                    adminApi.getUsers(),
                    adminApi.getMeters(),
                    adminApi.getTransactionHistory({})
                ]);

                const users = usersRes.data || [];
                const meters = metersRes.data || [];
                const history = (historyRes.data as any[]) || [];

                const totalRevenue = history
                    .filter(t => t.status === 'COMPLETED' || t.status === 'SUCCEEDED')
                    .reduce((acc, t) => acc + (t.amount || t.price || 0), 0);

                const totalWater = history
                    .filter(t => t.status === 'COMPLETED' || t.status === 'SUCCEEDED')
                    .reduce((acc, t) => acc + (t.volume_liters || t.volume || 0), 0);

                setStats({
                    totalRevenue,
                    totalWaterDistributed: totalWater,
                    activeMeters: meters.filter(m => m.meter_state === 'ACTIVE').length,
                    totalUsers: users.length
                });

                setRecentRefills(history.slice(0, 5).map(t => ({
                    id: t.transaction_id || t.refill_id,
                    user: users.find(u => u.user_id === t.user_id)?.user_pseudo || 'User',
                    amount: t.amount || t.price || 0,
                    method: t.payment_method || t.refill_method || 'CASH',
                    status: (t.status || t.refill_state || 'unknown').toLowerCase(),
                    date: new Date(t.created_at).toLocaleDateString()
                })));

            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Syncing Live Cluster...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black tracking-tighter text-slate-900">Infrastructure Dashboard</h1>
                <p className="text-slate-500 font-medium">Global operations monitoring and node telemetry.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Revenue', value: `${stats.totalRevenue.toLocaleString()} XAF`, icon: Wallet, color: 'text-blue-600', trend: 'Live Data' },
                    { label: 'Water Distributed', value: `${stats.totalWaterDistributed.toLocaleString()} L`, icon: Droplets, color: 'text-blue-500', trend: 'Live Data' },
                    { label: 'Active Meters', value: stats.activeMeters, icon: Activity, color: 'text-indigo-600', trend: 'System Status' },
                    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-indigo-500', trend: 'Global Database' },
                ].map((stat, i) => (
                    <div key={i} className="group p-8 bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-white/40 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500">
                        <div className="flex items-center justify-between mb-6">
                            <div className={cn("p-4 rounded-3xl bg-slate-50 transition-colors group-hover:bg-blue-50", stat.color)}>
                                <stat.icon className="h-6 w-6" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tighter">{stat.value}</h3>
                        </div>
                        <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{stat.trend}</span>
                            <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Overview */}
                <div className="lg:col-span-2 p-8 bg-white/70 backdrop-blur-xl rounded-[3rem] border border-white/40 shadow-2xl shadow-slate-200/40">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">Revenue Stream</h3>
                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mt-1">Telemetry analytics</p>
                        </div>
                        <div className="p-2 bg-slate-50 rounded-xl">
                            <BarChart3 className="h-5 w-5 text-slate-400" />
                        </div>
                    </div>
                    <MetricsPlaceholder />
                </div>

                {/* Recent Refills (Live Data) */}
                <div className="p-8 bg-white/70 backdrop-blur-xl rounded-[3rem] border border-white/40 shadow-2xl shadow-slate-200/40">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight mb-8">Recent Credits</h3>
                    <div className="space-y-6">
                        {recentRefills.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 opacity-30">
                                <History className="h-8 w-8 mb-2" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">No recent transactions</span>
                            </div>
                        ) : recentRefills.map((refill, i) => (
                            <div key={i} className="flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-2xl bg-slate-50 flex items-center justify-center font-black text-xs text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                        {refill.user.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-900">{refill.user}</p>
                                        <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">{refill.method}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-black text-slate-900">+{refill.amount.toLocaleString()}</p>
                                    <p className={cn("text-[9px] font-black uppercase tracking-tighter mt-1",
                                        refill.status === 'completed' || refill.status === 'succeeded' ? 'text-emerald-500' : 'text-amber-500')}>
                                        {refill.status}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
