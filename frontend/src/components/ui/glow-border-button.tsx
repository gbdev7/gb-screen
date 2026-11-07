import { cn } from "../../lib/utils";
import type { ButtonHTMLAttributes } from "react";

export function GlowBorderButton({ className, children, disabled, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            disabled={disabled}
            className={cn(
                "relative inline-flex h-[50px] w-full overflow-hidden rounded-xl p-[1px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-transform active:scale-[0.98]",
                disabled ? "opacity-70 cursor-not-allowed" : "cursor-pointer",
                className
            )}
            {...props}
        >
            <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#3b82f6_0%,#0f172a_50%,#3b82f6_100%)]" />
            <span className="inline-flex h-full w-full items-center justify-center rounded-xl bg-slate-950 px-6 py-1 text-sm font-bold text-white backdrop-blur-3xl gap-2">
        {children}
      </span>
        </button>
    );
}