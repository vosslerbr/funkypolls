"use client";

import PageTitle from "@/components/PageTitle";
import { getPollById } from "@/lib/actions";
import { PollWithOptions } from "@/lib/helpers.ts/getPollAndAnswers";
import { useEffect, useState } from "react";

export default function Vote({ params }: { params: { id: string } }) {
  const { id } = params;
  const [loading, setLoading] = useState(true);
  const [poll, setPoll] = useState<PollWithOptions | null>(null);

  useEffect(() => {
    async function fetchPoll() {
      try {
        const data = await getPollById(id);

        console.log(data);

        setPoll(data.poll);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchPoll();
  }, [id]);

  if (loading) return <h1>Loading...</h1>;

  if (!loading && !poll) {
    return <h1>This FunkyPoll does not exist</h1>;
  }

  return (
    <>
      <PageTitle title="Results" />
      <h2>{poll?.question}</h2>

      <ul className="mt-4">
        {poll?.options.map((option) => (
          <li key={option.id}>
            {option.text} - {option.votes}
          </li>
        ))}
      </ul>
    </>
  );
}
