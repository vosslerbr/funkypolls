import { IAnswer } from "@/models/Answer";
import { PollGetResponse } from "@/types";
import apiRequest from "@/utils/apiRequest";
import axios from "axios";
import dayjs from "dayjs";
import { set } from "mongoose";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Chart } from "primereact/chart";
import { Message } from "primereact/message";
import { ProgressBar } from "primereact/progressbar";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function Poll() {
  const [data, setData] = useState<null | PollGetResponse>(null);
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isExpired, setIsExpired] = useState(false);

  const router = useRouter();

  const { id } = router.query;

  useEffect(() => {
    const labels = data?.answers.map((answer: IAnswer) => answer.answer) || [];
    const values = data?.answers.map((answer: IAnswer) => answer.voteCount) || [];

    const chartData = {
      labels,
      datasets: [
        {
          label: "Votes",
          data: values,

          backgroundColor: "#6366f1",
          borderColor: "#6366f1",
          borderWidth: 1,
        },
      ],
    };

    const options = {
      indexAxis: "y",
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    };

    if (data?.poll.expirationDate) {
      const expirationDate = dayjs(data.poll.expirationDate);

      if (expirationDate.isBefore(dayjs())) {
        setIsExpired(true);
      }
    }

    setChartData(chartData);
    setChartOptions(options);
  }, [data]);

  const fetchPoll = async () => {
    try {
      const data: PollGetResponse = await apiRequest({
        path: `/poll/${id}`,
        method: "get",
      });

      setData(data);
    } catch (error) {
      console.error(error);

      setError("Sorry! We're unable to load this FunkyPoll");
    } finally {
      setLoading(false);
    }
  };

  const initSocket = async () => {
    const socket = io(`${process.env.NEXT_PUBLIC_API_BASE_URL}?pollId=${id}`);

    socket.on("newvote", (data: PollGetResponse) => {
      setData(data);
    });
  };

  useEffect(() => {
    if (id) {
      // init socket
      initSocket();

      // fetch poll data
      fetchPoll();
    }
  }, [id]);

  return (
    <>
      <Head>
        <title>FunkyPolls | Results</title>
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="results card">
          {loading ? (
            <ProgressBar mode="indeterminate" />
          ) : error ? (
            <Message severity="error" text={error} />
          ) : (
            <>
              <div className="flex justify-content-between align-items-center mb-5">
                <div>
                  <h1 className="m-0">{data?.poll?.question}</h1>
                  {data?.poll?.expirationDate && (
                    <p className="card-footer m-0 mt-2">
                      Expires: {dayjs(data.poll.expirationDate).format("MM/DD/YYYY")}
                    </p>
                  )}
                </div>

                {!isExpired && (
                  <Link href={data?.links.voteUrl || "/"} target="_blank">
                    <Button
                      label="Vote in this FunkyPoll"
                      icon="pi pi-external-link"
                      iconPos="right"
                    />
                  </Link>
                )}
              </div>

              <Card title="Results">
                <Chart type="bar" data={chartData} options={chartOptions} />
              </Card>

              <div className="flex justify-content-between align-items-center mt-5">
                <div>
                  <p className="card-footer m-0 ">
                    Created: {dayjs(data?.poll?.createdAt).format("MM/DD/YYYY")}
                  </p>
                  <p className="card-footer m-0 mt-2">
                    Updated: {dayjs(data?.poll?.updatedAt).format("MM/DD/YYYY")}
                  </p>
                </div>
                <Button
                  label="Refresh"
                  icon="pi pi-refresh"
                  onClick={fetchPoll}
                  severity="secondary"
                />
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}
