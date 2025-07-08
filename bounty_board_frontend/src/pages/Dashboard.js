import React, { useEffect, useState } from "react";
import { fetchBounties } from "../api";
import MarkAsCompletedButton from "../components/MarkAsCompletedButton";

// PUBLIC_INTERFACE
/**
 * Dashboard - shows user's claimed and completed bounties.
 */
function Dashboard() {
  const [claimed, setClaimed] = useState([]);
  const [done, setDone] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchBounties()
      .then((data) => {
        if (Array.isArray(data)) {
          // For demo/userless: b.status === "claimed" or "done"
          setClaimed(data.filter((b) => b.status === "claimed"));
          setDone(data.filter((b) => b.status === "done" || b.status === "completed"));
        }
      })
      .catch(() => {
        setClaimed([]);
        setDone([]);
      })
      .finally(() => setLoading(false));
  }, []);

  function handleCompletedRefresh(bountyId) {
    setClaimed((prev) => prev.filter((b) => b.id !== bountyId));
    setDone((prev) => [...prev, { ...claimed.find((b) => b.id === bountyId), status: "done" }]);
  }

  return (
    <div style={{maxWidth:740,margin:"50px auto",padding:30, background:"var(--bg-secondary)",borderRadius:16,boxShadow:"0 2px 14px #eee"}}>
      <h2 style={{color:"#3e4247"}}>User Dashboard</h2>
      <p>Your activity at a glance.</p>

      {loading ? (
        <div>Loading…</div>
      ) : (
        <>
          <div style={{margin:"26px 0 15px",fontWeight:600,fontSize:17}}>
            Claimed Bounties
          </div>
          {claimed.length === 0 ? (
            <div style={{ color: "#888" }}>No claimed bounties.</div>
          ) : (
            claimed.map((b) => (
              <div key={b.id}
                style={{
                  background: "white",
                  color: "#444",
                  borderRadius: 7,
                  boxShadow: "0 2px 8px #eee",
                  marginBottom: 18,
                  padding: "15px 16px"
                }}>
                <div style={{fontWeight:600}}>{b.title}</div>
                <div style={{ fontSize:14, marginBottom:6}}>{b.description}</div>
                <MarkAsCompletedButton
                  bountyId={b.id}
                  currentStatus={b.status}
                  onComplete={() => handleCompletedRefresh(b.id)}
                />
              </div>
            ))
          )}
          <div style={{margin:"36px 0 15px",fontWeight:600,fontSize:17}}>
            Completed Bounties
          </div>
          {done.length === 0 ? (
            <div style={{ color: "#888" }}>No completed bounties.</div>
          ) : (
            done.map(b => (
              <div key={b.id}
                style={{
                  background: "white",
                  color: "#444",
                  borderRadius: 7,
                  boxShadow: "0 2px 8px #eee",
                  marginBottom: 18,
                  padding: "15px 16px"
                }}>
                <div style={{fontWeight:600}}>{b.title}</div>
                <div style={{ fontSize:14, marginBottom:6}}>{b.description}</div>
                <div style={{ marginTop: 8, color: "#1aad3f", fontWeight: 600 }}>✅ Completed</div>
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
}

export default Dashboard;

