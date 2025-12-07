"use client";

import { cn } from "@/lib/utils/cn";
import { Loader2 } from "lucide-react";
import { ButtonHTMLAttributes, ReactNode, forwardRef } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  loading?: boolean;
  iconLeft?: ReactNode;
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, variant = "primary", loading, iconLeft, disabled, ...props }, ref) => {
    const base =
      "inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";
    const variants = {
      primary:
        "bg-brand text-white shadow hover:bg-blue-700 focus-visible:outline-brand",
      secondary:
        "border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-100 focus-visible:outline-brand",
      ghost:
        "text-gray-700 hover:bg-gray-100 focus-visible:outline-brand",
      outline:
        "border border-brand-border text-brand hover:bg-blue-50 focus-visible:outline-brand",
    } as const;

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : iconLeft}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export default Button;
