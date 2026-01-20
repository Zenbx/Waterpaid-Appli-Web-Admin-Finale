import { Activity } from "lucide-react";

export default function Loading() {
    return (
        <div className="flex h-[50vh] w-full items-center justify-center flex-col gap-4">
            <Activity className="h-10 w-10 animate-spin text-primary" />
            <p className="text-muted-foreground animate-pulse">Loading dashboard resources...</p>
        </div>
    );
}
