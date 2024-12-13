import { MockTierList } from "@/mock/mockTierList";

export const fetchTierList = async (): Promise<any[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MockTierList);
    }, 1000);
  });
};
