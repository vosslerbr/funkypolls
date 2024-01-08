import PageTitle from "@/components/PageTitle";
import { Metadata } from "next";
import Dashboard from "./_components/Dashboard";

export const metadata: Metadata = {
  title: "FunkyPolls | Dashboard",
  description: "Your FunkyPolls dashboard.",
};

export default function DashboardPage() {
  return (
    <>
      <PageTitle title="Dashboard" />
      <Dashboard />
    </>
  );
}
