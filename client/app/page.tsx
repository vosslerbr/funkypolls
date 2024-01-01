import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col  p-24">
      <section className="flex h-full flex-col items-center mb-24">
        <h1 className="text-5xl mb-8 font-bold">FunkyPolls</h1>
        <h2 className="text-2xl mb-8">Create your poll, cast your vote, explore results</h2>
        <Link href="/create">
          <Button>Create a FunkyPoll</Button>
        </Link>
      </section>

      <section className="flex flex-col w-full">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>What is FunkyPolls?</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              FunkyPolls can be used for creating polls for use in the classroom, workplace, or
              anywhere else you need. Each poll can be created with up to 5 answers and can be set
              to expire whenever you&apos;d like. Results update in real time, so you can see what
              your voters are deciding as they vote.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>How much does FunkyPolls cost?</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Nothing! FunkyPolls are free to create, vote in, and view. We hope to add paid
              features in the future, but the core functionality will remain free.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Does FunkyPolls store any personal information?</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              While you need an account in order to create and manage polls, voting in FunkyPolls is
              100% anonymous. We don&apos;t store any information about FunkyPoll voters.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>
              I created a FunkyPoll but need to edit or delete it. Can I do that?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Yes! You can manage all your FunkyPolls from your <Link href={"/"}>account</Link>.
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
