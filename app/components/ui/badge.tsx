import React from "react";
import { cn } from "./utils";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "secondary" | "outline";
};

export default function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const styles: Record<string, string> = {
    default: "bg-yellow-500 text-black",
    secondary: "bg-gray-700 text-white",
    outline: "border border-gray-600 text-white",
  };
  return (
    <span
      className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", styles[variant], className)}
      {...props}
    />
  );
}
