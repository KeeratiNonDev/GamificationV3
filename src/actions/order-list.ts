import { MockOrder } from "../mock/mockOrderList";

export const fetchOrderList = async (params: any): Promise<any[]> => {
  const { campaignId, timelineId, giftId } = params;
  const key = `${timelineId}.${giftId}`;
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredOrders = MockOrder.filter(
        (order) =>
          order.campaignId === campaignId &&
          `${order.timelineId}.${order.giftId}` === key
      );
      resolve(filteredOrders.length > 0 ? filteredOrders[0].orderList : []);
    }, 1000);
  });
};
