"use server";

import { CreatePollFormValues } from "@/app/create/formSetup";
import axios from "axios";
import bcrypt from "bcrypt";
import dayjs from "dayjs";
import getPollAndOptions from "./helpers.ts/getPollAndAnswers";
import prisma from "./prisma";

/**
 * Creates a new poll with the given data. Returns the poll's voting and results links
 */
export const createFunkyPoll = async (data: CreatePollFormValues) => {
  const { question, options, expiration, userId, password } = data;

  // encrypt password
  const encryptedPassword = password ? await bcrypt.hash(password, 10) : null;

  const poll = await prisma.poll.create({
    data: {
      question,
      expirationDate: expiration
        ? dayjs(expiration).toISOString()
        : dayjs().add(30, "day").toISOString(),
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
export const getUserPolls = async (userId: string) => {
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
      links: {
        resultsUrl: `${process.env.BASE_URL}/results/${poll.id.toString()}`,
        voteUrl: `${process.env.BASE_URL}/vote/${poll.id.toString()}`,
      },
    };
  });

  return pollsWithLinks;
};

/**
 * Validates the password for a poll with the given id. Returns true if there is no password on the poll or if the password is valid. Returns false otherwise.
 */
export const validatePollPassword = async (id: string, password: string) => {
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
};

/**
 * Returns true if the poll with the given id has a password. Returns false otherwise.
 */
export const checkForPollPassword = async (id: string) => {
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
    return false;
  }

  return true;
};

/**
 * Returns the poll with the given id
 */
export const getPollById = async (id: string) => {
  const poll = await getPollAndOptions(id);

  return poll;
};

/**
 * Handles registering a vote for a poll. Returns the poll with the updated vote count.
 */
export const handleVote = async (pollId: string, optionId: string) => {
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
};
