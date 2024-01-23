"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import expirationMap from "@/lib/maps/expirationMap";
import { PollWithLinks } from "@/lib/types";
import { formatExpirationDate } from "@/lib/utils";
import { Status } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { statusColorMap } from "./Dashboard";

export const columns: ColumnDef<PollWithLinks>[] = [
  {
    id: "actions",
    cell: ({ row }) => {
      const { poll, links } = row.original;

      const allowedToOpen = poll.status === Status.DRAFT;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Link href={`/dashboard/poll/${poll.id}`}>View Details</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={`/results/${poll.id}`}>View Results</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(links.voteUrl)}>
              Copy Vote Link
            </DropdownMenuItem>

            {allowedToOpen && <DropdownMenuItem>Mark as Open</DropdownMenuItem>}

            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(poll.passcode)}>
              Copy Passcode
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <div>Archive</div>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600 hover:bg-red-200 hover:text-red-600 focus:bg-red-200 focus:text-red-600">
              <div>Delete</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
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

      return (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded ${statusColorMap[status]}`}>
          {status}
        </span>
      );
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
