import React, { useEffect, useState } from "react";
import { fetchBounties } from "../api";
import MarkAsCompletedButton from "../components/MarkAsCompletedButton";

// PUBLIC_INTERFACE
/**
 * Dashboard - shows user's claimed and completed bounties, and all related dashboard info.
 */
function Dashboard() {
  const [claimed, setClaimed] = useState([]);
  const [done, setDone] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState("");
  const [claimedMessage, setClaimedMessage] = useState("");
  const [completedMessage, setCompletedMessage] = useState("");
  const [allMine, setAllMine] = useState([]); // all bounties this user is involved in

  // Get current user id or info (placeholder; replace with real logic when available)
  // For now, we assume "claimed" or "done" are "mine".

  useEffect(() => {
    setLoading(true);
    setDashboardError("");
    fetchBounties()
      .then((data) => {
        if (Array.isArray(data)) {
          // Simulate user view by status. In a real app, filter by userId (e.g., b.claimedBy === myUserId)
          const claimedMine = data.filter((b) => b.status === "claimed");
          const doneMine = data.filter((b) => b.status === "done" || b.status === "completed");
          setClaimed(claimedMine);
          setDone(doneMine);
          setAllMine([...claimedMine, ...doneMine]);
        }
      })
      .catch(() => {
        setDashboardError("Failed to load dashboard data.");
        setClaimed([]);
        setDone([]);
        setAllMine([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // Called after a bounty is marked as completed
  function handleCompletedRefresh(bountyId) {
    const movedBounty = claimed.find((b) => b.id === bountyId);
    setClaimed((prev) => prev.filter((b) => b.id !== bountyId));
    setDone((prev) =>
      movedBounty ? [{ ...movedBounty, status: "done" }, ...prev] : prev
    );
    setClaimedMessage("");
    setCompletedMessage("Bounty marked as completed!");
  }

  // Optionally, could add a section for "total earned"/"stats"
  function renderStats() {
    return (
      <div
        style={{
          background: "white",
          color: "#444",
          borderRadius: 10,
          boxShadow: "0 2px 10px #ececec",
          padding: "18px 18px 12px 18px",
          margin: "6px 0 36px 0",
          maxWidth: 380,
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 4 }}>Summary</div>
        <div style={{ fontSize: 16, marginBottom: 2 }}>
          Claimed: <span style={{ fontWeight: 600 }}>{claimed.length}</span>
        </div>
        <div style={{ fontSize: 16, marginBottom: 2 }}>
          Completed: <span style={{ fontWeight: 600 }}>{done.length}</span>
        </div>
        {/* Optionally, display sum of bounty amounts */}
        <div style={{ fontSize: 16 }}>
          Total Bounties (Your Activity): <span style={{ fontWeight: 600 }}>{allMine.length}</span>
        </div>
      </div>
    );
  }

  function renderClaimedSection() {
    return (
      <>
        <div style={{ margin: "16px 0 10px", fontWeight: 600, fontSize: 17 }}>
          Claimed Bounties
        </div>
        {claimedMessage && (
          <div
            style={{
              minHeight: 20,
              color: "#1aad3f",
              fontWeight: 600,
              fontSize: 14,
              marginBottom: 8,
            }}
            aria-live="polite"
          >
            {claimedMessage}
          </div>
        )}
        {claimed.length === 0 ? (
          <div style={{ color: "#888" }}>No claimed bounties yet.</div>
        ) : (
          claimed.map((b) => (
            <div
              key={b.id}
              style={{
                background: "white",
                color: "#444",
                borderRadius: 7,
                boxShadow: "0 2px 8px #eee",
                marginBottom: 18,
                padding: "15px 16px",
              }}
            >
              <div style={{ fontWeight: 600 }}>{b.title}</div>
              <div style={{ fontSize: 14 }}>{b.description}</div>
              <div style={{ fontSize: 13, color: "#8e4343", margin: "4px 0" }}>
                {b.repo_link && (
                  <a
                    href={b.repo_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#8e4343" }}
                  >
                    {b.repo_link}
                  </a>
                )}
              </div>
              <div style={{ marginRight: 6 }}>
                <MarkAsCompletedButton
                  bountyId={b.id}
                  currentStatus={b.status}
                  onComplete={() => handleCompletedRefresh(b.id)}
                />
              </div>
            </div>
          ))
        )}
      </>
    );
  }

  function renderCompletedSection() {
    return (
      <>
        <div style={{ margin: "32px 0 10px", fontWeight: 600, fontSize: 17 }}>
          Completed Bounties
        </div>
        {completedMessage && (
          <div
            style={{
              minHeight: 20,
              color: "#1aad3f",
              fontWeight: 600,
              fontSize: 14,
              marginBottom: 8,
            }}
            aria-live="polite"
          >
            {completedMessage}
          </div>
        )}
        {done.length === 0 ? (
          <div style={{ color: "#888" }}>No completed bounties yet.</div>
        ) : (
          done.map((b) => (
            <div
              key={b.id}
              style={{
                background: "white",
                color: "#444",
                borderRadius: 7,
                boxShadow: "0 2px 8px #eee",
                marginBottom: 18,
                padding: "15px 16px",
              }}
            >
              <div style={{ fontWeight: 600 }}>{b.title}</div>
              <div style={{ fontSize: 14 }}>{b.description}</div>
              <div style={{ fontSize: 13, color: "#8e4343", margin: "4px 0" }}>
                {b.repo_link && (
                  <a
                    href={b.repo_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#8e4343" }}
                  >
                    {b.repo_link}
                  </a>
                )}
              </div>
              <div
                style={{
                  marginTop: 8,
                  color: "#1aad3f",
                  fontWeight: 600,
                  fontStyle: "italic",
                  fontSize: 15,
                }}
                aria-label="Completed"
              >
                ✅ Completed
              </div>
            </div>
          ))
        )}
      </>
    );
  }

  return (
    <div
      style={{
        maxWidth: 740,
        margin: "50px auto",
        padding: 30,
        background: "var(--bg-secondary)",
        borderRadius: 16,
        boxShadow: "0 2px 14px #eee",
      }}
    >
      <h2 style={{ color: "#3e4247", marginBottom: 6 }}>User Dashboard</h2>
      <p style={{ fontSize: 16, marginBottom: "27px" }}>
        Welcome to your bounty dashboard. Here you can see everything you&apos;ve claimed &amp; completed.
      </p>
      {dashboardError && (
        <div style={{ color: "indianred", minHeight: 24 }}>{dashboardError}</div>
      )}
      {loading ? (
        <div>Loading…</div>
      ) : (
        <>
          {renderStats()}
          {renderClaimedSection()}
          {renderCompletedSection()}
        </>
      )}
    </div>
  );
}

export default Dashboard;

