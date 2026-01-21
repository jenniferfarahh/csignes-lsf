import { ReactNode } from "react";

export default function AdvancedTooltip({
  label,
  children,
}: {
  label: ReactNode;
  children: ReactNode;
}) {
  return (
    <span className="relative inline-flex group">
      {children}
      <span
        className="
          pointer-events-none absolute left-0 top-full mt-2 w-max max-w-xs
          rounded-xl border bg-background/90 backdrop-blur
          px-3 py-2 text-sm text-foreground shadow-lg
          opacity-0 translate-y-1 scale-95
          group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100
          transition-all duration-200 z-50
        "
      >
        {label}
      </span>
    </span>
  );
}
