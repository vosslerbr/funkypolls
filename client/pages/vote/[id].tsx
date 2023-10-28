import { PollGetResponse } from "@/types";
import apiRequest from "@/utils/apiRequest";
import { Option } from "@prisma/client";
import dayjs from "dayjs";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { ProgressBar } from "primereact/progressbar";
import { RadioButton, RadioButtonChangeEvent } from "primereact/radiobutton";
import { ReactElement, useEffect, useState } from "react";
import { NextPageWithLayout } from "../_app";
import Layout from "@/components/Layout";

const PollVote: NextPageWithLayout = () => {
  const [data, setData] = useState<null | PollGetResponse>(null);
  const [voted, setVoted] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isExpired, setIsExpired] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option>({} as Option);

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
        const data: PollGetResponse = await apiRequest({
          path: `/poll/${id}`,
          method: "get",
        });

        if (data.poll.expirationDate) {
          const expirationDate = dayjs(data.poll.expirationDate);

          if (expirationDate.isBefore(dayjs())) {
            setIsExpired(true);
          }
        }

        setSelectedOption(data.poll.options[0]);

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

  const handleVote = async (optionId: string) => {
    const data: PollGetResponse = await apiRequest({
      path: `/poll/vote/${id}`,
      method: "put",
      body: {
        optionId,
      },
    });

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
                  You voted in this FunkyPoll. See the results{" "}
                  <Link href={data?.links.resultsUrl || "/"}>here</Link>.
                </p>
              ) : (
                <>
                  <div className="flex flex-column gap-3">
                    {data?.poll.options?.map((option) => (
                      <div key={option.id}>
                        <RadioButton
                          inputId={option.id}
                          name="answer"
                          value={option}
                          // @ts-ignore this works, idk why TS is complaining
                          onChange={(e: RadioButtonChangeEvent) => setSelectedOption(e.value)}
                          checked={selectedOption.id === option.id}
                        />
                        <label htmlFor={option.id} className="ml-2">
                          {option.text}
                        </label>
                      </div>
                    ))}
                    <Button
                      label="Submit Vote"
                      className="mt-3 m-auto"
                      onClick={() => handleVote(selectedOption.id || "")}
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
};

PollVote.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default PollVote;
