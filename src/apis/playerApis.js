const API_URL = import.meta.env.VITE_API_URL_DEV;

//Create a new player
export async function createPlayer(playerData) {
  const res = await fetch(`${API_URL}/players/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(playerData),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "Failed to create player");
  }

  res.json();
}

//Login a player
export async function loginPlayer(playerData) {
  const res = await fetch(`${API_URL}/players/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(playerData),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "Failed to login");
  }

  return res.json();
}
