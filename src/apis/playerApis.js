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

export async function updateTotalScore(playerData) {
  const res = await fetch(`${API_URL}/players/updatescore`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(playerData),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "Failed to update player");
  }

  return res.json();
}

export async function updatePlayerBattlesWon(playerData) {
  const res = await fetch(`${API_URL}/players/updatebattleswon`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(playerData),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "Failed to update player");
  }

  return res.json();
}

// Get a player by email
export async function getPlayer(email) {
  const res = await fetch(`${API_URL}/players/${email}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "Failed to fetch player");
  }

  return res.json();
}
