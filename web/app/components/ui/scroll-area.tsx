import * as React from "react";
import {
  ScrollArea as ScrollAreaPrimitive,
  Scrollbar,
} from "@radix-ui/react-scroll-area";
import { cn } from "@/app/lib/utils";

export function ScrollArea({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive>) {
  return (
    <ScrollAreaPrimitive
      className={cn("relative overflow-hidden", className)}
      {...props}
    >
      <div className="h-full w-full overflow-auto">{children}</div>
      <Scrollbar orientation="vertical" />
      <Scrollbar orientation="horizontal" />
    </ScrollAreaPrimitive>
  );
}

