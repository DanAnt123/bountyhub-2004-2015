import React, { useEffect, useState } from "react";
import { fetchBounties } from "../api";

// PUBLIC_INTERFACE
/**
 * Displays a full list of bounties fetched from backend, with modern cards.
 */
function BountyList() {
  const [bounties, setBounties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    fetchBounties()
      .then(data => setBounties(Array.isArray(data) ? data : []))
      .catch(() => setErr("Could not load bounties"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{marginTop:40}}>Loading bounties…</div>;
  if (err) return <div style={{color:"crimson", marginTop:40}}>{err}</div>;

  return (
    <div style={{ maxWidth: 900, margin: "32px auto" }}>
      <h2 style={{ color: "#3e4247" }}>Available Bounties</h2>
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
            {bounty.status === "open" && (
              <button
                style={{
                  marginTop: 10,
                  background: "#fbc02d",
                  color: "#3e4247",
                  fontWeight: 700,
                  border: "none",
                  borderRadius: 7,
                  padding: "8px 18px",
                  cursor: "pointer",
                }}
                disabled
              >
                Claim (demo)
              </button>
            )}
            {bounty.status !== "open" && (
              <span
                style={{
                  marginTop: 16,
                  fontWeight: 600,
                  color: "#8e4343",
                }}
              >
                {bounty.status}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default BountyList;

