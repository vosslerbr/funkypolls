import dayjs from "dayjs";
import { z } from "zod";

const currentDate = dayjs().toDate();

const passcodeFormSchema = z.object({
  passcode: z.string(),
});

type PasscodeFormValues = z.infer<typeof passcodeFormSchema>;

const passcodeDefaultValues: PasscodeFormValues = {
  passcode: "",
};

// since we are using the option ids as the enum values, we need to cast the array instead of hardcoding the values
const generateVoteFormSchema = (optionIds: string[]) => {
  return z.object({
    optionId: z.enum(optionIds as [string, ...string[]], {
      required_error: "Please select an option",
    }),
    passcode: z.string(),
  });
};

export {
  currentDate,
  generateVoteFormSchema,
  passcodeDefaultValues,
  passcodeFormSchema,
  type PasscodeFormValues,
};
