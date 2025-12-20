import API_CLIENT from "./config";

export const createPaymentOrder = async ({ studentId, productId, productType }) => {
  const response = await API_CLIENT.post("/api/payments/orders", {
    studentId,
    productId,
    productType,
  });
  return response.data;
};

export const verifyPayment = async ({ orderId, paymentId, signature, intentId }) => {
  const response = await API_CLIENT.post("/api/payments/verify", {
    orderId,
    paymentId,
    signature,
    intentId,
  });
  return response.data;
};

export const getPaymentStatus = async (intentId) => {
  const response = await API_CLIENT.get(`/api/payments/${intentId}`);
  return response.data;
};
