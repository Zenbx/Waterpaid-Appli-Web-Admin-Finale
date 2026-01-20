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
    Droplets
} from "lucide-react";
import { adminApi } from "@/lib/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, ConfirmDialog } from "@/components/ui/dialog";
import { useToast } from "@/lib/toast";
import type { Meter } from "@/types/api";

const createMeterSchema = z.object({
    serial_id: z.string().min(3, "Serial ID must be at least 3 characters"),
    device_id: z.string().optional(),
});

const linkDeviceSchema = z.object({
    dev_eui: z.string().min(1, "Device EUI is required"),
});

const directRechargeSchema = z.object({
    volume_liters: z.coerce.number().min(0.1, "Volume must be greater than 0"),
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

    const filteredMeters = meters.filter(m =>
        m.serial_id.toLowerCase().includes(search.toLowerCase()) ||
        (m.device_id && m.device_id.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Meters</h2>
                    <p className="text-slate-500">Manage water meters and assignments.</p>
                </div>
                <Button onClick={() => setCreateDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Meter
                </Button>
            </div>

            <div className="flex items-center gap-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                    <Input
                        className="pl-9"
                        placeholder="Search meters..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="rounded-md border border-slate-200 bg-white shadow-sm overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                        <tr>
                            <th className="px-4 py-3">Serial ID / Device ID</th>
                            <th className="px-4 py-3">User</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">State</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr><td colSpan={5} className="p-8 text-center text-slate-500">
                                <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                            </td></tr>
                        ) : filteredMeters.length === 0 ? (
                            <tr><td colSpan={5} className="p-8 text-center text-slate-500">No meters found.</td></tr>
                        ) : (
                            filteredMeters.map(meter => (
                                <tr key={meter.meter_id} className="hover:bg-slate-50/50">
                                    <td className="px-4 py-3 font-medium text-slate-900">
                                        <div>{meter.serial_id}</div>
                                        <div className="text-xs text-slate-500">{meter.device_id || '-'}</div>
                                    </td>
                                    <td className="px-4 py-3 text-slate-600">
                                        {meter.User ? (
                                            <span className="flex items-center gap-1">
                                                <UsersIcon className="h-3 w-3" />
                                                {meter.User.user_pseudo || meter.User.user_phone}
                                            </span>
                                        ) : (
                                            <span className="text-slate-400 italic">Unassigned</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        {meter.attributed ? (
                                            <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                                Attributed
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                                                Free
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        {meter.meter_state === 'ON' ? (
                                            <div className="flex items-center text-green-600"><CheckCircle className="mr-1 h-3 w-3" /> ON</div>
                                        ) : (
                                            <div className="flex items-center text-red-600"><XCircle className="mr-1 h-3 w-3" /> OFF</div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => {
                                                    setSelectedMeter(meter);
                                                    setRechargeDialogOpen(true);
                                                    rechargeForm.setValue('volume_liters', 0);
                                                }}
                                                title="Direct Volume Recharge"
                                            >
                                                <Droplets className="h-4 w-4 text-emerald-500" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => {
                                                    setSelectedMeter(meter);
                                                    setLinkDialogOpen(true);
                                                }}
                                                title="Link Physical Device"
                                            >
                                                <LinkIcon className="h-4 w-4 text-blue-500" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => {
                                                    setSelectedMeter(meter);
                                                    setDeleteDialogOpen(true);
                                                }}
                                                title="Delete Meter"
                                            >
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

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
                            {...rechargeForm.register("volume_liters")}
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
