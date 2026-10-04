import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar";
import { cn } from "@byte-quest/ui/lib/utils";

type AvatarRootProps = Omit<AvatarPrimitive.Root.Props, "className"> & {
  className?: string;
};

function Avatar({ className, ...props }: AvatarRootProps) {
  return (
    <AvatarPrimitive.Root
      className={cn(
        "border-line-strong relative inline-flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border",
        className
      )}
      {...props}
    />
  );
}

type AvatarImageProps = Omit<AvatarPrimitive.Image.Props, "className"> & {
  className?: string;
};

function AvatarImage({ className, ...props }: AvatarImageProps) {
  return (
    <AvatarPrimitive.Image
      className={cn("size-full object-cover", className)}
      {...props}
    />
  );
}

type AvatarFallbackProps = Omit<
  AvatarPrimitive.Fallback.Props,
  "className"
> & {
  className?: string;
};

function AvatarFallback({ className, ...props }: AvatarFallbackProps) {
  return (
    <AvatarPrimitive.Fallback
      className={cn(
        "text-muted-2 flex size-full items-center justify-center font-mono text-[13px] tracking-[0.06em]",
        className
      )}
      {...props}
    />
  );
}

export { Avatar, AvatarFallback, AvatarImage };
export type { AvatarRootProps };