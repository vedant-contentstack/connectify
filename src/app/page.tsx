"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const trpc = useTRPC();
  const { data: users } = useQuery(trpc.getUsers.queryOptions());

  return <div>{JSON.stringify(users)}</div>;
}
