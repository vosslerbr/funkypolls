import { IAnswer } from "@/models/Answer";
import { IPoll } from "@/models/Poll";
import { PollGetResponse } from "@/types";
import axios from "axios";
import dayjs from "dayjs";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Message } from "primereact/message";
import { ProgressBar } from "primereact/progressbar";
import { RadioButton, RadioButtonChangeEvent } from "primereact/radiobutton";
import { useEffect, useState } from "react";

export default function Poll() {
  const [data, setData] = useState<null | PollGetResponse>(null);
  const [voted, setVoted] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isExpired, setIsExpired] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<IAnswer>({} as IAnswer);

  const router = useRouter();

  const { id } = router.query;

  useEffect(() => {
    if (id) {
      // check if user has voted
      if (localStorage.getItem(`poll-${id}`)) {
        setVoted(true);
      }
    }
  }, [id, data]);

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        // fetch poll data
        const { data } = await axios.get(`/api/poll/${id}`);

        if (data.poll.expirationDate) {
          const expirationDate = dayjs(data.poll.expirationDate);

          if (expirationDate.isBefore(dayjs())) {
            setIsExpired(true);
          }
        }

        setSelectedAnswer(data.answers[0]);

        setData(data);
      } catch (error) {
        console.error(error);

        setError("Sorry! We're unable to load this FunkyPoll");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      // fetch poll data
      fetchPoll();
    }
  }, [id]);

  const handleVote = async (answerId: string) => {
    // send vote to API
    const { data } = await axios.put(`/api/poll/vote/${id}`, { answerId });

    localStorage.setItem(`poll-${id}`, "true");

    // update state
    setData(data);
  };

  return (
    <>
      <Head>
        <title>FunkyPolls | Vote</title>
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="vote card">
          {loading ? (
            <ProgressBar mode="indeterminate" />
          ) : error ? (
            <Message severity="error" text={error} />
          ) : (
            <>
              <div className="flex justify-content-between align-items-center mb-5">
                <h1 className="m-0">{data?.poll?.question}</h1>

                <Link href={data?.links.resultsUrl || "/"}>
                  <Button label="FunkyPoll Results" icon="pi pi-external-link" iconPos="right" />
                </Link>
              </div>

              {isExpired ? (
                <p>
                  This poll has expired, but you can still{" "}
                  <Link href={data?.links.resultsUrl || "/"}>view the results</Link> if you want!
                </p>
              ) : voted ? (
                <p>
                  You&apos;ve already voted in this FunkyPoll. See the results{" "}
                  <Link href={data?.links.resultsUrl || "/"}>here</Link>.
                </p>
              ) : (
                <>
                  <div className="flex flex-column gap-3">
                    {data?.answers?.map((answer) => (
                      <div key={answer._id.toString()}>
                        <RadioButton
                          inputId={answer?._id.toString()}
                          name="answer"
                          value={answer}
                          // @ts-ignore this works, idk why TS is complaining
                          onChange={(e: RadioButtonChangeEvent) => setSelectedAnswer(e.value)}
                          checked={selectedAnswer?._id?.toString() === answer?._id?.toString()}
                        />
                        <label htmlFor={answer?._id.toString()} className="ml-2">
                          {answer.answer}
                        </label>
                      </div>
                    ))}
                    <Button
                      label="Submit Vote"
                      className="mt-3 m-auto"
                      onClick={() => handleVote(selectedAnswer?._id?.toString() || "")}
                    />
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
}
