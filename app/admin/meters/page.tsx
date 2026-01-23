"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Plus,
    Search,
    LinkIcon,
    Trash2,
    CheckCircle,
    XCircle,
    Loader2,
    Users as UsersIcon,
    Droplets,
    Battery,
    Wifi,
    Shield,
    RotateCcw,
    Eye
} from "lucide-react";
import { adminApi } from "@/lib/client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, ConfirmDialog } from "@/components/ui/dialog";
import { useToast } from "@/lib/toast";
import { Badge } from "@/components/ui/badge";
import type { Meter } from "@/types/api";

const createMeterSchema = z.object({
    serial_id: z.string().min(3, "Serial ID must be at least 3 characters"),
    device_id: z.string().optional(),
});

const linkDeviceSchema = z.object({
    dev_eui: z.string().min(1, "Device EUI is required"),
});

const directRechargeSchema = z.object({
    volume_liters: z.number().min(0.1, "Volume must be greater than 0"),
});

export default function MetersPage() {
    const [meters, setMeters] = useState<Meter[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [linkDialogOpen, setLinkDialogOpen] = useState(false);
    const [rechargeDialogOpen, setRechargeDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedMeter, setSelectedMeter] = useState<Meter | null>(null);
    const [viewTokenDialogOpen, setViewTokenDialogOpen] = useState(false);
    const [meterToken, setMeterToken] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const toast = useToast();

    const createForm = useForm<z.infer<typeof createMeterSchema>>({
        resolver: zodResolver(createMeterSchema),
        defaultValues: {
            serial_id: "",
            device_id: "",
        },
    });

    const linkForm = useForm<z.infer<typeof linkDeviceSchema>>({
        resolver: zodResolver(linkDeviceSchema),
        defaultValues: {
            dev_eui: "",
        },
    });

    const rechargeForm = useForm<z.infer<typeof directRechargeSchema>>({
        resolver: zodResolver(directRechargeSchema),
        defaultValues: {
            volume_liters: 0,
        },
    });

    useEffect(() => {
        loadMeters();
    }, []);

    async function loadMeters() {
        setLoading(true);
        try {
            const res = await adminApi.getMeters();
            setMeters(res.data);
        } catch (error) {
            toast.error("Failed to load meters");
        } finally {
            setLoading(false);
        }
    }

    async function handleCreateMeter(values: z.infer<typeof createMeterSchema>) {
        setSubmitting(true);
        try {
            await adminApi.createMeter(values);
            toast.success("Meter created successfully");
            setCreateDialogOpen(false);
            createForm.reset();
            await loadMeters();
        } catch (error) {
            toast.error("Failed to create meter");
        } finally {
            setSubmitting(false);
        }
    }

    async function handleLinkDevice(values: z.infer<typeof linkDeviceSchema>) {
        if (!selectedMeter) return;

        setSubmitting(true);
        try {
            await adminApi.linkDevice(selectedMeter.meter_id, values.dev_eui);
            toast.success("Device linked successfully");
            setLinkDialogOpen(false);
            linkForm.reset();
            setSelectedMeter(null);
            await loadMeters();
        } catch (error) {
            toast.error("Failed to link device");
        } finally {
            setSubmitting(false);
        }
    }

    async function handleDirectRecharge(values: z.infer<typeof directRechargeSchema>) {
        if (!selectedMeter) return;

        setSubmitting(true);
        try {
            await adminApi.refillMeter(selectedMeter.meter_id, {
                amount: 0,
                volume_liters: values.volume_liters,
                payment_method: 'CASH'
            });
            toast.success(`Direct recharge of ${values.volume_liters}L successful`);
            setRechargeDialogOpen(false);
            rechargeForm.reset();
            setSelectedMeter(null);
            await loadMeters();
        } catch (error) {
            toast.error("Failed to perform direct recharge");
        } finally {
            setSubmitting(false);
        }
    }

    async function handleDelete() {
        if (!selectedMeter) return;

        setSubmitting(true);
        try {
            await adminApi.deleteMeter(selectedMeter.meter_id);
            toast.success("Meter deleted successfully");
            setDeleteDialogOpen(false);
            setSelectedMeter(null);
            setMeters(meters.filter(m => m.meter_id !== selectedMeter.meter_id));
        } catch (error) {
            toast.error("Failed to delete meter");
        } finally {
            setSubmitting(false);
        }
    }

    async function handleGenerateToken() {
        if (!selectedMeter) return;
        setSubmitting(true);
        try {
            const res = await adminApi.generateMeterToken(selectedMeter.meter_id);
            setMeterToken(res.data.token);
            toast.success("New token generated");
            await loadMeters();
        } catch (error) {
            toast.error("Failed to generate token");
        } finally {
            setSubmitting(false);
        }
    }

    async function handleViewToken(meter: Meter) {
        setSelectedMeter(meter);
        setMeterToken(meter.token || null);
        setViewTokenDialogOpen(true);
    }

    const filteredMeters = meters.filter(m =>
        m.serial_id.toLowerCase().includes(search.toLowerCase()) ||
        (m.device_id && m.device_id.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Page Title & Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Meter Management</h1>
                    <p className="text-sm text-slate-500 mt-1">Monitor, configure and assign water meters to users.</p>
                </div>
                <Button
                    onClick={() => setCreateDialogOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-100 transition-all active:scale-95"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Record New Meter
                </Button>
            </div>

            {/* Quick Stats / Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        className="pl-10 bg-slate-50 border-none focus-visible:ring-1 focus-visible:ring-blue-500 rounded-xl"
                        placeholder="Search by Serial or Device EUI..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-6 px-2">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Total Meters</span>
                        <span className="text-lg font-bold text-slate-900">{meters.length}</span>
                    </div>
                    <div className="h-8 w-[1px] bg-slate-100" />
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Active</span>
                        <span className="text-lg font-bold text-green-600">{meters.filter(m => m.meter_state === 'ACTIVE').length}</span>
                    </div>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-5 font-semibold text-slate-600 uppercase tracking-wider text-[11px]">Identification</th>
                                <th className="px-8 py-5 font-semibold text-slate-600 uppercase tracking-wider text-[11px]">Current Owner</th>
                                <th className="px-8 py-5 font-semibold text-slate-600 uppercase tracking-wider text-[11px]">Availability</th>
                                <th className="px-8 py-5 font-semibold text-slate-600 uppercase tracking-wider text-[11px]">Node Telemetry</th>
                                <th className="px-8 py-5 font-semibold text-slate-600 uppercase tracking-wider text-[11px]">Flow Status</th>
                                <th className="px-8 py-5 font-semibold text-slate-600 uppercase tracking-wider text-[11px] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                                            <span className="text-slate-400 font-medium">Synchronizing meters...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredMeters.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center text-slate-400 italic">
                                        No meters found matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                filteredMeters.map(meter => (
                                    <tr key={meter.meter_id} className="group hover:bg-blue-50/30 transition-colors">
                                        <td className="px-8 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-900 tracking-tight">{meter.serial_id}</span>
                                                <span className="text-[11px] text-slate-400 font-mono mt-0.5">
                                                    {meter.device_id || 'NO DEVICE LINKED'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4 text-slate-600">
                                            {meter.User ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-600 font-bold text-[10px]">
                                                        {(meter.User.user_pseudo || 'U').charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-bold text-slate-900 leading-none">
                                                            {meter.User.user_pseudo || 'User'}
                                                        </span>
                                                        <span className="text-[10px] text-slate-400 mt-1">
                                                            {meter.User.user_phone}
                                                        </span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-[11px] font-medium text-slate-400 py-1 px-2 bg-slate-50 border border-slate-100 rounded-lg">
                                                    NOT ASSIGNED
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-8 py-4">
                                            {meter.attributed ? (
                                                <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50/50 hover:bg-blue-50">
                                                    Attributed
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="border-amber-200 text-amber-700 bg-amber-50/50 hover:bg-amber-50">
                                                    Inventory
                                                </Badge>
                                            )}
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="flex flex-col gap-1.5">
                                                <div className="flex items-center gap-2">
                                                    <Battery className={cn("h-3 w-3",
                                                        (meter.battery_level ?? 0) < 20 ? "text-red-500" : "text-slate-400"
                                                    )} />
                                                    <span className="text-[10px] font-bold text-slate-500 uppercase">
                                                        {meter.battery_level ?? '--'}%
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Wifi className="h-3 w-3 text-slate-400" />
                                                    <span className="text-[10px] font-bold text-slate-500 uppercase">
                                                        {meter.rssi ?? '--'} dBm
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="flex flex-col gap-2">
                                                {meter.meter_state === 'ACTIVE' ? (
                                                    <div className="flex items-center gap-2 text-emerald-600 text-[10px] font-black uppercase tracking-tighter">
                                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                                                        OPERATIONAL
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-tighter">
                                                        <div className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                                                        RESTRICTED
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-2">
                                                    <Shield className={cn("h-3 w-3", meter.valve_state === 'open' ? "text-emerald-500" : "text-slate-400")} />
                                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                                        Valve: {meter.valve_state || 'unknown'}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                                    onClick={() => handleViewToken(meter)}
                                                    title="View Linking Token"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                                                    onClick={() => {
                                                        setSelectedMeter(meter);
                                                        setRechargeDialogOpen(true);
                                                        rechargeForm.setValue('volume_liters', 0);
                                                    }}
                                                    title="Direct Volume Recharge"
                                                >
                                                    <Droplets className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                                    onClick={() => {
                                                        setSelectedMeter(meter);
                                                        setLinkDialogOpen(true);
                                                    }}
                                                    title="Link Physical Device"
                                                >
                                                    <LinkIcon className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                                    onClick={() => {
                                                        setSelectedMeter(meter);
                                                        setDeleteDialogOpen(true);
                                                    }}
                                                    title="Delete Meter"
                                                >
                                                    <Trash2 className="h-4 w-4" />
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

            {/* Modals are unchanged but inherit global styles */}
            {/* ... Modal Code ... */}

            {/* Create Meter Dialog */}
            <Dialog
                open={createDialogOpen}
                onClose={() => !submitting && setCreateDialogOpen(false)}
                title="Add New Meter"
                description="Create a new water meter in the system"
            >
                <form onSubmit={createForm.handleSubmit(handleCreateMeter)} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-900">
                            Serial ID
                        </label>
                        <Input
                            placeholder="e.g. SN-001234"
                            {...createForm.register("serial_id")}
                            disabled={submitting}
                        />
                        {createForm.formState.errors.serial_id && (
                            <p className="text-sm text-red-500">
                                {createForm.formState.errors.serial_id.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-900">
                            Device ID <span className="text-slate-400">(Optional)</span>
                        </label>
                        <Input
                            placeholder="e.g. DEV-5678"
                            {...createForm.register("device_id")}
                            disabled={submitting}
                        />
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
                        <Button type="submit" loading={submitting}>
                            Create Meter
                        </Button>
                    </div>
                </form>
            </Dialog>

            {/* Link Device Dialog */}
            <Dialog
                open={linkDialogOpen}
                onClose={() => !submitting && setLinkDialogOpen(false)}
                title="Link Physical Device"
                description={`Link LoRa device to meter ${selectedMeter?.serial_id || ''}`}
            >
                <form onSubmit={linkForm.handleSubmit(handleLinkDevice)} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-900">
                            Device EUI
                        </label>
                        <Input
                            placeholder="Enter LoRa Device EUI"
                            {...linkForm.register("dev_eui")}
                            disabled={submitting}
                        />
                        {linkForm.formState.errors.dev_eui && (
                            <p className="text-sm text-red-500">
                                {linkForm.formState.errors.dev_eui.message}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setLinkDialogOpen(false)}
                            disabled={submitting}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" loading={submitting}>
                            Link Device
                        </Button>
                    </div>
                </form>
            </Dialog>

            {/* Direct Recharge Dialog */}
            <Dialog
                open={rechargeDialogOpen}
                onClose={() => !submitting && setRechargeDialogOpen(false)}
                title="Direct Volume Recharge"
                description={`Send water credit to meter ${selectedMeter?.serial_id || ''} without payment.`}
            >
                <form onSubmit={rechargeForm.handleSubmit(handleDirectRecharge)} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-900">
                            Volume to Credit (Liters)
                        </label>
                        <Input
                            type="number"
                            step="0.1"
                            placeholder="e.g. 500"
                            {...rechargeForm.register("volume_liters", { valueAsNumber: true })}
                            disabled={submitting}
                        />
                        {rechargeForm.formState.errors.volume_liters && (
                            <p className="text-sm text-red-500">
                                {rechargeForm.formState.errors.volume_liters.message}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setRechargeDialogOpen(false)}
                            disabled={submitting}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" loading={submitting} variant="default">
                            Execute Recharge
                        </Button>
                    </div>
                </form>
            </Dialog>

            {/* Meter Token Dialog */}
            <Dialog
                open={viewTokenDialogOpen}
                onClose={() => !submitting && setViewTokenDialogOpen(false)}
                title="Meter Linking Token"
                description={`Access control token for meter ${selectedMeter?.serial_id || ''}. Users need this to link the meter to their account.`}
            >
                <div className="space-y-6">
                    <div className="p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200 flex flex-col items-center">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Secret Access Token</span>
                        <div className="text-2xl font-mono font-black text-slate-900 tracking-wider">
                            {meterToken || 'NO TOKEN ASSIGNED'}
                        </div>
                        <Button
                            variant="link"
                            className="mt-4 text-blue-600 font-bold uppercase text-[10px] tracking-widest"
                            onClick={() => {
                                if (meterToken) {
                                    navigator.clipboard.writeText(meterToken);
                                    toast.success("Token copied to clipboard");
                                }
                            }}
                        >
                            Copy to Clipboard
                        </Button>
                    </div>

                    <div className="flex flex-col gap-3">
                        <Button
                            className="w-full bg-slate-900 text-white hover:bg-slate-800"
                            onClick={handleGenerateToken}
                            loading={submitting}
                        >
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Regenerate Token
                        </Button>
                        <p className="text-[10px] text-slate-400 text-center font-medium italic">
                            Generating a new token will invalidate the previous one immediately.
                        </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => setViewTokenDialogOpen(false)}
                        >
                            Close
                        </Button>
                    </div>
                </div>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                onConfirm={handleDelete}
                title="Delete Meter"
                description={`Are you sure you want to delete meter ${selectedMeter?.serial_id || ''}? This action cannot be undone.`}
                confirmText="Delete"
                loading={submitting}
            />
        </div>
    );
}
