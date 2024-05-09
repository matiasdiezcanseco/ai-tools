"use client";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
      <Link href="/stt" className={generateClassName("/stt")}>
        Speach to Text
      </Link>
      <Link href="/tti" className={generateClassName("/tti")}>
        Text to Image
      </Link>
    </>
  );
};
