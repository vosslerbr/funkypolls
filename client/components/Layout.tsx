import Link from "next/link";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav>
        <div id="nav-inner">
          <Link href="/">
            <h1>FunkyPolls</h1>
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
