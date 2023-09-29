import { IAnswer } from "@/models/Answer";
import { IPoll } from "@/models/Poll";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Poll() {
  const [poll, setPoll] = useState<null | IPoll>(null);
  const [answers, setAnswers] = useState<null | IAnswer[]>(null);
  const [voted, setVoted] = useState<boolean>(false);

  const router = useRouter();

  const { id } = router.query;

  useEffect(() => {
    if (id) {
      // check if user has voted
      if (localStorage.getItem(`poll-${id}`)) {
        setVoted(true);
      }
    }
  }, [id, answers]);

  useEffect(() => {
    const fetchPoll = async () => {
      // fetch poll data
      const { data } = await axios.get(`/api/poll/${id}`);

      setPoll(data.poll);
      setAnswers(data.answers);
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
    setAnswers(data.answers);
  };

  return (
    <>
      <Head>
        <title>FunkyPolls</title>
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>{poll?.question}</h1>
        {voted && <p>You have voted!</p>}
        <ul>
          {answers?.map((answer) => (
            <li key={answer?._id.toString()}>
              {answer.answer}: {answer.voteCount}
              {!voted && <button onClick={() => handleVote(answer?._id.toString())}>Vote</button>}
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
