import dayjs from "dayjs";
import { z } from "zod";

const currentDate = dayjs().toDate();

// since we are using the option ids as the enum values, we need to cast the array instead of hardcoding the values
const generateQuestionFormSchema = (optionIds: string[]) => {
  return z.object({
    optionId: z.enum(optionIds as [string, ...string[]], {
      required_error: "Please select an option",
    }),
  });
};

export { currentDate, generateQuestionFormSchema };
