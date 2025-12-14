const API_URL = import.meta.env.VITE_API_URL_DEV;

export async function addPlayerTopic(topicData) {
  const res = await fetch(`${API_URL}/playertopics/add`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(topicData),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "Search failed!");
  }

  return res.json();
}
