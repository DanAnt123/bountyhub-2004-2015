import React from "react";

// PUBLIC_INTERFACE
/**
 * Dashboard - stub shell, to show personalized info.
 */
function Dashboard() {
  return (
    <div style={{maxWidth:740,margin:"50px auto",padding:30, background:"var(--bg-secondary)",borderRadius:16,boxShadow:"0 2px 14px #eee"}}>
      <h2 style={{color:"#3e4247"}}>User Dashboard</h2>
      <p>Welcome! This will show your posted and claimed bounties, earnings, etc.</p>
    </div>
  );
}

export default Dashboard;

