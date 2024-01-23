"use client";

import { statusColorMap } from "@/app/dashboard/_components/Dashboard";
import { Loading } from "@/components/Loading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import expirationMap from "@/lib/maps/expirationMap";
import { PollWithLinks } from "@/lib/types";
import { formatExpirationDate } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { Status } from "@prisma/client";
import { CalendarClock, Check, Copy, DoorOpen, HelpCircle, KeyRound, Settings2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function Details({ data }: { data: PollWithLinks }) {
  const [copiedPasscode, setCopiedPasscode] = useState(false);

  const { user, isLoaded } = useUser();

  // TODO refactor this to be reusable. Also currently used in dashboard table
  function renderStatus({ poll }: PollWithLinks) {
    const { status } = poll;

    return (
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded ${statusColorMap[status]}`}>
        {status}
      </span>
    );
  }

  useEffect(() => {
    if (copiedPasscode) {
      const timeout = setTimeout(() => {
        setCopiedPasscode(false);
      }, 1500);

      return () => clearTimeout(timeout);
    }
  }, [copiedPasscode]);

  if (!isLoaded) return <Loading />;

  if (user?.id !== data.poll.userId) return <h1>You are not authorized to view this page.</h1>;

  return (
    <>
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">About this FunkyPoll</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-12 gap-4">
            <Card className="col-span-12 sm:col-span-6 lg:col-span-4">
              <CardHeader>
                <CardTitle>
                  <div className="flex flex-row justify-between">
                    Questions <HelpCircle className="w-6 h-6 text-gray-400" />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{data.poll.questions.length}</p>
              </CardContent>
            </Card>
            <Card className="col-span-12 sm:col-span-6 lg:col-span-4">
              <CardHeader>
                <CardTitle>
                  <div className="flex flex-row justify-between">
                    Passcode <KeyRound className="w-6 h-6 text-gray-400" />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p
                  className="flex flex-row items-center cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(data.poll.passcode);
                    setCopiedPasscode(true);
                  }}>
                  {copiedPasscode ? (
                    <>
                      Copied!
                      <Check className="ml-2 h-4 w-4 text-gray-400" />
                    </>
                  ) : (
                    <>
                      {data.poll.passcode}
                      <Copy className="ml-2 h-4 w-4 text-gray-400" />
                    </>
                  )}
                </p>
              </CardContent>
            </Card>
            <Card className="col-span-12 sm:col-span-6 lg:col-span-4">
              <CardHeader>
                <CardTitle>
                  <div className="flex flex-row justify-between">
                    Status <Settings2 className="w-6 h-6 text-gray-400" />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>{renderStatus(data)}</CardContent>
            </Card>
            <Card className="col-span-12 sm:col-span-6 lg:col-span-4">
              <CardHeader>
                <CardTitle>
                  <div className="flex flex-row justify-between">
                    Open For <DoorOpen className="w-6 h-6 text-gray-400" />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{expirationMap.dbToClient[data.poll.expiration]}</p>
              </CardContent>
            </Card>

            {data.poll.status === Status.OPEN && (
              <Card className="col-span-12 sm:col-span-6 lg:col-span-4">
                <CardHeader>
                  <CardTitle>
                    <div className="flex flex-row justify-between">
                      Expiration Date <CalendarClock className="w-6 h-6 text-gray-400" />
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{formatExpirationDate(data.poll.expirationDate, data.poll.status)}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>

      {data.poll.questions.map((question) => {
        return (
          <Card className="mt-8" key={question.id}>
            <CardHeader>
              <h2 className="text-2xl font-bold">{question.question}</h2>
            </CardHeader>
            <CardContent>
              <h3 className="text-xl text-gray-500">Options</h3>
              {question.options.map((option, index) => {
                const isLastOption = index === question.options.length - 1;

                if (isLastOption) {
                  return (
                    <div className="flex flex-col mt-4" key={option.id}>
                      <p className="mr-2">{option.text}</p>
                    </div>
                  );
                }

                return (
                  <div className="flex flex-col my-4" key={option.id}>
                    <p className="mr-2 mb-4">{option.text}</p>
                    <Separator />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        );
      })}
    </>
  );
}
