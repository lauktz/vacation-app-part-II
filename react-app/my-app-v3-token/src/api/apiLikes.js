const API_URL = "http://localhost:5003";
import { getAuthHeaders } from "./apiVacations";

export const likeVacation = async (user_id, vacation_id) => {
  const response = await fetch(`${API_URL}/likes`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ user_id, vacation_id })
  });
  if (!response.ok) throw new Error("Failed to like vacation");
  return response.json();
};

export const unlikeVacation = async (user_id, vacation_id) => {
  const response = await fetch(`${API_URL}/likes`, {
    method: "DELETE",
    headers: getAuthHeaders(),
    body: JSON.stringify({ user_id, vacation_id })
  });
  if (!response.ok) throw new Error("Failed to unlike vacation");
  return response.json();
};

export const getUserLikes = async (user_id) => {
  const response = await fetch(`${API_URL}/likes/${user_id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });
  if (!response.ok) throw new Error("Failed to fetch likes");
  return response.json();
};
