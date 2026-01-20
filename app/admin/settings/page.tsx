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
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">Manage your global application settings.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>General Configuration</CardTitle>
                        <CardDescription>Basic details about the application.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Site Name</label>
                            <Input {...register('siteName')} />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Support Email</label>
                            <Input {...register('supportEmail')} type="email" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Pricing & Units</CardTitle>
                        <CardDescription>Configure water pricing and currency.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Water Price per Liter</label>
                            <Input {...register('waterPrice')} type="number" step="0.1" />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Currency Symbol</label>
                            <Input {...register('currency')} />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Button type="submit">Save Changes</Button>
                </div>
            </form>
        </div>
    );
}
