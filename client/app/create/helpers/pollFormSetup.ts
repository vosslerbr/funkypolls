import { z } from "zod";

const pollFormSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "A poll name is required",
    })
    .max(120, {
      message: "Name cannot be longer than 120 characters",
    }),
  passcode: z.string(),
  userId: z.string(),
});

type CreatePollFormValues = z.infer<typeof pollFormSchema>;

const defaultValues: CreatePollFormValues = {
  name: "",
  passcode: "",
  userId: "",
};

export { defaultValues, pollFormSchema, type CreatePollFormValues };
