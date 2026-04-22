import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-none bg-zinc-200/70 dark:bg-zinc-800/70", className)}
      {...props}
    />
  );
}

export { Skeleton };
