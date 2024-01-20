import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    const createdPoll = await prisma.poll.upsert({
      where: { id: "42069" },
      update: {},
      create: {
        name: "Test Poll",
        expiration: "FIVE_MINUTES",
        expirationDate: new Date().toISOString(),
        passcode: "1234",
        userId: "user_2aHEzXvqaLPrWNvQDXWvfCqJ8Sj", // me
      },
    });

    const createdQuestionOne = await prisma.question.upsert({
      where: { id: "question_1" },
      update: {},
      create: {
        question: "Yes or No?",
        poll: {
          connect: { id: createdPoll.id },
        },
      },
    });

    const createdQuestionTwo = await prisma.question.upsert({
      where: { id: "question_2" },
      update: {},
      create: {
        question: "True or False?",
        poll: {
          connect: { id: createdPoll.id },
        },
      },
    });

    const createdQuestionThree = await prisma.question.upsert({
      where: { id: "question_3" },
      update: {},
      create: {
        question: "Black or White?",
        poll: {
          connect: { id: createdPoll.id },
        },
      },
    });

    await prisma.option.createMany({
      data: [
        {
          text: "Yes",
          questionId: createdQuestionOne.id,
        },
        {
          text: "No",
          questionId: createdQuestionOne.id,
        },
        {
          text: "True",
          questionId: createdQuestionTwo.id,
        },
        {
          text: "False",
          questionId: createdQuestionTwo.id,
        },
        {
          text: "Black",
          questionId: createdQuestionThree.id,
        },
        {
          text: "White",
          questionId: createdQuestionThree.id,
        },
      ],
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
