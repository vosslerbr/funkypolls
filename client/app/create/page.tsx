import PageTitle from "@/components/PageTitle";
import { Metadata } from "next";
import CreateForm from "./_components/CreateForm";

export const metadata: Metadata = {
  title: "FunkyPolls | Create",
  description: "Create a new FunkyPoll.",
};

export default function CreatePoll() {
  return (
    <>
      <PageTitle title="Create a FunkyPoll" />

      <CreateForm />
    </>
  );
}
