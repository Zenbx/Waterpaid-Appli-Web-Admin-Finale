"use client"
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Info, CheckCircle, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

const alerts = [
    { id: 1, type: 'critical', message: 'Meter #1300 offline for > 24h', date: '2024-03-30 10:00 AM' },
    { id: 2, type: 'warning', message: 'Low water pressure reported in Zone A', date: '2024-03-29 02:30 PM' },
    { id: 3, type: 'info', message: 'Scheduled maintenance for tomorrow', date: '2024-03-28 09:00 AM' },
];

export default function AlertsPage() {
    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">System Alerts</h1>
                    <p className="text-muted-foreground">Monitor critical system events and notifications.</p>
                </div>
                <Button variant="outline">
                    Mark All as Read
                </Button>
            </div>

            <div className="grid gap-4">
                {alerts.map((alert) => (
                    <Card key={alert.id} className="border-l-4" style={{
                        borderLeftColor: alert.type === 'critical' ? '#ef4444' : alert.type === 'warning' ? '#eab308' : '#3b82f6'
                    }}>
                        <CardContent className="flex items-start gap-4 p-4">
                            <div className="mt-1">
                                {alert.type === 'critical' && <AlertTriangle className="h-5 w-5 text-red-500" />}
                                {alert.type === 'warning' && <Bell className="h-5 w-5 text-yellow-500" />}
                                {alert.type === 'info' && <Info className="h-5 w-5 text-blue-500" />}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-sm">{alert.message}</h3>
                                <p className="text-xs text-muted-foreground">{alert.date}</p>
                            </div>
                            <Badge variant={alert.type === 'critical' ? 'destructive' : alert.type === 'warning' ? 'warning' : 'secondary'}>
                                {alert.type.toUpperCase()}
                            </Badge>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
