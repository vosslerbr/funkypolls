import dayjs from "dayjs";
import { z } from "zod";

const currentDate = dayjs().toDate();

const formSchema = z.object({
  password: z.string(),
});

type PasswordFormValues = z.infer<typeof formSchema>;

const defaultValues: PasswordFormValues = {
  password: "",
};

export { currentDate, defaultValues, formSchema, type PasswordFormValues };
