import { cn } from "@/lib/utils";

interface LoadingProps {
    className?: string;
    size?: "sm" | "md" | "lg";
    text?: string;
}

export function Loading({ className, size = "md", text }: LoadingProps) {
    const sizeClasses = {
        sm: "w-4 h-4",
        md: "w-8 h-8",
        lg: "w-12 h-12"
    };

    return (
        <div className={cn("flex flex-1 flex-col items-center justify-center gap-2 p-4", className)}>
            <div
                className={cn(
                    "animate-spin rounded-full border-2 border-foreground/20 border-t-foreground",
                    sizeClasses[size]
                )}
            />
            {text && (
                <p className="text-foreground/60 text-sm animate-pulse">
                    {text}
                </p>
            )}
        </div>
    );
}