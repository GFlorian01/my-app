import React from "react";
import { cn } from "./utils";

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export default function Select({ className, children, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        "w-full h-10 px-3 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}
