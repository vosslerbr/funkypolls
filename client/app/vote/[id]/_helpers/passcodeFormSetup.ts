import { z } from "zod";

const passcodeFormSchema = z.object({
  passcode: z.string(),
});

type PasscodeFormValues = z.infer<typeof passcodeFormSchema>;

const passcodeDefaultValues: PasscodeFormValues = {
  passcode: "",
};

export { passcodeDefaultValues, passcodeFormSchema, type PasscodeFormValues };
