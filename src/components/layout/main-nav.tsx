"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <Link
        href="/"
        className={cn(
          "text-sm font-medium text-muted-foreground transition-colors hover:text-primary",
          pathname === "/" && "text-primary"
        )}
      >
        Dashboard
      </Link>
      <Link
        href="/settings"
        className={cn(
          "text-sm font-medium text-muted-foreground transition-colors hover:text-primary",
          pathname === "/settings" && "text-primary"
        )}
      >
        Settings
      </Link>
    </nav>
  );
}
