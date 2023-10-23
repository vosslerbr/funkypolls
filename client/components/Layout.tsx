import Link from "next/link";
import { Button } from "primereact/button";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav>
        <div id="nav-inner" className="flex justify-content-between align-items-center">
          <Link href="/">
            <h1>FunkyPolls</h1>
          </Link>

          <Link href="/create">
            <Button label="Create a FunkyPoll" />
          </Link>
        </div>
      </nav>

      {children}

      <footer>
        <p>&copy; {new Date().getFullYear()} - Brady Vossler 🤠</p>
      </footer>
    </>
  );
}
