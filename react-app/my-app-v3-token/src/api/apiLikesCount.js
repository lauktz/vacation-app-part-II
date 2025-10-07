const API_URL = "http://localhost:5003";

export const getLikesCount = async () => {
  const response = await fetch(`${API_URL}/likes/counts`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });
  if (!response.ok) throw new Error("Failed to fetch like counts");
  return response.json();
};
