import PageTitle from "@/components/PageTitle";
import { Metadata } from "next";
import AddPollForm from "./_components/AddPollForm";

export const metadata: Metadata = {
  title: "FunkyPolls | Create",
  description: "Create a new FunkyPoll.",
};

export default function CreatePollPage() {
  return (
    <>
      <PageTitle title="Create a FunkyPoll" />
      <AddPollForm />
    </>
  );
}
