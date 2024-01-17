"use client";

import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { Loader2, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";
import { Sheet, SheetContent } from "./ui/sheet";

export default function MobileNav() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { isSignedIn, user, isLoaded } = useUser();

  const pathname = usePathname();

  function renderDynamicLink(isMobile = false) {
    if (pathname === "/dashboard") {
      return (
        <Link href="/create" className="w-full">
          <Button
            className="w-full bg-gradient-to-r from-violet-700 to-purple-500"
            onClick={() => setSidebarOpen(false)}>
            Create a FunkyPoll
          </Button>
        </Link>
      );
    }

    if (pathname === "/create") {
      return (
        <Link href="/dashboard" className="w-full">
          <Button variant="secondary" className="w-full" onClick={() => setSidebarOpen(false)}>
            Dashboard
          </Button>
        </Link>
      );
    }

    return (
      <>
        <Link href="/dashboard" className="w-full">
          <Button variant="secondary" className="w-full" onClick={() => setSidebarOpen(false)}>
            Dashboard
          </Button>
        </Link>

        <Link href="/create" className="w-full">
          <Button
            className="w-full bg-gradient-to-r from-violet-700 to-purple-500"
            onClick={() => setSidebarOpen(false)}>
            Create a FunkyPoll
          </Button>
        </Link>
      </>
    );
  }

  function renderUserButton(isMobile = false) {
    if (!isSignedIn) {
      return (
        <SignInButton>
          <Button
            onClick={() => setSidebarOpen(false)}
            className="bg-gradient-to-r from-violet-700 to-purple-500">
            Sign In
          </Button>
        </SignInButton>
      );
    } else {
      return (
        <div className={`flex flex-col items-center gap-4 py-8`}>{renderDynamicLink(isMobile)}</div>
      );
    }
  }

  return (
    <nav className="sm:hidden block sticky top-0 bg-inherit shadow z-50">
      <div className="flex flex-row justify-between items-center md:px-8 px-4 py-4 max-w-screen-xl m-auto">
        <Link href="/">
          <h1 className="text-2xl font-bold">FunkyPolls</h1>
        </Link>

        {isSignedIn ? (
          <div className="flex flex-row items-center gap-4">
            <UserButton afterSignOutUrl="/" />
            <Menu className="w-10 h-10 cursor-pointer" onClick={() => setSidebarOpen(true)} />
          </div>
        ) : (
          <SignInButton>
            <Button>Sign In</Button>
          </SignInButton>
        )}

        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent>
            {!isLoaded ? (
              <Loader2 className="w-10 h-10 text-gray-500 animate-spin" />
            ) : (
              renderUserButton(true)
            )}
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
