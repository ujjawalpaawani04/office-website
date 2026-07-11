import { cn } from "../../utils/cn";

// Shared page-width wrapper: consistent max-width and gutters across sections.
export const Container = ({ as: Tag = "div", className, children }) => {
  return (
    <Tag className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </Tag>
  );
};
