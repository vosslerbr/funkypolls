"use client";

import { Button } from "@/components/ui/button";
import { PollAndLinks, PollWithOptions } from "@/lib/helpers.ts/getPollAndAnswers";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import Link from "next/link";

export const columns: ColumnDef<PollAndLinks>[] = [
  {
    accessorKey: "poll.question",
    header: "Question",
  },
  {
    accessorKey: "poll.passcode",
    header: "Passcode",
  },
  {
    accessorKey: "poll.expiration",
    header: "Open For",
  },
  {
    accessorKey: "expirationDate",
    accessorFn: (row) => dayjs(row.poll.expirationDate).format("MM/DD/YYYY h:mm a"),
    header: "Expires At",
  },
  {
    accessorKey: "poll",
    cell: ({ row }) => {
      const poll: PollWithOptions = row.getValue("poll");

      return poll.options.reduce((acc, curr) => {
        return acc + curr.votes;
      }, 0);
    },
    header: "Votes",
  },
  {
    accessorKey: "options",
    accessorFn: (row) => row.poll.options.length,
    header: "Options",
  },
  {
    accessorKey: "poll.id",
    cell: ({ row }) => {
      const poll: PollWithOptions = row.getValue("poll");

      return (
        <Link href={`/vote/${poll.id}`}>
          <Button>Vote</Button>
        </Link>
      );
    },
    header: "",
    id: "vote_link",
  },
  {
    accessorKey: "poll.id",
    cell: ({ row }) => {
      const poll: PollWithOptions = row.getValue("poll");

      return (
        <Link href={`/results/${poll.id}`}>
          <Button>Results</Button>
        </Link>
      );
    },
    header: "",
    id: "results_link",
  },
];
