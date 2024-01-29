import { Expiration } from "@prisma/client";
import { z } from "zod";

const openPollFormSchema = z.object({
  expiration: z.enum([Expiration.FIVE_MINUTES, Expiration.TEN_MINUTES, Expiration.FIFTEEN_MINUTES]),
  requirePasscode: z.boolean(),
  userId: z.string(),
});

type OpenPollFormValues = z.infer<typeof openPollFormSchema>;

const defaultValues: OpenPollFormValues = {
  expiration: Expiration.FIVE_MINUTES,
  requirePasscode: false,
  userId: "",
};

// ? if the user selects "1 week", the expiration date should be 1 week from time of submission

export { defaultValues, openPollFormSchema, type OpenPollFormValues };
