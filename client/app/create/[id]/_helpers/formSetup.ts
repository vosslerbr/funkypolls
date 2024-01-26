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

type CreateQuestionFormValues = z.infer<typeof questionFormSchema>;

const defaultValues: CreateQuestionFormValues = {
  pollId: "",
  question: "",
  options: [{ value: "" }, { value: "" }],
  userId: "",
};

export { currentDate, defaultValues, questionFormSchema, type CreateQuestionFormValues };
