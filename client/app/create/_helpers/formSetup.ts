import dayjs from "dayjs";
import { z } from "zod";

const currentDate = dayjs().toDate();

const formSchema = z.object({
  question: z
    .string()
    .min(1, {
      message: "A question is required",
    })
    .max(120, {
      message: "Question cannot be longer than 120 characters",
    }),
  options: z
    .array(
      z.object({
        value: z
          .string()
          .min(1, {
            message: "Option cannot be blank",
          })
          .max(120, {
            message: "Option cannot be longer than 120 characters",
          }),
      })
    )
    .min(2, {
      message: "You must have at least two options",
    })
    .max(5, {
      message: "You cannot have more than five options",
    }),
  expiration: z.string({
    required_error: "Please select an expiration",
  }),
  expirationDate: z.date(),
  password: z
    .string()
    .min(4, {
      message: "Password must be at least 4 characters",
    })
    .optional(),
  userId: z.string(),
});

// ? if the user selects "1 week", the expiration date should be 1 week from time of submission
const expirationOptions = [
  { label: "5 minutes", getDate: () => dayjs().add(5, "minutes").toDate() },
  { label: "10 minutes", getDate: () => dayjs().add(10, "minutes").toDate() },
  { label: "15 minutes", getDate: () => dayjs().add(15, "minutes").toDate() },
  { label: "30 minutes", getDate: () => dayjs().add(30, "minutes").toDate() },
  { label: "1 hour", getDate: () => dayjs().add(1, "hour").toDate() },
  { label: "2 hours", getDate: () => dayjs().add(2, "hours").toDate() },
  { label: "4 hours", getDate: () => dayjs().add(4, "hours").toDate() },
  { label: "8 hours", getDate: () => dayjs().add(8, "hours").toDate() },
  { label: "12 hours", getDate: () => dayjs().add(12, "hours").toDate() },
  { label: "1 day", getDate: () => dayjs().add(1, "day").toDate() },
  { label: "1 week", getDate: () => dayjs().add(1, "week").toDate() },
  { label: "1 month", getDate: () => dayjs().add(1, "month").toDate() },
];

type CreatePollFormValues = z.infer<typeof formSchema>;

const defaultValues: CreatePollFormValues = {
  question: "",
  options: [{ value: "" }, { value: "" }],
  expiration: expirationOptions[0].label,
  expirationDate: new Date(),
  password: undefined,
  userId: "",
};

export { currentDate, defaultValues, expirationOptions, formSchema, type CreatePollFormValues };
