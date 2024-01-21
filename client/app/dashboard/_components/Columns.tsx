"use client";

import { Button } from "@/components/ui/button";
import expirationMap from "@/lib/maps/expirationMap";
import statusMap from "@/lib/maps/statusMap";
import { PollWithLinks, PollWithoutLinks } from "@/lib/types";
import { formatExpirationDate } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { ExternalLinkIcon, Eye } from "lucide-react";
import Link from "next/link";

export const columns: ColumnDef<PollWithLinks>[] = [
  {
    accessorKey: "poll.id",
    cell: ({ row }) => {
      const poll: PollWithoutLinks = row.getValue("poll");

      return (
        <Link href={`/dashboard/poll/${poll.id}`}>
          <Button variant="ghost">
            <Eye className="h-6 w-6 text-gray-500" />
          </Button>
        </Link>
      );
    },
    header: "",
    id: "results_link",
  },
  {
    accessorKey: "poll.name",
    header: "Name",
  },
  {
    accessorKey: "poll.passcode",
    header: "Passcode",
  },
  {
    accessorKey: "poll.expiration",
    header: "Open For",
    accessorFn: (row) => expirationMap.dbToClient[row.poll.expiration],
  },
  {
    accessorKey: "poll.status",
    header: "Status",
    accessorFn: (row) => statusMap.dbToClient[row.poll.status],
    cell: ({ row }) => {
      const poll: PollWithoutLinks = row.getValue("poll");

      const isClosed = statusMap.dbToClient[poll.status] === "Closed";
      const isExpired = statusMap.dbToClient[poll.status] === "Open" && dayjs(poll.expirationDate).isBefore(dayjs());
      const isOpen = statusMap.dbToClient[poll.status] === "Open";

      switch (true) {
        case isClosed:
          return (
            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded bg-red-100 text-red-600">
              {poll.status}
            </span>
          );
        case isExpired:
          return (
            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded bg-orange-100 text-orange-600">
              EXPIRED
            </span>
          );
        case isOpen:
          return (
            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded bg-green-100 text-green-600">
              {poll.status}
            </span>
          );
        default:
          return <span>-</span>;
      }
    },
  },
  {
    accessorKey: "expirationDate",
    accessorFn: (row) => formatExpirationDate(row.poll.expirationDate, row.poll.status),
    header: "Expires At",
  },
  {
    accessorKey: "poll",
    cell: ({ row }) => {
      const poll: PollWithoutLinks = row.getValue("poll");

      return poll.questions.length;
    },
    header: "Questions",
  },
  {
    accessorKey: "poll.id",
    cell: ({ row }) => {
      const poll: PollWithoutLinks = row.getValue("poll");

      return (
        <Link href={`/vote/${poll.id}`} target="_blank">
          <Button className="bg-gradient-to-r from-violet-700 to-purple-500">
            Vote
            <ExternalLinkIcon className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      );
    },
    header: "",
    id: "vote_link",
  },
  {
    accessorKey: "poll.id",
    cell: ({ row }) => {
      const poll: PollWithoutLinks = row.getValue("poll");

      return (
        <Link href={`/results/${poll.id}`} target="_blank">
          <Button className="bg-gradient-to-r from-violet-700 to-purple-500">
            Results
            <ExternalLinkIcon className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      );
    },
    header: "",
    id: "results_link",
  },
];
