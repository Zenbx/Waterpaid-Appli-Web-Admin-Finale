"use client"
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const logs = [
    { id: 1, action: 'User Created', user: 'Admin', details: 'Created account for John Doe', ip: '192.168.1.1', date: '2024-03-30 10:45 AM' },
    { id: 2, action: 'Meter Linked', user: 'System', details: 'Meter #1300 linked to User #45', ip: '10.0.0.5', date: '2024-03-29 03:20 PM' },
    { id: 3, action: 'Settings Updated', user: 'SuperAdmin', details: 'Changed water price to 2.5 CFA', ip: '192.168.1.15', date: '2024-03-28 09:15 AM' },
    { id: 4, action: 'Login Failed', user: 'Unknown', details: 'Failed login attempt for admin', ip: '45.32.1.2', date: '2024-03-28 08:30 AM' },
];

export default function AuditLogsPage() {
    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
                <p className="text-muted-foreground">Track administrative actions and system events.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>System Activity</CardTitle>
                    <CardDescription>Recent logs from the last 30 days.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Action</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead>Details</TableHead>
                                <TableHead>IP Address</TableHead>
                                <TableHead>Timestamp</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {logs.map((log) => (
                                <TableRow key={log.id}>
                                    <TableCell className="font-medium">{log.action}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{log.user}</Badge>
                                    </TableCell>
                                    <TableCell>{log.details}</TableCell>
                                    <TableCell className="text-muted-foreground text-xs">{log.ip}</TableCell>
                                    <TableCell className="text-muted-foreground">{log.date}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
