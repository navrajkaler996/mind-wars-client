const API_URL = import.meta.env.VITE_API_URL;

export async function getPracticeQuestions(topicData) {
  const res = await fetch(`${API_URL}/practice/get-questions`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(topicData),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "Failed to fetch questions!");
  }

  return res.json();
}
