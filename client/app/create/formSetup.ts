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
  expiration: z.date().min(currentDate),
  password: z
    .string()
    .min(4, {
      message: "Password must be at least 4 characters",
    })
    .optional(),
  userId: z.string(),
});

type CreatePollFormValues = z.infer<typeof formSchema>;

const defaultValues: CreatePollFormValues = {
  question: "",
  options: [{ value: "" }, { value: "" }],
  expiration: thirtyDaysFromNow,
  password: undefined,
  userId: "",
};

export { currentDate, defaultValues, formSchema, type CreatePollFormValues };
