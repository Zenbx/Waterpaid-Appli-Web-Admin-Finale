"use client";

import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './button';

interface DialogProps {
    open: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    children: ReactNode;
}

export function Dialog({ open, onClose, title, description, children }: DialogProps) {
    // Fermer avec Escape
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (open) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Dialog */}
            <div className="relative z-50 w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
                        {description && (
                            <p className="mt-1 text-sm text-slate-500">{description}</p>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div>{children}</div>
            </div>
        </div>
    );
}

interface ConfirmDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    loading?: boolean;
}

export function ConfirmDialog({
    open,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    loading = false,
}: ConfirmDialogProps) {
    return (
        <Dialog open={open} onClose={onClose} title={title} description={description}>
            <div className="mt-6 flex justify-end gap-3">
                <Button variant="outline" onClick={onClose} disabled={loading}>
                    {cancelText}
                </Button>
                <Button variant="destructive" onClick={onConfirm} loading={loading}>
                    {confirmText}
                </Button>
            </div>
        </Dialog>
    );
}
