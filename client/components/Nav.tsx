"use client";

import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";

// TODO refactor this, lots of duplicate code
export default function Nav() {
  const { isSignedIn, user, isLoaded } = useUser();

  const pathname = usePathname();

  function renderDynamicLink() {
    if (pathname === "/dashboard") {
      return (
        <Link href="/create">
          <Button className="bg-gradient-to-r from-violet-700 to-purple-500">Create a FunkyPoll</Button>
        </Link>
      );
    }

    if (pathname === "/create") {
      return (
        <Link href="/dashboard">
          <Button variant="ghost">Dashboard</Button>
        </Link>
      );
    }

    return (
      <>
        <Link href="/dashboard">
          <Button variant="ghost">Dashboard</Button>
        </Link>
        <Link href="/create">
          <Button className="bg-gradient-to-r from-violet-700 to-purple-500">Create a FunkyPoll</Button>
        </Link>
      </>
    );
  }

  function renderUserButton() {
    if (!isSignedIn) {
      return (
        <SignInButton>
          <Button className="bg-gradient-to-r from-violet-700 to-purple-500">Sign In</Button>
        </SignInButton>
      );
    } else {
      return (
        <div className="flex flex-row items-center gap-4">
          {renderDynamicLink()}
          <UserButton afterSignOutUrl="/" />
        </div>
      );
    }
  }

  return (
    <nav className="sm:block hidden sticky top-0 bg-inherit shadow z-50">
      <div className="flex flex-row justify-between items-center md:px-8 px-4 py-4 max-w-screen-xl m-auto">
        <Link href="/">
          <Image src="/logo.png" width={40} height={40} alt="FunkyPolls logo" />
        </Link>

        {!isLoaded ? <Loader2 className="w-10 h-10 text-gray-500 animate-spin" /> : renderUserButton()}
      </div>
    </nav>
  );
}
