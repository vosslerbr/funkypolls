"use client";

import PollStatus, { statusColorMap } from "@/components/PollStatus";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { getUserPolls } from "@/lib/actions";
import { PollWithLinks } from "@/lib/types";
import { useUser } from "@clerk/nextjs";
import { Status } from "@prisma/client";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import { CalendarClock, DoorOpen, Hash, PencilLine } from "lucide-react";
import { useEffect, useState } from "react";
import { DataTable } from "../../../components/DataTable";
import { columns } from "./Columns";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [userPolls, setUserPolls] = useState<PollWithLinks[]>([]);

  const { user, isLoaded } = useUser();

  const { DRAFT, OPEN, EXPIRED, ARCHIVED } = statusColorMap;

  useEffect(() => {
    async function fetchPolls() {
      try {
        setLoading(true);

        if (!user) return;

        const userPolls = await getUserPolls(user.id);

        setUserPolls(userPolls);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchPolls();
  }, [user]);

  function countOpenPolls() {
    return userPolls.filter(({ poll }) => {
      return poll.status === Status.OPEN;
    }).length;
  }

  function countDraftPolls() {
    return userPolls.filter(({ poll }) => {
      return poll.status === Status.DRAFT;
    }).length;
  }

  function countExpiredPolls() {
    // once a poll is opened, it can't be closed and that is when expiration date is set too
    return userPolls.filter(({ poll }) => {
      return poll.status === Status.EXPIRED;
    }).length;
  }

  function countArchivedPolls() {
    return userPolls.filter(({ poll }) => {
      return poll.status === Status.ARCHIVED;
    }).length;
  }

  // TODO we can probably use Suspense here, but that's for a future me to figure out
  if (loading || !isLoaded || !userPolls) {
    return (
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">My FunkyPolls</h2>
        </CardHeader>
        <CardContent>
          <Skeleton className="w-full h-[300px] rounded" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="text-slate-700">
      <div className="grid grid-cols-12 gap-4 mb-8">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Card className="col-span-12 sm:col-span-6 lg:col-span-3 border-2 border-violet-100">
                <CardHeader className={`${DRAFT} mb-6 rounded-t`}>
                  <CardTitle>
                    <div className="flex flex-row justify-between">
                      Draft <PencilLine className="w-6 h-6" />
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center font-bold text-violet-700 text-xl">
                  <p>{countDraftPolls()}</p>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                <PollStatus status="DRAFT" /> FunkyPolls can be edited and archived, but not voted on until marked as{" "}
                <PollStatus status="OPEN" />.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Card className="col-span-12 sm:col-span-6 lg:col-span-3  border-2 border-emerald-100">
                <CardHeader className={`${OPEN} mb-6 rounded-t`}>
                  <CardTitle>
                    <div className="flex flex-row justify-between">
                      Open <DoorOpen className="w-6 h-6" />
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center font-bold text-emerald-700 text-xl">
                  <p>{countOpenPolls()}</p>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                <PollStatus status="OPEN" /> FunkyPolls cannot be edited or archived, but can be voted on until they
                expire. Expiration countdown starts when FunkyPoll is marked as <PollStatus status="OPEN" />.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Card className="col-span-12 sm:col-span-6 lg:col-span-3  border-2 border-orange-100">
                <CardHeader className={`${EXPIRED} mb-6 rounded-t`}>
                  <CardTitle>
                    <div className="flex flex-row justify-between">
                      Expired <CalendarClock className="w-6 h-6" />
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center font-bold text-orange-700 text-xl">
                  <p>{countExpiredPolls()}</p>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                <PollStatus status="EXPIRED" /> FunkyPolls cannot be edited or voted on. They can be archived.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Card className="col-span-12 sm:col-span-6 lg:col-span-3 border-2 border-rose-100">
                <CardHeader className={`${ARCHIVED} mb-6 rounded-t`}>
                  <CardTitle>
                    <div className="flex flex-row justify-between">
                      Archived <Hash className="w-6 h-6" />
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center font-bold text-rose-700 text-xl">
                  <p>{countArchivedPolls()}</p>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                <PollStatus status="ARCHIVED" /> FunkyPolls act as though they have been deleted. They cannot be viewed,
                edited, or voted on.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <DataTable columns={columns} data={userPolls} />
    </div>
  );
}
