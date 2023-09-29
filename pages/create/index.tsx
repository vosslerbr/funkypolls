import axios from "axios";
import { set } from "mongoose";
import Head from "next/head";
import Link from "next/link";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";
import { Nullable } from "primereact/ts-helpers";
import { useState } from "react";

export default function Poll() {
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState<string[]>([""]);
  const [expiration, setExpiration] = useState<Nullable<Date>>(null);
  const [links, setLinks] = useState<null | { resultsUrl: string; voteUrl: string }>(null);

  const handleSubmit = async () => {
    console.log(question);
    console.log(answers);
    console.log(expiration);

    // try {
    //   const { data } = await axios.post("/api/poll", {
    //     poll: {
    //       question,
    //       expiration,
    //     },
    //     answers,
    //   });

    //   setLinks(data);
    // } catch (error) {
    //   console.error(error);
    // }
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
        {links ? (
          <>
            <Link href={links.resultsUrl}>
              <Button label="Results" />
            </Link>
            <p>{links.resultsUrl}</p>
            <Link href={links.voteUrl}>
              <Button label="Vote" />
            </Link>
            <p>{links.voteUrl}</p>
          </>
        ) : (
          <div className="flex flex-column gap-4">
            <h1>Create a poll</h1>
            <InputText
              placeholder="Question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <InputText
              placeholder="Answer"
              value={answers[0]}
              onChange={(e) => setAnswers([e.target.value])}
            />
            <InputText
              placeholder="Answer"
              value={answers[1]}
              onChange={(e) => setAnswers([answers[0], e.target.value])}
            />
            <InputText
              placeholder="Answer"
              value={answers[2]}
              onChange={(e) => setAnswers([answers[0], answers[1], e.target.value])}
            />
            <Calendar value={expiration} onChange={(e) => setExpiration(e.value)} />
            <Button onClick={handleSubmit} label="Create" />
          </div>
        )}
      </main>
    </>
  );
}
