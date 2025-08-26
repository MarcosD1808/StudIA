import { API_URL } from "../config";




export async function createUser({ name, email, password }) {
  const res = await fetch(`${API_URL}/api/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  const json = await res.json();
  if (!res.ok || json?.ok === false) {
    throw new Error(json?.error?.message || "Error creando usuario");
  }
  return json.data; // { id, email, name }
}