"use client";
import { THandler } from "./context/DataContext";
import { DataContextProvider } from "./context/DataContext";
import { CampaginUpdateForm } from "./form/campaign.update";

export default function Home() {
  const handler: Record<string, THandler> = {
    test: async () => {
      return [{ id: 1, name: "1234" }];
    },
  };

  const fetch = async (name: string, params?: any) => {
    console.log("fetch");
    return await handler?.[name as keyof typeof handler]?.(params);
  };

  return (
    <DataContextProvider fetch={fetch}>
      <CampaginUpdateForm />
    </DataContextProvider>
  );
}
