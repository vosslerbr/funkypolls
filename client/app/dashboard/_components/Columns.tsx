"use client";

import { Button } from "@/components/ui/button";
import expirationMap from "@/lib/maps/expirationMap";
import { PollWithLinks } from "@/lib/types";
import { formatExpirationDate } from "@/lib/utils";
import { Status } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Eye } from "lucide-react";
import Link from "next/link";

export const columns: ColumnDef<PollWithLinks>[] = [
  {
    id: "id",
    cell: ({ row }) => {
      const pollId: string = row.getValue("id");

      return (
        <Link href={`/dashboard/poll/${pollId}`}>
          <Button variant="ghost">
            <Eye className="h-6 w-6 text-gray-500" />
          </Button>
        </Link>
      );
    },
    header: "",
    accessorFn: (row) => row.poll.id,
  },
  {
    id: "name",
    accessorFn: (row) => row.poll.name,
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "status",
    accessorFn: (row) => row.poll.status,
    cell: ({ row }) => {
      const status: Status = row.getValue("status");

      switch (status) {
        case Status.DRAFT:
          return (
            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded bg-blue-100 text-blue-600">
              {status}
            </span>
          );
        case Status.EXPIRED:
          return (
            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded bg-red-100 text-red-600">
              {status}
            </span>
          );
        case Status.OPEN:
          return (
            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded bg-green-100 text-green-600">
              {status}
            </span>
          );
        case Status.ARCHIVED:
          return (
            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded bg-gray-100 text-gray-600">
              {status}
            </span>
          );
        default:
          return <span>-</span>;
      }
    },
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "poll.passcode",
    header: "Passcode",
  },
  {
    id: "expiration",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Open For
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorFn: (row) => expirationMap.dbToClient[row.poll.expiration],
  },
  {
    id: "expirationDate",
    accessorFn: (row) => formatExpirationDate(row.poll.expirationDate, row.poll.status),
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Expiration Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "poll",
    accessorFn: (row) => row.poll.questions.length,
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Questions
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  // {
  //   accessorKey: "poll.id",
  //   cell: ({ row }) => {
  //     const poll: PollWithoutLinks = row.getValue("poll");

  //     return (
  //       <Button className="bg-gradient-to-r from-violet-700 to-purple-500" asChild>
  //         <Link href={`/vote/${poll.id}`}>
  //           Vote
  //           <ExternalLinkIcon className="ml-2 h-4 w-4" />
  //         </Link>
  //       </Button>
  //     );
  //   },
  //   header: "",
  //   id: "vote_link",
  // },
  // {
  //   accessorKey: "poll.id",
  //   cell: ({ row }) => {
  //     const poll: PollWithoutLinks = row.getValue("poll");

  //     return (
  //       <Link href={`/results/${poll.id}`}>
  //         <Button className="bg-gradient-to-r from-violet-700 to-purple-500">
  //           Results
  //           <ExternalLinkIcon className="ml-2 h-4 w-4" />
  //         </Button>
  //       </Link>
  //     );
  //   },
  //   header: "",
  //   id: "results_link",
  // },
];
