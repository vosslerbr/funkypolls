"use client";

import { Loading } from "@/components/Loading";
import PageTitle from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getUserPolls } from "@/lib/actions";
import { PollAndLinks } from "@/lib/helpers.ts/getPollAndAnswers";
import { useUser } from "@clerk/nextjs";
import dayjs from "dayjs";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [userPolls, setUserPolls] = useState<PollAndLinks[]>([]);

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
    return (
      <>
        <PageTitle title="Dashboard" />
        <Loading />
      </>
    );
  }

  // TODO make this a data table with sorting, filtering, pagination, etc
  return (
    <>
      <PageTitle title="Dashboard" />

      <div className="grid grid-cols-12 gap-4 my-4">
        <Card className="md:col-span-6 col-span-12">
          <CardHeader>
            <CardTitle>Total FunkyPolls</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{userPolls?.length || "-"}</p>
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
              })?.length || "-"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Question</TableHead>
            <TableHead>Expiration</TableHead>
            <TableHead>Expired?</TableHead>
            <TableHead>Total Votes</TableHead>
            <TableHead>Number of Options</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userPolls.map(({ poll, links }) => (
            <TableRow key={poll.id}>
              <TableCell className="font-medium">{poll.question}</TableCell>
              <TableCell>{dayjs(poll.expirationDate).format("MM/DD/YYYY")}</TableCell>
              <TableCell>{dayjs(poll.expirationDate).isBefore(dayjs()) ? "Yes" : "No"}</TableCell>
              <TableCell>
                {poll.options.reduce((acc, curr) => {
                  return acc + curr.votes;
                }, 0)}
              </TableCell>
              <TableCell>{poll.options.length}</TableCell>
              <TableCell>
                <Link href={`/vote/${poll.id}`}>
                  <Button>Vote</Button>
                </Link>
              </TableCell>
              <TableCell>
                <Link href={`/results/${poll.id}`}>
                  <Button>Results</Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
