import React from "react";
import { cn } from "./utils";

type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement>;

export default function Checkbox({ className, ...props }: CheckboxProps) {
  return (
    <input
      type="checkbox"
      className={cn(
        "h-4 w-4 rounded border-gray-600 bg-gray-700 text-yellow-400 focus:ring-yellow-400",
        className
      )}
      {...props}
    />
  );
}
