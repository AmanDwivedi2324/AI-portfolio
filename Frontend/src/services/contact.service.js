import apiClient from "./apiClient";

/** Send a contact-form message to the backend (stored in the CRM inbox). */
export async function sendContactMessage({ name, email, message, website }) {
  const { data } = await apiClient.post("/api/contact", { name, email, message, website });
  return data;
}

/** Turn an API error into a message for the visitor. */
export function contactErrorMessage(error, fallbackEmail) {
  const apiMessage = error.response?.data?.error?.message;
  if (error.response?.status === 429 || error.response?.status === 400) return apiMessage;
  return `Couldn't send right now. Please email me at ${fallbackEmail}.`;
}
