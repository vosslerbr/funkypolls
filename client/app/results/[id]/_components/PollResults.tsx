"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPollById } from "@/lib/actions";
import { Links, PollAndLinks, PollWithOptions } from "@/lib/helpers.ts/getPollAndAnswers";
import { useEffect, useState } from "react";
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { io } from "socket.io-client";

export default function PollResults({ pollAndLinks }: { pollAndLinks: PollAndLinks }) {
  const [poll, setPoll] = useState<PollWithOptions>(pollAndLinks.poll);
  const [links] = useState<Links>(pollAndLinks.links);

  async function refreshPoll() {
    try {
      const data = await getPollById(poll.id);

      setPoll(data.poll);
    } catch (error) {
      console.error(error);
    }
  }

  let timer: NodeJS.Timeout | undefined = undefined;

  const initSocket = async () => {
    const socket = io(`${process.env.NEXT_PUBLIC_WS_SERVER_BASE_URL}/?pollId=${poll.id}`);

    socket.on("newvote", () => {
      clearTimeout(timer);

      timer = setTimeout(() => {
        refreshPoll();
      }, 1000);
    });
  };

  useEffect(() => {
    initSocket();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <h2 className="text-2xl font-bold mt-6">{poll?.question}</h2>

      <div className="grid lg:grid-cols-12 md:grid-cols-8 grid-cols-4 gap-4 my-4">
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

      <div className="grid lg:grid-cols-12  grid-cols-6 gap-4 mt-16">
        <Card className="col-span-6">
          <CardHeader>
            <CardTitle>Vote URL</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{links?.voteUrl || ""}</p>
          </CardContent>
        </Card>
        <Card className="col-span-6">
          <CardHeader>
            <CardTitle>Results URL</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{links?.resultsUrl || ""}</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
