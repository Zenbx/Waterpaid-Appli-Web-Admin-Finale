"use client"
import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';


export default function SettingsPage() {
    const { register, handleSubmit } = useForm({
        defaultValues: {
            waterPrice: 2, // 2 CFA per liter
            currency: 'XAF',
            siteName: 'WaterPaid Admin',
            supportEmail: 'support@waterpaid.com'
        }
    });

    const onSubmit = (data: any) => {
        console.log(data);
        alert('Settings saved!');
        // In real app, post to /api/settings
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Platform Settings</h1>
                    <p className="text-sm text-slate-500 mt-1">Configure global parameters and infrastructure preferences.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* General Config */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden transition-all hover:shadow-lg hover:shadow-slate-100">
                    <div className="p-8 border-b border-slate-50 bg-slate-50/30">
                        <h2 className="text-lg font-bold text-slate-900 tracking-tight">Identity & Communication</h2>
                        <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-bold">Public facing metadata</p>
                    </div>
                    <div className="p-8 space-y-7">
                        <div className="grid gap-3">
                            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Platform Identifier</label>
                            <Input
                                {...register('siteName')}
                                className="h-12 rounded-2xl bg-slate-50/50 border-slate-200 focus-visible:ring-blue-500 focus-visible:bg-white transition-all font-medium"
                            />
                        </div>
                        <div className="grid gap-3">
                            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Technical Support Channel</label>
                            <Input
                                {...register('supportEmail')}
                                type="email"
                                className="h-12 rounded-2xl bg-slate-50/50 border-slate-200 focus-visible:ring-blue-500 focus-visible:bg-white transition-all font-medium"
                            />
                        </div>
                    </div>
                </div>

                {/* Pricing & Units */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden transition-all hover:shadow-lg hover:shadow-slate-100">
                    <div className="p-8 border-b border-slate-50 bg-slate-50/30">
                        <h2 className="text-lg font-bold text-slate-900 tracking-tight">Financial Parameters</h2>
                        <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-bold">Currency & Metered billing</p>
                    </div>
                    <div className="p-8 space-y-7">
                        <div className="grid gap-3">
                            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Fluid Rate (XAF / Liter)</label>
                            <Input
                                {...register('waterPrice')}
                                type="number"
                                step="0.1"
                                className="h-12 rounded-2xl bg-slate-50/50 border-slate-200 focus-visible:ring-blue-500 focus-visible:bg-white transition-all font-bold text-blue-600"
                            />
                        </div>
                        <div className="grid gap-3">
                            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Local Tender Representation</label>
                            <Input
                                {...register('currency')}
                                className="h-12 rounded-2xl bg-slate-50/50 border-slate-200 focus-visible:ring-blue-500 focus-visible:bg-white transition-all font-medium"
                            />
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between p-6 bg-slate-900 rounded-[2rem] shadow-xl">
                    <div className="flex flex-col ml-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Unsaved Changes</span>
                        <span className="text-sm font-bold text-white tracking-tight leading-none mt-1">Global synchronization pending</span>
                    </div>
                    <Button
                        type="submit"
                        className="h-12 px-10 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/20 shadow-inner transition-all active:scale-[0.98]"
                    >
                        Commit Changes
                    </Button>
                </div>
            </form>
        </div>
    );
}
