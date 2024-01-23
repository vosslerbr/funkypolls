import { Loading } from "@/components/Loading";
import InfoMessage from "@/components/messages/InfoMessage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/use-toast";
import { handleAnswerQuestion } from "@/lib/actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Prisma } from "@prisma/client";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { generateQuestionFormSchema } from "../_helpers/singleSelectFormSetup";

export default function SingleSelectForm({
  question,
}: {
  question: Prisma.QuestionGetPayload<{ include: { options: true } }>;
}) {
  const [checkingLocalStorage, setCheckingLocalStorage] = useState(true);
  const [hasAnsweredQuestion, setHasAnsweredQuestion] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { pollId, id: questionId, question: questionText, options } = question;

  const optionIds = options.map((option) => option.id);

  const questionForm = generateQuestionFormSchema(optionIds);

  const voteForm = useForm<z.infer<typeof questionForm>>({
    resolver: zodResolver(questionForm),
  });

  async function onSubmit(values: z.infer<typeof questionForm>) {
    try {
      setSubmitting(true);

      await handleAnswerQuestion({ pollId: pollId, optionId: values.optionId, passcode: "" });

      localStorage.setItem(`fpq${questionId}`, "true");

      setHasAnsweredQuestion(true);
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "There was an error saving your vote. Please try again.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "There was an error saving your vote. Please try again.",
        });
      }
    } finally {
      setSubmitting(false);
    }
  }

  useEffect(() => {
    // check if user has answered this question before
    if (localStorage.getItem(`fpq${questionId}`)) {
      setHasAnsweredQuestion(true);
    }

    setCheckingLocalStorage(false);
  }, [questionId]);

  if (checkingLocalStorage) {
    return <Loading />;
  }

  return (
    <>
      {hasAnsweredQuestion ? (
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-2xl font-bold">{questionText}</h2>
          </CardHeader>
          <CardContent>
            <InfoMessage
              title="You've answered this question"
              message="You can view the results of this question's FunkyPoll using the button below."
            />
          </CardContent>
          <CardFooter>
            <Link href={`/results/${pollId}`}>
              <Button className="sm:w-auto w-full bg-gradient-to-r from-violet-700 to-purple-500">View Results</Button>
            </Link>
          </CardFooter>
        </Card>
      ) : (
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-2xl font-bold">{questionText}</h2>
          </CardHeader>
          <CardContent>
            <Form {...voteForm}>
              <form onSubmit={voteForm.handleSubmit(onSubmit)}>
                <FormField
                  control={voteForm.control}
                  name="optionId"
                  render={({ field }) => (
                    <FormItem className="space-y-3 mb-8">
                      <FormLabel>My vote:</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1">
                          {options.map((option) => (
                            <FormItem className="flex items-center space-x-3 space-y-0" key={option.id}>
                              <FormControl>
                                <RadioGroupItem value={option.id} />
                              </FormControl>
                              <FormLabel className="font-normal">{option.text}</FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {submitting ? (
                  <Button
                    type="submit"
                    disabled={true}
                    className="sm:w-auto w-full bg-gradient-to-r from-violet-700 to-purple-500">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving your answer...
                  </Button>
                ) : (
                  <Button type="submit" className="sm:w-auto w-full bg-gradient-to-r from-violet-700 to-purple-500">
                    Save Answer
                  </Button>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </>
  );
}
