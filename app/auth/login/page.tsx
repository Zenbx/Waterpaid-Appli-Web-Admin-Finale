"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Droplet } from "lucide-react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAdminStore } from "@/lib/store";
import { useToast } from "@/lib/toast";

const formSchema = z.object({
    phone: z.string().min(1, "Phone number is required"),
    password: z.string().min(1, "Password is required"),
});

export default function LoginPage() {
    const router = useRouter();
    const login = useAdminStore((state) => state.login);
    const toast = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            phone: "",
            password: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);

        try {
            await axios.post('/api/auth/login', {
                phone: values.phone,
                password: values.password
            });

            login();
            toast.success("Successfully logged in");
            router.push("/admin");
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const message = err.response?.data?.detail || "Invalid credentials";
                toast.error(message);
            } else {
                toast.error("An unexpected error occurred");
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="relative flex min-h-screen items-center justify-center bg-[#F8FAFC] overflow-hidden">
            {/* Background Aesthetic Elements */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-blue-50/50 blur-3xl" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-96 w-96 rounded-full bg-indigo-50/50 blur-3xl" />

            <div className="relative w-full max-w-md px-6 animate-in fade-in zoom-in duration-700">
                <div className="rounded-[2.5rem] border border-slate-200/60 bg-white/80 p-10 shadow-2xl shadow-blue-100/50 backdrop-blur-xl">
                    <div className="flex flex-col items-center text-center">
                        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-200 transition-transform hover:scale-105 duration-300">
                            <Droplet className="h-8 w-8" />
                        </div>
                        <h1 className="text-3xl font-black tracking-tight text-slate-900">
                            WaterPaid Admin
                        </h1>
                        <p className="mt-3 text-sm font-medium text-slate-500">
                            Secure access to management console
                        </p>
                    </div>

                    <form onSubmit={form.handleSubmit(onSubmit)} className="mt-10 space-y-7">
                        <div className="space-y-2.5">
                            <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1">
                                Administrator Credentials
                            </label>
                            <Input
                                placeholder="Phone connection"
                                className="h-12 rounded-xl bg-slate-50/50 border-slate-200 focus-visible:ring-blue-600 focus-visible:bg-white transition-all text-sm"
                                {...form.register("phone")}
                                disabled={isLoading}
                            />
                            {form.formState.errors.phone && (
                                <p className="text-xs font-bold text-red-500 ml-1">
                                    {form.formState.errors.phone.message}
                                </p>
                            )}

                            <Input
                                type="password"
                                placeholder="Security key"
                                className="h-12 rounded-xl bg-slate-50/50 border-slate-200 focus-visible:ring-blue-600 focus-visible:bg-white transition-all text-sm mt-4"
                                {...form.register("password")}
                                disabled={isLoading}
                            />
                            {form.formState.errors.password && (
                                <p className="text-xs font-bold text-red-500 ml-1">
                                    {form.formState.errors.password.message}
                                </p>
                            )}
                        </div>

                        <div className="pt-2">
                            <Button
                                type="submit"
                                className="h-12 w-full rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-100 transition-all active:scale-[0.98]"
                                loading={isLoading}
                            >
                                Enter Dashboard
                            </Button>
                        </div>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300">
                            Proprietary Infrastructure
                        </p>
                    </div>
                </div>

                <p className="mt-8 text-center text-xs font-medium text-slate-400">
                    &copy; {new Date().getFullYear()} WaterPaid IoT Solutions. All rights reserved.
                </p>
            </div>
        </div>
    );
}
