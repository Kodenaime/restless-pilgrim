import  axiosInstance  from "./axios";

export async function getAllBooks ()  {
  const response = await axiosInstance.get("/users/outgoing-friend-requests");
  return response.data;
}


// Get all devotionals
export async function getAllDevotionals() {
  const response = await axiosInstance.get('/devotionals');
  return response.data;
}

// Get single devotional by ID
export async function getDevotionalById(id) {
  const response = await axiosInstance.get(`/devotionals/${id}`);
  return response.data;
}