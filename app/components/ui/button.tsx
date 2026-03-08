import React from "react";
import { cn } from "./utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
};

const base =
  "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<string, string> = {
  default: "bg-yellow-500 text-black hover:bg-yellow-400",
  secondary: "bg-gray-700 text-white hover:bg-gray-600",
  outline:
    "border border-gray-600 text-white hover:bg-gray-800/50",
  ghost: "text-white hover:bg-gray-800/60",
  destructive: "bg-red-600 text-white hover:bg-red-500",
};

const sizes: Record<string, string> = {
  sm: "h-9 px-3 rounded-md text-sm",
  md: "h-10 px-4 rounded-md",
  lg: "h-12 px-5 rounded-lg text-lg",
};

export function Button({
  className,
  variant = "default",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], "tap-button", className)}
      {...props}
    />
  );
}

export default Button;
