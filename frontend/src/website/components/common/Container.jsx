import { cn } from "../../../shared/utils/cn";

// Shared page-width wrapper: consistent max-width and gutters across sections.
export const Container = ({ as: Tag = "div", className, children }) => {
  return (
    <Tag className={cn("mx-auto w-full max-w-7xl px-4 lg:px-0", className)}>
      {children}
    </Tag>
  );
};
