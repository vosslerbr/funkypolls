"use server";

import { CreatePollFormValues } from "@/app/create/_helpers/formSetup";
import { auth } from "@clerk/nextjs";
import axios from "axios";
import getPollAndOptions, { PollAndLinks } from "./helpers.ts/getPollAndAnswers";
import prisma from "./prisma";
import { generateLinks, generateRandomString } from "./utils";

/**
 * Creates a new poll with the given data. Returns the poll's voting and results links
 */
export const createFunkyPoll = async (data: CreatePollFormValues) => {
  const { question, options, userId, expirationDate, expiration, requirePasscodeToView } = data;

  const { userId: loggedInUserId } = auth();

  if (!userId || userId !== loggedInUserId) {
    throw new Error("You can only create polls for your own account");
  }

  const passcode = generateRandomString(8);

  // TODO check for any active polls with the same passcode

  const poll = await prisma.poll.create({
    data: {
      question,
      expirationDate: expirationDate.toISOString(),
      expiration,
      userId,
      passcode,
      requirePasscodeToView,
    },
  });

  for (const option of options) {
    await prisma.option.create({
      data: {
        text: option.value,
        poll: {
          connect: {
            id: poll.id,
          },
        },
      },
    });
  }

  const pollData = await getPollAndOptions(poll.id);

  return { links: pollData.links, passcode };
};

/**
 * Returns all polls for a given user
 */
export async function getUserPolls(userId: string): Promise<PollAndLinks[]> {
  const { userId: loggedInUserId } = auth();

  if (!userId || userId !== loggedInUserId) {
    throw new Error("You can only view your own polls");
  }

  const polls = await prisma.poll.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      options: true,
    },
  });

  const pollsWithLinks = polls.map((poll) => {
    return {
      poll,
      links: generateLinks(poll.id),
    };
  });

  return pollsWithLinks;
}

export async function validatePollPasscode(id: string, passcode: string) {
  const poll = await prisma.poll.findUnique({
    where: {
      id,
    },
    select: {
      passcode: true,
    },
  });

  if (!poll) {
    return false;
  }

  const isPasscodeValid = passcode === poll.passcode;

  return isPasscodeValid;
}

export async function checkForPollPasscode(id: string) {
  const poll = await prisma.poll.findUnique({
    where: {
      id,
    },
    select: {
      requirePasscodeToView: true,
    },
  });

  if (!poll) {
    return {
      pollFound: false,
      requirePasscodeToView: false,
    };
  }

  return {
    pollFound: true,
    requirePasscodeToView: poll.requirePasscodeToView,
  };
}

/**
 * Returns the poll with the given id
 */
export async function getPollById(id: string) {
  try {
    const poll = await getPollAndOptions(id);

    return poll;
  } catch (error) {
    console.error(error);
    throw new Error("This FunkyPoll doesn't seem to exist. Please try again.");
  }
}

/**
 * Handles registering a vote for a poll. Returns the poll with the updated vote count.
 */
export async function handleVote({
  pollId,
  optionId,
  passcode,
}: {
  pollId: string;
  optionId: string;
  passcode: string;
}) {
  const isPasscodeValid = await validatePollPasscode(pollId, passcode);

  if (!isPasscodeValid) {
    throw new Error("Invalid passcode");
  }

  // increment the voteCount for the answer by 1
  await prisma.option.update({
    where: {
      id: optionId,
    },
    data: {
      votes: {
        increment: 1,
      },
    },
  });

  await axios.post(`${process.env.WS_SERVER_BASE_URL}/api/v1/newvote/${pollId}`);
}
