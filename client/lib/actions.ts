"use server";

import { CreatePollFormValues } from "@/app/create/formSetup";
import bcrypt from "bcrypt";
import dayjs from "dayjs";
import getPollAndOptions from "./helpers.ts/getPollAndAnswers";
import prisma from "./prisma";

export const createFunkyPoll = async (data: CreatePollFormValues) => {
  console.log("createFunkyPoll", data);

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

export const getUserPolls = async (userId: string) => {
  const polls = await prisma.poll.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return polls;
};

/**
 * Validates the password for a poll with the given id
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

export const getPollById = async (id: string) => {
  const poll = await getPollAndOptions(id);

  return poll;
};

export const handleVote = async (id: string, optionId: string) => {
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

  const pollData = await getPollAndOptions(id);

  return pollData;
};
