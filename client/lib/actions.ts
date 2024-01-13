"use server";

import { CreatePollFormValues } from "@/app/create/_helpers/formSetup";
import axios from "axios";
import bcrypt from "bcrypt";
import getPollAndOptions from "./helpers.ts/getPollAndAnswers";
import prisma from "./prisma";
import { generateLinks } from "./utils";

/**
 * Creates a new poll with the given data. Returns the poll's voting and results links
 */
export const createFunkyPoll = async (data: CreatePollFormValues) => {
  const { question, options, userId, password, expirationDate, expiration } = data;

  // encrypt password
  const encryptedPassword = password ? await bcrypt.hash(password, 10) : null;

  const poll = await prisma.poll.create({
    data: {
      question,
      expirationDate: expirationDate.toISOString(),
      expiration,
      userId,
      password: encryptedPassword,
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

  return pollData.links;
};

/**
 * Returns all polls for a given user
 */
export async function getUserPolls(userId: string) {
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
      poll: {
        ...poll,
        password: null,
      },
      links: generateLinks(poll.id),
    };
  });

  return pollsWithLinks;
}

/**
 * Validates the password for a poll with the given id. Returns true if there is no password on the poll or if the password is valid. Returns false otherwise.
 */
export async function validatePollPassword(id: string, password: string) {
  const poll = await prisma.poll.findUnique({
    where: {
      id,
    },
    select: {
      password: true,
    },
  });

  if (!poll) {
    return false;
  }

  if (!poll.password) {
    return true;
  }

  const isPasswordValid = await bcrypt.compare(password, poll.password);

  return isPasswordValid;
}

/**
 * Checks for a poll to exist and if it requires a password. Returns an object with the pollFound and passwordRequired properties.
 */
export async function checkForPollPassword(id: string) {
  const poll = await prisma.poll.findUnique({
    where: {
      id,
    },
    select: {
      password: true,
    },
  });

  if (!poll) {
    return {
      pollFound: false,
      passwordRequired: false,
    };
  }

  if (!poll.password) {
    return {
      pollFound: true,
      passwordRequired: false,
    };
  }

  return {
    pollFound: true,
    passwordRequired: true,
  };
}

/**
 * Returns the poll with the given id
 */
export async function getPollById(id: string) {
  const poll = await getPollAndOptions(id);

  return poll;
}

/**
 * Handles registering a vote for a poll. Returns the poll with the updated vote count.
 */
export async function handleVote(pollId: string, optionId: string) {
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
