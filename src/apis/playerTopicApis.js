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

export async function getPlayerTopicData(email) {
  const res = await fetch(
    `${API_URL}/playertopics/getplayertopic?email=${email}`,
    {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    }
  );

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "Get request failed!");
  }

  return res.json();
}
