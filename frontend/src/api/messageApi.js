import axiosInstance from "./axiosInstance";

export const getConversations = async () => {
  const response = await axiosInstance.get("/messages/conversations");
  return response.data;
};

// Finds the existing conversation with `userId`, or creates one if the
// two users have an accepted connection. Backend returns 403 if not.
export const getOrCreateConversation = async (userId) => {
  const response = await axiosInstance.post("/messages/conversations", {
    userId,
  });
  return response.data;
};

export const getMessages = async (conversationId) => {
  const response = await axiosInstance.get(
    `/messages/conversations/${conversationId}/messages`
  );
  return response.data;
};

export const sendMessage = async (conversationId, text) => {
  const response = await axiosInstance.post(
    `/messages/conversations/${conversationId}/messages`,
    { text }
  );
  return response.data;
};