import "~/styles/globals.css";

import Link from "next/link";
import { Toaster } from "~/components/ui/sonner";
import { ClerkProvider, SignedIn, UserButton } from "@clerk/nextjs";
import { LayoutNavigation } from "./_components/layout-navigation";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

export const metadata = {
  title: "Ai Tools",
  description:
    "A collection of AI tools to help you increase your productivity.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`font-sans ${GeistSans.variable} ${GeistMono.variable} dark`}
        >
          <main className="flex min-h-screen flex-col">
            <header className="flex items-center justify-between border-b border-border p-4">
              <Link href="/">
                <span>Logo</span>
              </Link>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </header>
            <div className="flex flex-grow">
              <div className="flex w-64 flex-col gap-4 border-r border-border p-4">
                <LayoutNavigation />
              </div>
              <div className="w-full">
                <div className="w-full p-4">{props.children}</div>
              </div>
            </div>
          </main>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
