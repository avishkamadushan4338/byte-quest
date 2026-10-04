import { cn } from "@byte-quest/ui/lib/utils";
import type { TextareaHTMLAttributes } from "react";

const textareaClasses =
  "w-full min-w-0 rounded-xl border border-line-strong bg-surface/70 px-4 py-3 text-base text-fg transition-colors outline-none placeholder:text-faint hover:border-line-strong/80 focus-visible:border-volt focus-visible:ring-1 focus-visible:ring-volt/40 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-1 aria-invalid:ring-destructive/30";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  className?: string;
};

function Textarea({ className, rows = 3, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(textareaClasses, "min-h-24 resize-y", className)}
      rows={rows}
      {...props}
    />
  );
}

export { Textarea, textareaClasses };
export type { TextareaProps };