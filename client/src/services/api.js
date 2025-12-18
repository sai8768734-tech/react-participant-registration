const API_BASE_URL = "http://localhost:4000";

export async function fetchParticipants() {
  const res = await fetch(`${API_BASE_URL}/api/participants`);
  if (!res.ok) {
    throw new Error("Failed to fetch participants");
  }
  return res.json();
}

export async function registerParticipant(payload) {
  const res = await fetch(`${API_BASE_URL}/api/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  if (!res.ok) {
    const error = new Error(data.message || "Registration failed");
    error.details = data.errors || null;
    throw error;
  }
  return data;
}


