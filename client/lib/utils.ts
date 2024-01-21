import { Status } from "@prisma/client";
import { clsx, type ClassValue } from "clsx";
import dayjs from "dayjs";
import { twMerge } from "tailwind-merge";
import { Links } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateLinks(pollId: string): Links {
  return {
    resultsUrl: `${process.env.BASE_URL}/results/${pollId}`,
    voteUrl: `${process.env.BASE_URL}/vote/${pollId}`,
  };
}

export function generatePasscode(length: number): string {
  const possibleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
  }

  // This has a 1 in 2.8 Trillion chance of collision, so it's probably fine to not check for uniqueness
  return result;
}

// formats the given expiration date into a string, if poll hasn't been opened yet, return "-" since there is no valid expiration date yet
export function formatExpirationDate(expirationDate: Date, pollStatus: Status): string {
  const isDraftOrArchived = pollStatus === Status.DRAFT || pollStatus === Status.ARCHIVED;

  if (isDraftOrArchived) return "";

  return dayjs(expirationDate).format("MM/DD/YYYY h:mm a");
}
