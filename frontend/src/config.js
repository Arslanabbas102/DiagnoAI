export const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";
export const token = localStorage.getItem("token");
