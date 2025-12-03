const API_URL = import.meta.env.VITE_API_URL_DEV;

// Create a new room
export async function createRoom(roomData) {
  console.log(API_URL);
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
