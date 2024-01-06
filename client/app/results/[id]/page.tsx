"use client";

import { Loading } from "@/components/Loading";
import PageTitle from "@/components/PageTitle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPollById } from "@/lib/actions";
import { PollWithOptions } from "@/lib/helpers.ts/getPollAndAnswers";
import { useEffect, useState } from "react";
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { io } from "socket.io-client";

export default function Results({ params }: { params: { id: string } }) {
  const { id } = params;

  const [loading, setLoading] = useState(true);
  const [poll, setPoll] = useState<PollWithOptions | null>(null);

  async function fetchPoll() {
    try {
      const data = await getPollById(id);

      setPoll(data.poll);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const initSocket = async () => {
    const socket = io(`${process.env.NEXT_PUBLIC_WS_SERVER_BASE_URL}/?pollId=${id}`);

    // TODO add debounce to only refresh after a small delay
    socket.on("newvote", () => {
      fetchPoll();
    });
  };

  useEffect(() => {
    if (id) {
      // init socket
      initSocket();

      // fetch poll data
      fetchPoll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return (
      <>
        <PageTitle title="Results" />
        <Loading />
      </>
    );
  }

  if (!loading && !poll) {
    return <h1>This FunkyPoll does not exist</h1>;
  }

  return (
    <>
      <PageTitle title="Results" />

      <h2 className="text-2xl font-bold mt-6">{poll?.question}</h2>

      <div className="grid grid-cols-12 gap-4 my-4">
        {poll?.options.map(({ text, votes }, index) => (
          <Card className="col-span-4" key={`option${index}`}>
            <CardHeader>
              <CardTitle>{text}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{votes} votes</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <ResponsiveContainer height={450} className="mt-16">
        <BarChart data={poll?.options}>
          <XAxis dataKey="text" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="votes" fill="hsl(var(--foreground))" />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
}
