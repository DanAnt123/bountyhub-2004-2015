//
// API helper for backend communication (auth, bounties)
// PUBLIC_INTERFACE
// All major API calls for authentication and bounties

const API_BASE =
  process.env.REACT_APP_API_BASE ||
  "https://vscode-internal-3932-beta.beta01.cloud.kavia.ai:3001";

// PUBLIC_INTERFACE
/**
 * Attempt user login.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object>} Result payload or error.
 */
export async function login(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json();
}

// PUBLIC_INTERFACE
/**
 * Attempt user registration.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object>} Result payload or error.
 */
export async function register(email, password) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });
  if (!res.ok) throw new Error("Registration failed");
  return res.json();
}

// PUBLIC_INTERFACE
/**
 * Fetch the list of all bounties.
 * @returns {Promise<Array>} Array of bounty objects
 */
export async function fetchBounties() {
  const res = await fetch(`${API_BASE}/bounties`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch bounties");
  return res.json();
}

// Placeholder for token/session logic (could adapt to cookie/jwt scheme)
export function logout() {
  // just a stub, session logic would be more involved
  localStorage.clear();
}

