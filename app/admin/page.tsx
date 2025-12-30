"use client";

import { useEffect, useState } from "react";
import {
    Users,
    Droplet,
    Activity,
    TrendingUp,
    AlertCircle,
    FileText
} from "lucide-react";
import { adminApi } from "@/lib/client";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalMeters: 0,
        assignedMeters: 0,
        totalRefills: 0,
        recentActivity: [] as any[],
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const [metersRes, usersRes] = await Promise.all([
                    adminApi.getMeters(),
                    adminApi.getUsers(0, 1)
                ]);

                const meters = metersRes.data;
                const users = usersRes.data;

                const assigned = meters.filter((m: any) => m.attributed).length;

                setStats({
                    totalUsers: users.length,
                    totalMeters: meters.length,
                    assignedMeters: assigned,
                    totalRefills: 0,
                    recentActivity: []
                });
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setLoading(false);
            }
        }

        fetchStats();
    }, []);

    async function handleGenerateReport() {
        setLoading(true);
        try {
            // Dynamically import jsPDF to avoid SSR issues
            const jsPDF = (await import("jspdf")).default;
            const autoTable = (await import("jspdf-autotable")).default;

            const doc = new jsPDF();

            // fetch latest data
            const [metersRes, usersRes] = await Promise.all([
                adminApi.getMeters(),
                adminApi.getUsers(0, 1000)
            ]);
            const meters = metersRes.data;
            const users = usersRes.data;

            // Title
            doc.setFontSize(20);
            doc.text("WaterPaid - System Report", 14, 22);
            doc.setFontSize(11);
            doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

            // Dashboard Stats
            doc.setFontSize(14);
            doc.text("Overview", 14, 45);

            const assignedCount = meters.filter((m: any) => m.attributed).length;
            const statsData = [
                ["Total Users", users.length.toString()],
                ["Total Meters", meters.length.toString()],
                ["Assigned Meters", assignedCount.toString()],
                ["Utilization", `${Math.round((assignedCount / (meters.length || 1)) * 100)}%`]
            ];

            autoTable(doc, {
                startY: 50,
                head: [['Metric', 'Value']],
                body: statsData,
                theme: 'striped',
                headStyles: { fillColor: [15, 23, 42] } // Slate 900
            });

            // Meters List
            const finalY = (doc as any).lastAutoTable.finalY || 50;
            doc.text("Meters Inventory", 14, finalY + 15);

            const metersData = meters.map((m: any) => [
                m.serial_id,
                m.device_id || '-',
                m.attributed ? 'Yes' : 'No',
                m.meter_state,
                m.User ? m.User.user_pseudo : '-'
            ]);

            autoTable(doc, {
                startY: finalY + 20,
                head: [['Serial ID', 'Device ID', 'Assigned', 'State', 'User']],
                body: metersData,
                theme: 'grid',
                headStyles: { fillColor: [59, 130, 246] } // Blue 500
            });

            doc.save(`WaterPaid_Report_${new Date().toISOString().split('T')[0]}.pdf`);
            alert("Report downloaded successfully!");
        } catch (error) {
            console.error(error);
            alert("Failed to generate PDF.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h2>
                    <p className="text-slate-500">Overview of your water management system.</p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={handleGenerateReport} disabled={loading}>
                        <FileText className="mr-2 h-4 w-4" />
                        Generate Report
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Meters"
                    value={stats.totalMeters.toString()}
                    icon={<Droplet className="h-4 w-4 text-slate-500" />}
                    loading={loading}
                />
                <StatsCard
                    title="Active Users"
                    value={stats.totalUsers.toString()}
                    icon={<Users className="h-4 w-4 text-slate-500" />}
                    loading={loading}
                />
                <StatsCard
                    title="Assigned Meters"
                    value={stats.assignedMeters.toString()}
                    description={`${Math.round((stats.assignedMeters / (stats.totalMeters || 1)) * 100)}% utilization`}
                    icon={<Activity className="h-4 w-4 text-slate-500" />}
                    loading={loading}
                />
                <StatsCard
                    title="Refills"
                    value="-"
                    description="Transaction data"
                    icon={<TrendingUp className="h-4 w-4 text-slate-500" />}
                    loading={loading}
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4 rounded-xl border border-slate-200 bg-white shadow-sm p-6">
                    <h3 className="font-semibold text-slate-900">System Overview</h3>
                    <div className="mt-4 flex h-[200px] items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50">
                        <p className="text-sm text-slate-500">Chart / Analytics Placeholder</p>
                    </div>
                </div>
                <div className="col-span-3 rounded-xl border border-slate-200 bg-white shadow-sm p-6">
                    <h3 className="font-semibold text-slate-900">Recent Alerts</h3>
                    <div className="mt-4 space-y-4">
                        <div className="flex items-start gap-4 rounded-lg bg-slate-50 p-3">
                            <AlertCircle className="mt-0.5 h-5 w-5 text-blue-500" />
                            <div>
                                <p className="text-sm font-medium text-slate-900">System Normal</p>
                                <p className="text-xs text-slate-500">All services operational.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatsCard({ title, value, description, icon, loading }: any) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="tracking-tight text-sm font-medium text-slate-500">{title}</h3>
                {icon}
            </div>
            <div>
                {loading ? (
                    <div className="h-8 w-16 animate-pulse rounded bg-slate-100" />
                ) : (
                    <div className="text-2xl font-bold text-slate-900">{value}</div>
                )}
                {description && <p className="text-xs text-slate-500 mt-1">{description}</p>}
            </div>
        </div>
    )
}
