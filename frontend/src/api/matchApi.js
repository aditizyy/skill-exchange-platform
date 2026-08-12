import axiosInstance from "./axiosInstance";

export const getSuggestedMatches = async () => {
  const response = await axiosInstance.get("/matches/suggested");
  return response.data;
};

export const sendMatchRequest = async (userId) => {
  const response = await axiosInstance.post("/matches/request", {
    receiverId: userId,
  });
  return response.data;
};

export const getInboxRequests = async () => {
  const response = await axiosInstance.get("/matches/inbox");
  return response.data;
};

export const respondToRequest = async (requestId, status) => {
  const response = await axiosInstance.patch(
    `/matches/${requestId}`,
    { status }
  );
  return response.data;
};