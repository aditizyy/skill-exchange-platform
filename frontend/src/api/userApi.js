import axiosInstance from "./axiosInstance";

export const getUserProfile = async () => {
  const response = await axiosInstance.get("/user/profile");
  return response.data;
};

export const updateUserProfile = async (profileData) => {
  const response = await axiosInstance.put("/user/profile", profileData);
  return response.data;
};