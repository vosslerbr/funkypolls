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
        <h1>FunkyPolls</h1>
        <p>Welcome to FunkyPolls!</p>
        <Link href="/create">
          <Button label="Create a poll" />
        </Link>
      </main>
    </>
  );
}
