import { maxStringFieldLength } from "@/lib/constants";
import dayjs from "dayjs";
import { z } from "zod";

const currentDate = dayjs().toDate();

const questionFormSchema = z.object({
  pollId: z.string(),
  question: z
    .string()
    .min(1, {
      message: "A question is required",
    })
    .max(maxStringFieldLength, {
      message: `Question cannot be longer than ${maxStringFieldLength} characters`,
    }),
  options: z
    .array(
      z.object({
        value: z
          .string()
          .min(1, {
            message: "Option cannot be blank",
          })
          .max(maxStringFieldLength, {
            message: `Option cannot be longer than ${maxStringFieldLength} characters`,
          }),
      })
    )
    .min(2, {
      message: "You must have at least two options",
    })
    .max(5, {
      message: "You cannot have more than five options",
    }),
  userId: z.string(),
});

// ? if the user selects "1 week", the expiration date should be 1 week from time of submission
const expirationOptions = [
  { label: "5 minutes", getDate: () => dayjs().add(5, "minutes").toDate() },
  { label: "10 minutes", getDate: () => dayjs().add(10, "minutes").toDate() },
  { label: "15 minutes", getDate: () => dayjs().add(15, "minutes").toDate() },
];

type CreateQuestionFormValues = z.infer<typeof questionFormSchema>;

const defaultValues: CreateQuestionFormValues = {
  pollId: "",
  question: "",
  options: [{ value: "" }, { value: "" }],
  userId: "",
};

export { currentDate, defaultValues, expirationOptions, questionFormSchema, type CreateQuestionFormValues };
