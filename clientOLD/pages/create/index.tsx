import NextOrPrevButton from "@/components/NextOrPrevButton";
import { PollGetResponse } from "@/types";
import apiRequest from "@/utils/apiRequest";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { MenuItem } from "primereact/menuitem";
import { Steps } from "primereact/steps";
import { Nullable } from "primereact/ts-helpers";
import { ReactElement, useState } from "react";
import { NextPageWithLayout } from "../_app";
import Layout from "@/components/Layout";

const CreatePoll: NextPageWithLayout = () => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const [expiration, setExpiration] = useState<Nullable<Date>>(null);
  const [links, setLinks] = useState<null | { resultsUrl: string; voteUrl: string }>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const router = useRouter();

  const items: MenuItem[] = [
    {
      label: "Question",
    },
    {
      label: "Options",
    },
    {
      label: "Expiration Date",
    },
    {
      label: "Save",
    },
  ];

  const handleSubmit = async () => {
    try {
      const data: PollGetResponse = await apiRequest({
        path: "/poll",
        method: "post",
        body: {
          poll: {
            question: question.trim(),
            expiration,
          },
          options: options.filter((option) => option).map((option) => option.trim()), // filter out empty
        },
      });

      setLinks(data.links);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddAnswer = () => {
    setOptions([...options, ""]);
  };

  // useEffect(() => {
  //   // TODO figure out how to focus on the new answer input

  //   const newAnswer = document.querySelector(".answer:last-of-type");
  //   console.log(newAnswer);

  //   if (newAnswer) {
  //     // @ts-ignore since focus DOES work here
  //     newAnswer.focus();
  //   }
  // }, [answers]);

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
          <Dialog
            header="FunkyPoll Created!"
            visible={links ? true : false}
            onHide={() => {
              router.push(links.resultsUrl);
            }}>
            <h3>Results</h3>
            <div className="flex gap-4">
              <Link href={links.resultsUrl} target="_blank">
                <Button label="Go" icon="pi pi-external-link" iconPos="right" />
              </Link>
              <Button
                label="Copy Link"
                icon="pi pi-copy"
                iconPos="right"
                severity="secondary"
                onClick={() => {
                  navigator.clipboard.writeText(links.resultsUrl);
                }}
              />
            </div>

            <h3>Vote</h3>
            <div className="flex gap-4">
              <Link href={links.voteUrl} target="_blank">
                <Button label="Go" icon="pi pi-external-link" iconPos="right" />
              </Link>
              <Button
                label="Copy Link"
                icon="pi pi-copy"
                iconPos="right"
                severity="secondary"
                onClick={() => {
                  navigator.clipboard.writeText(links.voteUrl);
                }}
              />
            </div>
          </Dialog>
        ) : (
          <div className="flex flex-column gap-4 create-poll card">
            <h1>Create your FunkyPoll</h1>
            <Steps model={items} activeIndex={activeIndex} readOnly={false} />

            {activeIndex === 0 && (
              <>
                <InputText
                  placeholder="Question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  id="question"
                  onKeyUp={(e) => {
                    if (e.key === "Enter" && question) {
                      setActiveIndex(1);
                    }
                  }}
                />
                <label htmlFor="question">
                  <small>This is the question you want to ask.</small>
                </label>
                <div className="flex justify-content-end">
                  <NextOrPrevButton
                    type="next"
                    activeIndex={activeIndex}
                    setActiveIndex={setActiveIndex}
                    disabled={!question}
                  />
                </div>
              </>
            )}

            {activeIndex === 1 && (
              <>
                {/* TODO */}
                {options.map((option, index) => {
                  return (
                    <InputText
                      key={index}
                      placeholder="Option"
                      value={option}
                      onChange={(e) => {
                        const newAnswers = [...options];
                        newAnswers[index] = e.target.value;
                        setOptions(newAnswers);
                      }}
                      className="option"
                      onKeyUp={(e) => {
                        if (e.key === "Enter" && e.shiftKey) {
                          handleAddAnswer();
                        } else if (e.key === "Enter") {
                          setActiveIndex(2);
                        }
                      }}
                    />
                  );
                })}

                <label>
                  <small>These are the options you want to provide to your FunkyPoll voters.</small>
                </label>
                <Button
                  label="Add an option"
                  onClick={handleAddAnswer}
                  className="m-auto"
                  icon="pi pi-plus"
                  iconPos="right"
                />
                <div className="flex justify-content-between">
                  <NextOrPrevButton
                    type="prev"
                    activeIndex={activeIndex}
                    setActiveIndex={setActiveIndex}
                  />
                  <NextOrPrevButton
                    type="next"
                    activeIndex={activeIndex}
                    setActiveIndex={setActiveIndex}
                    disabled={!options.length || options.filter((option) => !option).length > 0}
                  />
                </div>
              </>
            )}

            {activeIndex === 2 && (
              <>
                <Calendar
                  value={expiration}
                  onChange={(e) => setExpiration(e.value)}
                  placeholder="Expiration Date"
                  showIcon
                  minDate={new Date()}
                  inputId="expiration-date"
                />
                <label htmlFor="expiration-date">
                  <small>
                    Choose a date you&apos;d like this FunkyPoll to expire. If left blank, your
                    FunkyPoll will automatically expire after 30 days. Expired polls can be viewed
                    but not voted on.
                  </small>
                </label>
                <div className="flex justify-content-between">
                  <NextOrPrevButton
                    type="prev"
                    activeIndex={activeIndex}
                    setActiveIndex={setActiveIndex}
                  />
                  <NextOrPrevButton
                    type="next"
                    activeIndex={activeIndex}
                    setActiveIndex={setActiveIndex}
                  />
                </div>
              </>
            )}

            {activeIndex === 3 && (
              <>
                <label>
                  <small>
                    Create your FunkyPoll to get your voting and results links, or go back to finish
                    up.
                  </small>
                </label>
                <div className="flex justify-content-between">
                  <NextOrPrevButton
                    type="prev"
                    activeIndex={activeIndex}
                    setActiveIndex={setActiveIndex}
                  />
                  <Button onClick={handleSubmit} label="Create" severity="success" />
                </div>
              </>
            )}
          </div>
        )}
      </main>
    </>
  );
};

CreatePoll.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default CreatePoll;
