"use client";

import { Loading } from "@/components/Loading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserPolls } from "@/lib/actions";
import { PollWithLinks } from "@/lib/types";
import { useUser } from "@clerk/nextjs";
import dayjs from "dayjs";
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

  if (loading || !isLoaded || !userPolls) {
    return <Loading />;
  }

  return (
    <>
      <div className="grid grid-cols-12 gap-4 my-8">
        <Card className="md:col-span-6 col-span-12">
          <CardHeader>
            <CardTitle>Total FunkyPolls</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{userPolls?.length || "None, create a FunkyPoll to get started!"}</p>
          </CardContent>
        </Card>

        <Card className="md:col-span-6 col-span-12">
          <CardHeader>
            <CardTitle>Active FunkyPolls</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              {userPolls?.filter(({ poll }) => {
                return dayjs(poll.expirationDate).isAfter(dayjs());
              })?.length || "0"}
            </p>
          </CardContent>
        </Card>
      </div>

      <DataTable columns={columns} data={userPolls} />
    </>
  );
}
