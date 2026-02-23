import API_CLIENT from "./config";

const REVIEWS_BASE_PATH = "/api/reviews";

export const createItemReview = async (payload) => {
  const response = await API_CLIENT.post(REVIEWS_BASE_PATH, payload);
  return response.data;
};

export const getEducatorItemReviews = async (educatorId, params = {}) => {
  const response = await API_CLIENT.get(
    `${REVIEWS_BASE_PATH}/educator/${educatorId}`,
    { params }
  );
  return response.data;
};
