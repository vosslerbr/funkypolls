import dayjs from "dayjs";
import { z } from "zod";

const currentDate = dayjs().toDate();
const thirtyDaysFromNow = dayjs().add(30, "day").toDate();

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
  password: z
    .string()
    .min(4, {
      message: "Password must be at least 4 characters",
    })
    .optional(),
  userId: z.string(),
});

// TODO figure out a way to create actual dates from each of these when submitting the form
// ? i.e. if the user selects "1 week", the expiration date should be 1 week from time of submission
const expirationOptions = [
  "5 minutes",
  "10 minutes",
  "15 minutes",
  "30 minutes",
  "1 hour",
  "2 hours",
  "4 hours",
  "8 hours",
  "12 hours",
  "1 day (24 hours)",
  "1 week",
  "1 month (30 days)",
];

type CreatePollFormValues = z.infer<typeof formSchema>;

const defaultValues: CreatePollFormValues = {
  question: "",
  options: [{ value: "" }, { value: "" }],
  expiration: expirationOptions[0],
  password: undefined,
  userId: "",
};

export { currentDate, defaultValues, expirationOptions, formSchema, type CreatePollFormValues };
