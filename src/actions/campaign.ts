import { message } from "antd";
import { MockCampaign } from "../mock/mockCampaign";

export const fetchMockData = async (): Promise<any[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MockCampaign);
    }, 1000);
  });
};

export const updateMockData = async (id: number, updatedData: any) => {
  try {
    const index = MockCampaign.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error("Data not found.");
    }

    MockCampaign[index] = { ...MockCampaign[index], ...updatedData };

    message.success("Mock data updated successfully!");

    return MockCampaign[index];
  } catch (error) {
    console.error("Error updating mock data:", error);
    message.error("Failed to update mock data.");
    throw error;
  }
};
