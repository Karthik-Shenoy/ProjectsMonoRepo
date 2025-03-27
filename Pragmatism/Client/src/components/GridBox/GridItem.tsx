import { cn } from "@shadcn/lib/utils";
import * as React from "react";

export type GridItemProps = {
  className?: string;
};

export const GridItem: React.FC<React.PropsWithChildren<GridItemProps>> = ({
  children,
  className,
}) => {
  return (
    <div className={cn(`h-auto w-auto`, className)}>
      {children}
    </div>
  );
};
