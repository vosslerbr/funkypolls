"use client";

import PageTitle from "@/components/PageTitle";
import { getUserPolls } from "@/lib/actions";
import { useUser } from "@clerk/nextjs";
import { Poll } from "@prisma/client";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [userPolls, setUserPolls] = useState<Poll[]>([]);

  const { user } = useUser();

  useEffect(() => {
    async function fetchPolls() {
      try {
        if (!user) return;

        const userPolls = await getUserPolls(user.id);

        setUserPolls(userPolls);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchPolls();
  }, [user]);

  if (loading) return <h1>Loading...</h1>;

  return (
    <main className="flex min-h-screen flex-col   p-24">
      <PageTitle title="Dashboard" />
      <p className="text-gray-500">Welcome back, {user?.firstName}!</p>

      <div className="mt-8">
        <h2 className="text-xl font-bold">Your FunkyPolls</h2>
        <ul className="mt-4">
          {userPolls.map((poll) => (
            <li key={poll.id}>{poll.question}</li>
          ))}
        </ul>
      </div>
    </main>
  );
}
