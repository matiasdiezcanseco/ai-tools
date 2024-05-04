"use client";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "~/components/ui/badge";

export const LayoutNavigation = () => {
  const path = usePathname();

  const generateClassName = (href: string) => {
    return clsx("hover:underline", {
      "text-muted": path !== href,
      "text-white": path === href,
      "font-semibold": path === href,
    });
  };

  return (
    <>
      <Link href="/tts" className={generateClassName("/tts")}>
        Text to Speach
      </Link>
      <div className="flex cursor-not-allowed gap-2 text-muted">
        Speach to Text
        <Badge>Soon</Badge>
      </div>
      <div className="flex cursor-not-allowed gap-2 text-muted">
        Text to Image
        <Badge>Soon</Badge>
      </div>
    </>
  );
};
