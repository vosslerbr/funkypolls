import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <section className="flex h-full flex-col items-center">
        <h1 className="text-5xl mb-8 font-bold">FunkyPolls</h1>
        <h2 className="text-2xl mb-8">Create your poll, cast your vote, explore results</h2>
        <Link href="/create">
          <Button>Create a FunkyPoll</Button>
        </Link>
      </section>
    </main>
  );
}
