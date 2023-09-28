import axios from "axios";
import Head from "next/head";
import { useState } from "react";

export default function Poll() {
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState<string[]>([""]);
  const [expiration, setExpiration] = useState("");

  const handleSubmit = async () => {
    try {
      const { data } = await axios.post("/api/poll", {
        poll: {
          question,
          expiration,
        },
        answers,
      });

      console.log(data);
    } catch (error) {
      console.error(error);
    }
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
        <h1>Create a poll</h1>
        <input
          type="text"
          placeholder="Question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <input
          type="text"
          placeholder="Answer"
          value={answers[0]}
          onChange={(e) => setAnswers([e.target.value])}
        />
        <input
          type="text"
          placeholder="Answer"
          value={answers[1]}
          onChange={(e) => setAnswers([answers[0], e.target.value])}
        />
        <input
          type="text"
          placeholder="Answer"
          value={answers[2]}
          onChange={(e) => setAnswers([answers[0], answers[1], e.target.value])}
        />
        <input
          type="date"
          placeholder="Expiration"
          value={expiration}
          onChange={(e) => setExpiration(e.target.value)}
        />
        <button onClick={handleSubmit}>Create</button>
      </main>
    </>
  );
}
