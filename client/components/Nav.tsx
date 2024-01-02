"use client";

import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";

export default function Nav() {
  const { isSignedIn, user, isLoaded } = useUser();

  const pathname = usePathname();

  console.log(pathname);

  function renderDynamicLink() {
    if (pathname !== "/dashboard") {
      return (
        <Link href="/dashboard">
          <Button variant="ghost">Dashboard</Button>
        </Link>
      );
    }
    return (
      <Link href="/create">
        <Button variant="ghost">Create a FunkyPoll</Button>
      </Link>
    );
  }

  function renderUserButton() {
    if (!isSignedIn) {
      return (
        <SignInButton>
          <Button>Sign In</Button>
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

  if (!isLoaded) return null;

  return (
    <nav className="sticky top-0 bg-inherit shadow z-50">
      <div className="flex flex-row justify-between items-center px-8 py-4 max-w-screen-xl m-auto">
        <Link href="/">
          <h1 className="text-2xl font-bold">FunkyPolls</h1>
        </Link>

        {renderUserButton()}
      </div>
    </nav>
  );
}
