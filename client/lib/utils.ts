import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Links } from "./helpers.ts/getPollAndAnswers";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateLinks(pollId: string): Links {
  return {
    resultsUrl: `${process.env.BASE_URL}/results/${pollId}`,
    voteUrl: `${process.env.BASE_URL}/vote/${pollId}`,
  };
}

export function generateRandomString(length: number): string {
  const possibleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
  }
  return result;
}
