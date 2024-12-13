import { MockGiftShelfList } from "../mock/mockBasketGift";

export const fetchGiftShelves = async (): Promise<any[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MockGiftShelfList);
    }, 1000);
  });
};
