const API_URL = import.meta.env.VITE_API_URL_PROD;

// Create a new room
export async function createRoom(roomData) {
  const res = await fetch(`${API_URL}/rooms/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(roomData),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "Failed to create room");
  }

  return res.json();
}

export async function joinRoom(playerData) {
  const res = await fetch(`${API_URL}/rooms/join`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(playerData),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "Failed to create room");
  }

  return res.json();
}
