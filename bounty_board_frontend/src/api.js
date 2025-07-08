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

// PUBLIC_INTERFACE
/**
 * Claim a bounty by bountyId.
 * @param {string|number} bountyId
 * @returns {Promise<Object>} Result payload or throws error.
 */
export async function claimBounty(bountyId) {
  const res = await fetch(`${API_BASE}/bounties/${bountyId}/claim`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    let err = "Could not claim bounty";
    try {
      const resp = await res.json();
      if (resp && resp.error) err = resp.error;
    } catch (e) { /* ignore */ }
    throw new Error(err);
  }
  return res.json();
}

/**
 * PUBLIC_INTERFACE
 * Create a new bounty.
 * @param {{title: string, repo_link: string, description: string, amount: number}} data
 * @returns {Promise<Object>} - The created bounty object or throws error.
 */
export async function createBounty(data) {
  const res = await fetch(`${API_BASE}/bounties`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    let err = "Could not create bounty";
    try {
      const resp = await res.json();
      if (resp && resp.error) err = resp.error;
    } catch (e) { /* ignore */ }
    throw new Error(err);
  }
  return res.json();
}

// PUBLIC_INTERFACE
/**
 * Mark a bounty as complete (done) by bountyId.
 * @param {string|number} bountyId
 * @returns {Promise<Object>} Result payload or throws error.
 */
export async function completeBounty(bountyId) {
  const res = await fetch(`${API_BASE}/bounties/${bountyId}/complete`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    let err = "Could not complete bounty";
    try {
      const resp = await res.json();
      if (resp && resp.error) err = resp.error;
    } catch (e) { /* ignore */ }
    throw new Error(err);
  }
  return res.json();
}

// Placeholder for token/session logic (could adapt to cookie/jwt scheme)
export function logout() {
  // just a stub, session logic would be more involved
  localStorage.clear();
}

