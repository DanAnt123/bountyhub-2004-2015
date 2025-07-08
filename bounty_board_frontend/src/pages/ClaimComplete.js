import React, { useEffect, useState } from "react";
import { fetchBounties } from "../api";
import MarkAsCompletedButton from "../components/MarkAsCompletedButton";

// PUBLIC_INTERFACE
/**
 * ClaimCompletePage - shows user's claimed bounties and allows mark as complete.
 */
function ClaimComplete() {
  const [loading, setLoading] = useState(true);
  const [bounties, setBounties] = useState([]);
  const [error, setError] = useState("");

  // Load only claimed bounties for the user.
  useEffect(() => {
    setLoading(true);
    fetchBounties()
      .then((data) => {
        if (Array.isArray(data)) {
          // Only show claimed by user (assume backend returns claimedBy/currentUser flag, fallback to claimed for demo)
          const myClaimed = data.filter(
            (b) =>
              b.status === "claimed" &&
              // For now, assume there's no user field so show all claimed, or later use: b.claimedBy === myUserId
              true
          );
          setBounties(myClaimed);
        }
      })
      .catch(() => setError("Could not load claimed bounties"))
      .finally(() => setLoading(false));
  }, []);

  function handleCompletedRefresh(bountyId) {
    setBounties((prev) =>
      prev.map((b) =>
        b.id === bountyId ? { ...b, status: "done" } : b
      )
    );
  }

  return (
    <div style={{maxWidth:600,margin:"60px auto",padding:28,background:"var(--bg-secondary)",borderRadius:13,boxShadow:"0 2px 10px #f1f1f1"}}>
      <h2 style={{color:"#3e4247"}}>Mark Claimed Bounty as Complete</h2>
      <p>Finish your claimed work? Mark it as completed below:</p>
      {loading ? (
        <div>Loading…</div>
      ) : error ? (
        <div style={{ color: "indianred" }}>{error}</div>
      ) : bounties.length === 0 ? (
        <div style={{ color: "#888", marginTop: 32 }}>
          You have not claimed any bounties yet.
        </div>
      ) : (
        <div>
          {bounties.map((b) => (
            <div key={b.id} style={{
              background: "white",
              color: "#444",
              borderRadius: 9,
              boxShadow: "0 2px 8px #eee",
              marginBottom: 22,
              padding: "20px 22px 14px 22px"
            }}>
              <div style={{fontWeight:600, fontSize:18, color:"var(--text-primary)"}}>{b.title}</div>
              <div style={{fontSize:15, color:"#8e4343", margin:"3px 0"}}>
                {b.repo_link &&
                  <a href={b.repo_link} rel="noreferrer" target="_blank"
                    style={{color:"#8e4343"}}
                  >{b.repo_link}</a>}
              </div>
              <div style={{color:"#555"}}>{b.description}</div>
              <MarkAsCompletedButton
                bountyId={b.id}
                currentStatus={b.status}
                onComplete={() => handleCompletedRefresh(b.id)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ClaimComplete;

