"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    FileDown,
    Plus,
    Calendar,
    Download,
    Loader2,
    Search,
    FileText,
    TrendingUp
} from "lucide-react";
import { adminApi } from "@/lib/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";
import { useToast } from "@/lib/toast";
import { Badge } from "@/components/ui/badge";
import type { Report, ReportFormat } from "@/types/api";

const createReportSchema = z.object({
    started_at: z.string().min(1, "Start date is required"),
    ended_at: z.string().min(1, "End date is required"),
    format: z.enum(["CSV", "PDF"]),
});

export default function ReportsPage() {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const toast = useToast();

    const form = useForm<z.infer<typeof createReportSchema>>({
        resolver: zodResolver(createReportSchema),
        defaultValues: {
            started_at: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
            ended_at: new Date().toISOString().split('T')[0],
            format: "CSV",
        },
    });

    useEffect(() => {
        loadReports();
    }, []);

    async function loadReports() {
        setLoading(true);
        try {
            const res = await adminApi.getReports({});
            setReports(res.data);
        } catch (error) {
            toast.error("Failed to load reports");
        } finally {
            setLoading(false);
        }
    }

    async function handleCreateReport(values: z.infer<typeof createReportSchema>) {
        setSubmitting(true);
        try {
            await adminApi.createReport({
                started_at: new Date(values.started_at).toISOString(),
                ended_at: new Date(values.ended_at).toISOString(),
                format: values.format as ReportFormat,
            });
            toast.success("Report generated successfully");
            setCreateDialogOpen(false);
            await loadReports();
        } catch (error) {
            toast.error("Failed to generate report");
        } finally {
            setSubmitting(false);
        }
    }

    const getStatusColor = (format: string) => {
        return format === 'PDF' ? 'text-red-600 bg-red-50 border-red-100' : 'text-emerald-600 bg-emerald-50 border-emerald-100';
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Infrastructure Reports</h1>
                    <p className="text-sm text-slate-500 mt-1">Generate and download technical and financial audit reports.</p>
                </div>
                <Button
                    onClick={() => setCreateDialogOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-100 transition-all active:scale-95"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Generate New Report
                </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                    { label: 'Total Reports', value: reports.length, icon: FileText, color: 'text-blue-600' },
                    { label: 'This Month', value: reports.filter(r => new Date(r.created_at).getMonth() === new Date().getMonth()).length, icon: Calendar, color: 'text-emerald-600' },
                    { label: 'Report Nodes', value: 'Global', icon: TrendingUp, color: 'text-indigo-600' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                        <div className={`p-3 rounded-xl bg-slate-50 ${stat.color}`}>
                            <stat.icon className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                            <p className="text-xl font-bold text-slate-900">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Reports List */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-5 font-semibold text-slate-600 uppercase tracking-wider text-[11px]">Report Details</th>
                                <th className="px-8 py-5 font-semibold text-slate-600 uppercase tracking-wider text-[11px]">Period Covered</th>
                                <th className="px-8 py-5 font-semibold text-slate-600 uppercase tracking-wider text-[11px]">Format</th>
                                <th className="px-8 py-5 font-semibold text-slate-600 uppercase tracking-wider text-[11px]">Generation Date</th>
                                <th className="px-8 py-5 font-semibold text-slate-600 uppercase tracking-wider text-[11px] text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                                            <span className="text-slate-400 font-medium">Fetching archives...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : reports.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center text-slate-400 italic">
                                        No reports generated yet.
                                    </td>
                                </tr>
                            ) : (
                                reports.map(report => (
                                    <tr key={report.report_id} className="group hover:bg-blue-50/30 transition-colors">
                                        <td className="px-8 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                                                    <FileDown className="h-4 w-4" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-slate-900 tracking-tight">Audit_{report.report_id.slice(0, 8)}</span>
                                                    <span className="text-[10px] text-slate-400 font-mono uppercase">ID: {report.report_id.slice(0, 18)}...</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="flex items-center gap-2 text-slate-600">
                                                <span className="font-medium">{new Date(report.started_at).toLocaleDateString()}</span>
                                                <span className="text-slate-300">→</span>
                                                <span className="font-medium">{new Date(report.ended_at).toLocaleDateString()}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <Badge variant="outline" className={getStatusColor(report.format)}>
                                                {report.format}
                                            </Badge>
                                        </td>
                                        <td className="px-8 py-4 text-slate-500 font-medium">
                                            {new Date(report.created_at).toLocaleString()}
                                        </td>
                                        <td className="px-8 py-4 text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-bold text-xs uppercase tracking-tighter"
                                                onClick={() => {
                                                    toast.info("Downloading file...");
                                                    // Logic for actual download would go here
                                                }}
                                            >
                                                <Download className="mr-2 h-3.5 w-3.5" />
                                                Download
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Report Dialog */}
            <Dialog
                open={createDialogOpen}
                onClose={() => !submitting && setCreateDialogOpen(false)}
                title="Generate New Audit Report"
                description="Select the time period and output format for the infrastructure audit."
            >
                <form onSubmit={form.handleSubmit(handleCreateReport)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-900">Start Date</label>
                            <Input
                                type="date"
                                {...form.register("started_at")}
                                disabled={submitting}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-900">End Date</label>
                            <Input
                                type="date"
                                {...form.register("ended_at")}
                                disabled={submitting}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-900">Export Format</label>
                        <select
                            className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...form.register("format")}
                            disabled={submitting}
                        >
                            <option value="CSV">CSV Spreadsheet</option>
                            <option value="PDF">PDF Document</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setCreateDialogOpen(false)}
                            disabled={submitting}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" loading={submitting} className="bg-blue-600 text-white hover:bg-blue-700 transition-all">
                            Generate Report
                        </Button>
                    </div>
                </form>
            </Dialog>
        </div>
    );
}
