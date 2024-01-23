"use client";

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
import { columns } from "./Columns";
import { DataTable } from "./DataTable";

/**
 * Maps poll status to color, for consistent styling. Has to be in a tsx file for Tailwind to work.
 */
export const statusColorMap: { [key in Status]: string } = {
  DRAFT: "bg-violet-100 text-violet-700",
  OPEN: "bg-green-100 text-green-700",
  EXPIRED: "bg-orange-100 text-orange-700",
  ARCHIVED: "bg-rose-100 text-rose-700",
};

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [userPolls, setUserPolls] = useState<PollWithLinks[]>([]);

  const { user, isLoaded } = useUser();

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
    <Card>
      <CardHeader>
        <h2 className="text-2xl font-bold">My FunkyPolls</h2>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-12 gap-4 mb-8">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Card className="col-span-12 sm:col-span-6 lg:col-span-3">
                  <CardHeader className={`${statusColorMap.DRAFT} mb-6 rounded-t`}>
                    <CardTitle>
                      <div className="flex flex-row justify-between">
                        Draft <PencilLine className="w-6 h-6" />
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{countDraftPolls()}</p>
                  </CardContent>
                </Card>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded ${statusColorMap.DRAFT}`}>
                    DRAFT
                  </span>{" "}
                  FunkyPolls can be edited and archived, but not voted on until marked as{" "}
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded ${statusColorMap.OPEN}`}>
                    OPEN
                  </span>
                  .
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Card className="col-span-12 sm:col-span-6 lg:col-span-3">
                  <CardHeader className={`${statusColorMap.OPEN} mb-6 rounded-t`}>
                    <CardTitle>
                      <div className="flex flex-row justify-between">
                        Open <DoorOpen className="w-6 h-6" />
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{countOpenPolls()}</p>
                  </CardContent>
                </Card>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded ${statusColorMap.OPEN}`}>
                    OPEN
                  </span>{" "}
                  FunkyPolls cannot be edited or archived, but can be voted on until they expire. Expiration countdown
                  starts when FunkyPoll is marked as{" "}
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded ${statusColorMap.OPEN}`}>
                    OPEN
                  </span>
                  .
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Card className="col-span-12 sm:col-span-6 lg:col-span-3">
                  <CardHeader className={`${statusColorMap.EXPIRED} mb-6 rounded-t`}>
                    <CardTitle>
                      <div className="flex flex-row justify-between">
                        Expired <CalendarClock className="w-6 h-6" />
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{countExpiredPolls()}</p>
                  </CardContent>
                </Card>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded ${statusColorMap.EXPIRED}`}>
                    EXPIRED
                  </span>{" "}
                  FunkyPolls cannot be edited or voted on. They can be archived.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Card className="col-span-12 sm:col-span-6 lg:col-span-3">
                  <CardHeader className={`${statusColorMap.ARCHIVED} mb-6 rounded-t`}>
                    <CardTitle>
                      <div className="flex flex-row justify-between">
                        Archived <Hash className="w-6 h-6" />
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{countArchivedPolls()}</p>
                  </CardContent>
                </Card>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded ${statusColorMap.ARCHIVED}`}>
                    ARCHIVED
                  </span>{" "}
                  FunkyPolls act as though they have been deleted. They cannot be viewed, edited, or voted on.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <DataTable columns={columns} data={userPolls} />
      </CardContent>
    </Card>
  );
}
