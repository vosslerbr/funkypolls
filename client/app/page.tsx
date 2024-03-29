import FAQCards from "@/components/FAQCards";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <section className="flex h-full flex-col items-center mb-48 mt-24">
        <h1 className="text-5xl mb-8 font-bold text-center">FunkyPolls</h1>
        <h2 className="text-2xl mb-8 text-center">
          Create your poll, cast your vote, explore results
        </h2>
        <Link href="/create">
          <Button className="bg-gradient-to-r from-violet-700 to-purple-500 text-lg py-6 px-8">
            Create a FunkyPoll
          </Button>
        </Link>
      </section>

      <FAQCards />
    </>
  );
}
