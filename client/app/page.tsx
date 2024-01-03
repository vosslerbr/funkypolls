import FAQCards from "@/components/FAQCards";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <section className="flex h-full flex-col items-center mb-24">
        <h1 className="text-5xl mb-8 font-bold">FunkyPolls</h1>
        <h2 className="text-2xl mb-8">Create your poll, cast your vote, explore results</h2>
        <Link href="/create">
          <Button>Create a FunkyPoll</Button>
        </Link>
      </section>

      <FAQCards />
    </>
  );
}
