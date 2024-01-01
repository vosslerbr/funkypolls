"use client";

import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "./ui/button";

export default function Nav() {
  const { isSignedIn, user, isLoaded } = useUser();

  function renderUserButton() {
    if (!isSignedIn) {
      return (
        <SignInButton>
          <Button>Sign In</Button>
        </SignInButton>
      );
    } else {
      return <UserButton afterSignOutUrl="/" />;
    }
  }

  if (!isLoaded) return null;

  return (
    <nav className="flex flex-row justify-between px-24 py-4 sticky top-0 bg-inherit shadow">
      <Link href="/">
        <h1 className="text-2xl font-bold">FunkyPolls</h1>
      </Link>

      {renderUserButton()}
    </nav>
  );
}
