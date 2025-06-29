import axiosInstance from "./axios";

export async function getAllBooks ()  {
  const response = await axiosInstance.get("/users/outgoing-friend-requests");
  return response.data;
}

