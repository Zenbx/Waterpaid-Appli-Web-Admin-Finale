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
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
            <div className="w-full max-w-md space-y-8 rounded-xl border border-slate-200 bg-white p-10 shadow-lg">
                <div className="flex flex-col items-center text-center">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-white">
                        <Droplet className="h-6 w-6" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                        Admin Portal
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">
                        Sign in to manage WaterPaid services
                    </p>
                </div>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-900">
                            Phone Number
                        </label>
                        <Input
                            placeholder="e.g. 699999999"
                            {...form.register("phone")}
                            disabled={isLoading}
                        />
                        {form.formState.errors.phone && (
                            <p className="text-sm text-red-500">
                                {form.formState.errors.phone.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-900">
                            Password
                        </label>
                        <Input
                            type="password"
                            placeholder="••••••••"
                            {...form.register("password")}
                            disabled={isLoading}
                        />
                        {form.formState.errors.password && (
                            <p className="text-sm text-red-500">
                                {form.formState.errors.password.message}
                            </p>
                        )}
                    </div>

                    <Button type="submit" className="w-full" loading={isLoading}>
                        Sign In
                    </Button>
                </form>
            </div>
        </div>
    );
}
