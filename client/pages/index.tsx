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
        <section className="card mb-4 flex flex-column align-items-center gap-4">
          <h1 className="m-0">Welcome to FunkyPolls!</h1>
          <Link href="/create">
            <Button label="Create a FunkyPoll" />
          </Link>
        </section>

        <section className="card mb-4">
          <h2 className="m-0 mb-4">What is FunkyPolls?</h2>
          <p className="m-0">
            FunkyPolls can be used for creating polls for use in the classroom, workplace, or
            anywhere else you need. Each poll can be created with up to 10 answers and can be set to
            expire whenever you&apos;d like. Results update in real time, so you can see what your
            voters are deciding as they vote.
          </p>
        </section>

        <section className="card mb-4">
          <h2 className="m-0 mb-4">How much does FunkyPolls cost?</h2>
          <p className="m-0">
            Nothing! FunkyPolls are free to create, vote in, and view. We hope to add paid features
            in the future, but the core functionality is free.
          </p>
        </section>

        <section className="card mb-4">
          <h2 className="m-0 mb-4">Does FunkyPolls store any personal information?</h2>
          <p className="m-0">
            Nope! FunkyPolls are 100% anonymous. We don&apos;t store any information about the
            FunkyPoll creator or voters.
          </p>
        </section>

        <section className="card mb-4">
          <h2 className="m-0 mb-4">
            I created a FunkyPoll but need to edit or delete it. Can I do that?
          </h2>
          <p className="m-0">
            FunkyPolls cannot be edited or deleted once they&apos;re created. We hope to add this
            feature in the future.
          </p>
        </section>
      </main>
    </>
  );
}
