const API_URL = import.meta.env.VITE_API_URL;

export async function searchEquivalentTopics(topic) {
  const res = await fetch(`${API_URL}/topics/search?topicName=${topic}`, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
    },
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "Search failed!");
  }

  return res.json();
}
