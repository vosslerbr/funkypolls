"use server";

import { CreateQuestionFormValues } from "@/app/create/[id]/_helpers/formSetup";
import { CreatePollFormValues } from "@/app/create/helpers/pollFormSetup";
import { auth } from "@clerk/nextjs";
import axios from "axios";
import { revalidatePath } from "next/cache";
import prisma from "./prisma";
import { PollWithLinks } from "./types";
import { generateLinks, generatePasscode } from "./utils";

/**
 * Creates a new poll with the given data. Returns the poll's voting and results links
 */
export const createFunkyPoll = async (data: CreatePollFormValues) => {
  const { name, userId } = data;

  const { userId: loggedInUserId } = auth();

  if (!userId || userId !== loggedInUserId) {
    throw new Error("You can only create polls for your own account");
  }

  const passcode = generatePasscode(8);

  const poll = await prisma.poll.create({
    data: {
      name,
      userId,
      passcode,
    },
  });

  return poll.id;
};

export const createQuestion = async (data: CreateQuestionFormValues, addAnother: boolean) => {
  const { question, options, userId, pollId } = data;

  const { userId: loggedInUserId } = auth();

  if (!userId || userId !== loggedInUserId) {
    throw new Error("You can only create polls for your own account");
  }

  const newQuestion = prisma.question.create({
    data: {
      question,
      pollId,
      options: {
        create: options.map((option) => {
          return {
            text: option.value,
          };
        }),
      },
    },
  });

  if (!addAnother) revalidatePath("/dashboard");

  return newQuestion;
};

/**
 * Returns all polls for a given user
 */
export async function getUserPolls(userId: string): Promise<PollWithLinks[]> {
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
      questions: {
        include: {
          options: true,
        },
      },
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
    throw new Error("This FunkyPoll doesn't seem to exist. Please try again.");
  }

  const isPasscodeValid = passcode === poll.passcode;

  return isPasscodeValid;
}

export async function checkForPollPasscode(id: string): Promise<boolean> {
  const poll = await prisma.poll.findUnique({
    where: {
      id,
    },
    select: {
      requirePasscodeToView: true,
    },
  });

  if (!poll) throw new Error("This FunkyPoll doesn't seem to exist. Please try again.");

  return poll.requirePasscodeToView;
}

/**
 * Returns the poll with the given id
 */
export async function getPollById(id: string): Promise<PollWithLinks> {
  try {
    const poll = await prisma.poll.findUnique({
      where: {
        id,
      },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });

    if (!poll || poll.status === "ARCHIVED") {
      throw new Error("Poll not found");
    }

    return { poll, links: generateLinks(poll.id) };
  } catch (error) {
    console.error(error);
    throw new Error("This FunkyPoll doesn't seem to exist. Please try again.");
  }
}

/**
 * Handles registering a vote for a poll. Returns the poll with the updated vote count.
 */
export async function handleAnswerQuestion({
  pollId,
  optionId,
  passcode,
}: {
  pollId: string;
  optionId: string;
  passcode: string;
}) {
  // TODO reenabled at a poll level
  // const isPasscodeValid = await validatePollPasscode(pollId, passcode);

  // if (!isPasscodeValid) {
  //   throw new Error("Invalid passcode");
  // }

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

  // TODO we'll need to update socket server to handle this at a question level, i'd say
  await axios.post(`${process.env.WS_SERVER_BASE_URL}/api/v1/newvote/${pollId}`);
}
