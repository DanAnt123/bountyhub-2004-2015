import React, { useEffect, useState } from "react";
import { fetchBounties, claimBounty } from "../api";

// PUBLIC_INTERFACE
/**
 * Displays a full list of bounties fetched from backend, with modern cards.
 * Allows logged-in user to claim open bounties.
 */
function BountyList() {
  const [bounties, setBounties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  // Visual feedback per bounty (success/error/loading)
  const [actionStatus, setActionStatus] = useState({}); // { [bountyId]: "loading"|"success"|"error"|"already_claimed"|"" }
  const [message, setMessage] = useState(""); // Global message, e.g. claim errors

  // Basic auth state via localStorage
  const isLoggedIn = !!window.localStorage.getItem("bounty_is_loggedin");

  useEffect(() => {
    fetchBounties()
      .then(data => setBounties(Array.isArray(data) ? data : []))
      .catch(() => setErr("Could not load bounties"))
      .finally(() => setLoading(false));
  }, []);

  // PUBLIC_INTERFACE
  /** Attempt to claim a bounty, update UI on success/error. */
  async function handleClaim(bountyId) {
    setActionStatus((prev) => ({ ...prev, [bountyId]: "loading" }));
    setMessage("");
    try {
      await claimBounty(bountyId);
      // Optimistically update bounty status in UI
      setBounties((prev) =>
        prev.map((b) =>
          b.id === bountyId
            ? { ...b, status: "claimed" }
            : b
        )
      );
      setActionStatus((prev) => ({ ...prev, [bountyId]: "success" }));
      setMessage("Bounty successfully claimed!");
    } catch (error) {
      let msg = error?.message || "Error claiming bounty";
      setActionStatus((prev) => ({ ...prev, [bountyId]: "error" }));
      setMessage(msg);
    }
  }

  if (loading) return <div style={{marginTop:40}}>Loading bounties…</div>;
  if (err) return <div style={{color:"crimson", marginTop:40}}>{err}</div>;

  return (
    <div style={{ maxWidth: 900, margin: "32px auto" }}>
      <h2 style={{ color: "#3e4247" }}>Available Bounties</h2>
      {message && (
        <div
          style={{
            color: message.includes("success") ? "green" : "indianred",
            fontWeight: 600,
            marginBottom: 14,
            marginTop: 8,
            minHeight: 24,
          }}
          role={message.includes("success") ? "status" : "alert"}
        >
          {message}
        </div>
      )}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
        {bounties.map((bounty) => (
          <div
            key={bounty.id}
            style={{
              flex: "1 1 310px",
              minWidth: 280,
              background: "var(--bg-secondary)",
              borderRadius: 14,
              boxShadow: "0 2px 14px #eee",
              padding: 24,
              marginBottom: 12,
              textAlign: "left",
              opacity: bounty.status === "claimed" ? 0.85 : 1,
              outline: (actionStatus[bounty.id] === "success") ? "2px solid #1aad3f" : undefined,
              transition: "opacity .2s, outline .3s",
            }}
          >
            <h4 style={{ margin: 0 }}>{bounty.title}</h4>
            <div style={{ fontSize: 15, color: "#8e4343", margin: "6px 0 10px 0" }}>
              {bounty.repo_link ? (
                <a
                  href={bounty.repo_link}
                  style={{ color: "#8e4343", textDecoration: "underline" }}
                  target="_blank"
                  rel="noreferrer"
                >
                  {bounty.repo_link}
                </a>
              ) : (
                <span>No repo listed</span>
              )}
            </div>
            <div style={{ color: "#555", minHeight: 36 }}>
              {bounty.description}
            </div>
            <div
              style={{
                marginTop: 8,
                color: "#fbc02d",
                fontWeight: "bold",
                fontSize: 18,
              }}
            >
              ${bounty.amount}
            </div>
            {/* Claim button and status logic */}
            {bounty.status === "open" && isLoggedIn && (
              <button
                style={{
                  marginTop: 12,
                  background: "#fbc02d",
                  color: "#3e4247",
                  fontWeight: 700,
                  border: "none",
                  borderRadius: 7,
                  padding: "8px 18px",
                  cursor: actionStatus[bounty.id] === "loading" ? "wait" : "pointer",
                  opacity: actionStatus[bounty.id] === "loading" ? 0.6 : 1,
                  boxShadow: actionStatus[bounty.id] === "success" ? "0 0 0 2px #1aad3f inset" : undefined,
                  transition: "all .2s",
                }}
                onClick={() => handleClaim(bounty.id)}
                disabled={actionStatus[bounty.id] === "loading"}
                aria-disabled={actionStatus[bounty.id] === "loading"}
              >
                {actionStatus[bounty.id] === "loading"
                  ? "Claiming…"
                  : (actionStatus[bounty.id] === "success"
                      ? "Claimed!"
                      : "Claim"
                    )
                }
              </button>
            )}
            {bounty.status === "open" && !isLoggedIn && (
              <span
                style={{
                  marginTop: 14,
                  color: "#8e4343",
                  fontWeight: 500,
                  fontSize: 15,
                  display: "inline-block",
                }}
              >
                Login to claim
              </span>
            )}
            {bounty.status !== "open" && (
              <span
                style={{
                  marginTop: 16,
                  fontWeight: 600,
                  color: "#8e4343",
                  fontStyle: "italic",
                  display: "inline-block",
                }}
              >
                {bounty.status === "claimed" ? "Claimed" : bounty.status}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default BountyList;

