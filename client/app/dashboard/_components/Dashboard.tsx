"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserPolls } from "@/lib/actions";
import { PollWithLinks } from "@/lib/types";
import { useUser } from "@clerk/nextjs";
import { Status } from "@prisma/client";
import { CalendarClock, DoorOpen, Hash, PencilLine } from "lucide-react";
import { useEffect, useState } from "react";
import { columns } from "./Columns";
import { DataTable } from "./DataTable";

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
      <Card className="mt-8">
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
    <Card className="mt-8">
      <CardHeader>
        <h2 className="text-2xl font-bold">My FunkyPolls</h2>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-12 gap-4 mb-8">
          <Card className="col-span-12 sm:col-span-6 lg:col-span-3">
            <CardHeader className="text-blue-600 bg-blue-100 mb-6 rounded-t">
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

          <Card className="col-span-12 sm:col-span-6 lg:col-span-3">
            <CardHeader className="text-green-600 bg-green-100 mb-6 rounded-t">
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

          <Card className="col-span-12 sm:col-span-6 lg:col-span-3">
            <CardHeader className="text-red-600 bg-red-100 mb-6 rounded-t">
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

          <Card className="col-span-12 sm:col-span-6 lg:col-span-3">
            <CardHeader className="text-gray-600 bg-gray-100 mb-6 rounded-t border">
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
        </div>

        <DataTable columns={columns} data={userPolls} />
      </CardContent>
    </Card>
  );
}
