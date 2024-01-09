import dayjs from "dayjs";
import { z } from "zod";

const currentDate = dayjs().toDate();

const passwordFormSchema = z.object({
  password: z.string(),
});

type PasswordFormValues = z.infer<typeof passwordFormSchema>;

const passwordDefaultValues: PasswordFormValues = {
  password: "",
};

// since we are using the option ids as the enum values, we need to cast the array instead of hardcoding the values
const generateVoteFormSchema = (optionIds: string[]) => {
  return z.object({
    optionId: z.enum(optionIds as [string, ...string[]], {
      required_error: "Please select an option",
    }),
  });
};

export {
  currentDate,
  generateVoteFormSchema,
  passwordDefaultValues,
  passwordFormSchema,
  type PasswordFormValues,
};
