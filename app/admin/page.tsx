"use client"
import React from 'react';
import { DollarSign, Droplets, Activity, Users, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { adminApi } from "@/lib/client";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Mock Chart Component (Simple CSS implementation to avoid dependency issues for now)
const SimpleBarChart = ({ data }: { data: number[] }) => {
    const max = Math.max(...data);
    return (
        <div className="flex items-end justify-between h-32 gap-2 mt-4">
            {data.map((value, i) => (
                <div key={i} className="w-full bg-blue-600/20 rounded-t-lg relative group hover:bg-blue-600/40 transition-all duration-300" style={{ height: `${(value / max) * 100}%` }}>
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 shadow-xl text-white text-[10px] font-bold px-2 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 scale-90 group-hover:scale-100 origin-bottom">
                        {value.toLocaleString()} FCFA
                    </div>
                </div>
            ))}
        </div>
    );
};

export default function AdminDashboard() {
    const router = useRouter();
    // In a real app, use SWR or React Query
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
                const history = historyRes.data || [];

                const totalRevenue = history
                    .filter(t => t.status === 'COMPLETED')
                    .reduce((acc, t) => acc + (t.amount || 0), 0);

                const totalWater = history
                    .filter(t => t.status === 'COMPLETED')
                    .reduce((acc, t) => acc + (t.volume_liters || 0), 0);

                setStats({
                    totalRevenue,
                    totalWaterDistributed: totalWater,
                    activeMeters: meters.filter(m => m.meter_state === 'ON').length,
                    totalUsers: users.length
                });

                setRecentRefills(history.slice(0, 5).map(t => ({
                    id: t.transaction_id,
                    user: users.find(u => u.user_id === t.user_id)?.user_pseudo || 'User',
                    amount: t.amount,
                    method: t.payment_method,
                    status: t.status.toLowerCase(),
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

    return (
        <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Dashboard Overview</h1>
                <p className="text-slate-500">Real-time performance metrics and recent system activity.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Revenue"
                    value={`${stats.totalRevenue.toLocaleString()} FCFA`}
                    icon={<div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><DollarSign className="h-5 w-5" /></div>}
                    trend="+12% vs last month"
                />
                <StatsCard
                    title="Water Consumption"
                    value={`${stats.totalWaterDistributed.toLocaleString()} L`}
                    icon={<div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Droplets className="h-5 w-5" /></div>}
                    trend="+8.2% vs last month"
                />
                <StatsCard
                    title="Operating Meters"
                    value={stats.activeMeters.toString()}
                    icon={<div className="p-2 bg-amber-50 rounded-lg text-amber-600"><Activity className="h-5 w-5" /></div>}
                    trend="System monitoring active"
                />
                <StatsCard
                    title="Total Subscribers"
                    value={stats.totalUsers.toString()}
                    icon={<div className="p-2 bg-purple-50 rounded-lg text-purple-600"><Users className="h-5 w-5" /></div>}
                    trend="Active community"
                />
            </div>

            {/* Charts & Recent Activity */}
            <div className="grid gap-8 lg:grid-cols-7 ">
                <Card className="lg:col-span-4 border-slate-200 shadow-sm rounded-3xl overflow-hidden hover:shadow-md transition-shadow duration-300">
                    <CardHeader className="p-8 pb-0">
                        <CardTitle className="text-xl font-bold">Revenue Analytics</CardTitle>
                        <CardDescription>Monthly distribution of income across all meters.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 pt-4">
                        <SimpleBarChart data={[4500, 6000, 5500, 7000, 8500, 9000, 8000, 9500, 10000, 11000, 10500, 12000]} />
                        <div className="flex justify-between mt-6 text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2">
                            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                            <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-3 border-slate-200 shadow-sm rounded-3xl overflow-hidden hover:shadow-md transition-shadow duration-300">
                    <CardHeader className="p-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-xl font-bold">Recent Credits</CardTitle>
                                <CardDescription>Latest transactions processed.</CardDescription>
                            </div>
                            <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50 rounded-xl" onClick={() => router.push('/admin/history')}>
                                View all
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="px-8 pb-8 pt-0">
                        <div className="space-y-6">
                            {loading ? (
                                <div className="space-y-4">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="h-12 w-full bg-slate-50 animate-pulse rounded-xl" />
                                    ))}
                                </div>
                            ) : recentRefills.length === 0 ? (
                                <p className="text-center py-10 text-slate-400 text-sm italic">No recent transactions.</p>
                            ) : (
                                recentRefills.map((refill) => (
                                    <div key={refill.id} className="group flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs ring-4 ring-white">
                                                {refill.user.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex flex-col">
                                                <p className="text-sm font-bold text-slate-900 leading-tight">{refill.user}</p>
                                                <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-tight">{refill.method} • {refill.date}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-sm font-black text-slate-900">+{refill.amount.toLocaleString()}</span>
                                            <Badge variant="outline" className={cn(
                                                "mt-1 text-[9px] h-4 py-0 px-1.5 uppercase tracking-wide border-0 shadow-none",
                                                refill.status === 'completed' ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                                            )}>
                                                {refill.status}
                                            </Badge>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function StatsCard({ title, value, icon, trend }: { title: string, value: string, icon: React.ReactNode, trend?: string }) {
    return (
        <Card className="border-slate-200 shadow-sm rounded-3xl overflow-hidden hover:shadow-md hover:translate-y-[-2px] transition-all duration-300">
            <CardContent className="p-8">
                <div className="flex items-start justify-between">
                    <div className="space-y-4">
                        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
                        <div className="text-3xl font-black text-slate-900 tracking-tight">{value}</div>
                    </div>
                </div>
                {trend && (
                    <div className="mt-6 flex items-center gap-2">
                        <div className="h-1 w-full bg-slate-50 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full w-[60%]" />
                        </div>
                        <span className="text-[11px] font-bold text-slate-400 whitespace-nowrap">{trend}</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
