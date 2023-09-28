import Head from "next/head";

import Link from "next/link";

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
        <Link href="/poll/create">Create a poll</Link>
      </main>
    </>
  );
}
