"use client"
import React from 'react';
import { DollarSign, Droplets, Activity, Users, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { adminApi } from "@/lib/client";
import { Badge } from "@/components/ui/badge";

// Mock Chart Component (Simple CSS implementation to avoid dependency issues for now)
const SimpleBarChart = ({ data }: { data: number[] }) => {
    const max = Math.max(...data);
    return (
        <div className="flex items-end justify-between h-32 gap-2 mt-4">
            {data.map((value, i) => (
                <div key={i} className="w-full bg-primary/20 rounded-t-sm relative group hover:bg-primary/40 transition-colors" style={{ height: `${(value / max) * 100}%` }}>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        {value}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default function AdminDashboard() {
    // In a real app, use SWR or React Query
    const [stats, setStats] = React.useState({
        totalRevenue: 0,
        totalWaterDistributed: 0,
        activeMeters: 0,
        totalUsers: 0
    });
    const [recentRefills, setRecentRefills] = React.useState<any[]>([]);

    React.useEffect(() => {
        // Mock data fetching or real API calls
        const fetchData = async () => {
            try {
                // Fetch real data if APIs are ready, otherwise use mock for UI demo
                // const users = await adminApi.getUsers();
                // setStats(...)

                // Demo Data
                setStats({
                    totalRevenue: 1250000,
                    totalWaterDistributed: 450000,
                    activeMeters: 142,
                    totalUsers: 89
                });

                setRecentRefills([
                    { id: 1, user: "John Doe", amount: 5000, method: "Orange Money", status: "completed", date: "2024-03-10" },
                    { id: 2, user: "Jane Smith", amount: 2500, method: "MTN MoMo", status: "completed", date: "2024-03-10" },
                    { id: 3, user: "Alice Brown", amount: 10000, method: "Card", status: "failed", date: "2024-03-09" },
                ]);

            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Last updated: Today, 10:42 AM</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Revenue"
                    value={`${stats.totalRevenue.toLocaleString()} FCFA`}
                    icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
                    trend="+20.1% from last month"
                />
                <StatsCard
                    title="Water Distributed"
                    value={`${stats.totalWaterDistributed.toLocaleString()} L`}
                    icon={<Droplets className="h-4 w-4 text-muted-foreground" />}
                    trend="+10.5% from last month"
                />
                <StatsCard
                    title="Active Meters"
                    value={stats.activeMeters.toString()}
                    icon={<Activity className="h-4 w-4 text-muted-foreground" />}
                    trend="+5 new this week"
                />
                <StatsCard
                    title="Total Users"
                    value={stats.totalUsers.toString()}
                    icon={<Users className="h-4 w-4 text-muted-foreground" />}
                    trend="+12 signups"
                />
            </div>

            {/* Charts & Recent Activity */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Revenue Overview</CardTitle>
                        <CardDescription>Monthly revenue breakdown for the current year.</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <SimpleBarChart data={[4500, 6000, 5500, 7000, 8500, 9000, 8000, 9500, 10000, 11000, 10500, 12000]} />
                        <div className="flex justify-between mt-2 text-xs text-muted-foreground px-2">
                            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                            <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Sales</CardTitle>
                        <CardDescription>You made 265 sales this month.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {recentRefills.map((refill) => (
                                <div key={refill.id} className="flex items-center">
                                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                                        <p className="text-xs font-medium leading-none text-primary">{refill.user.charAt(0)}</p>
                                    </div>
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none">{refill.user}</p>
                                        <p className="text-xs text-muted-foreground">{refill.method}</p>
                                    </div>
                                    <div className="ml-auto font-medium">+{refill.amount.toLocaleString()}</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function StatsCard({ title, value, icon, trend }: { title: string, value: string, icon: React.ReactNode, trend?: string }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {trend && <p className="text-xs text-muted-foreground">{trend}</p>}
            </CardContent>
        </Card>
    );
}
