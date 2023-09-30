import Head from "next/head";

import Link from "next/link";
import { Button } from "primereact/button";

export default function Home() {
  return (
    <>
      <Head>
        <title>FunkyPolls</title>
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="flex flex-column align-items-center gap-2">
          <h1 className="m-0">FunkyPolls</h1>
          <p className="m-0">Welcome to FunkyPolls!</p>

          <Link href="/create" className="mt-4">
            <Button label="Create a poll" />
          </Link>
        </div>
      </main>
    </>
  );
}
