import { IAnswer } from "@/models/Answer";
import { IPoll } from "@/models/Poll";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Poll() {
  const [data, setData] = useState<null | { poll: IPoll; answers: IAnswer[] }>(null);

  const router = useRouter();

  const { id } = router.query;

  useEffect(() => {
    const fetchPoll = async () => {
      // fetch poll data
      const { data } = await axios.get(`/api/poll/${id}`);

      setData(data);
    };

    if (id) {
      // fetch poll data
      fetchPoll();
    }
  }, [id]);

  return (
    <>
      <Head>
        <title>FunkyPolls</title>
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>{data?.poll?.question}</h1>
        <ul>
          {data?.answers?.map((answer) => (
            <li key={answer?._id.toString()}>
              {answer.answer}: {answer.voteCount}
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
