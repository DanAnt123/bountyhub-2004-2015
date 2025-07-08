import React, { useState } from "react";

// PUBLIC_INTERFACE
/**
 * PostBounty - UI for posting a new bounty task (stub, no API yet wired).
 */
function PostBounty() {
  const [title, setTitle] = useState("");
  const [repo_link, setRepoLink] = useState("");
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Stubbing out the submission logic for now.

  function handleSubmit(e) {
    e.preventDefault();
    setIsSaving(true);
    // TODO: Integrate with backend API for creating a bounty post
    setTimeout(() => {
      setIsSaving(false);
      window.alert("Bounty submitted (not implemented).");
    }, 850);
  }

  return (
    <div
      style={{
        maxWidth: 380,
        margin: "50px auto",
        background: "var(--bg-secondary)",
        borderRadius: 18,
        boxShadow: "0 2px 12px #eee",
        padding: 32,
        textAlign: "left",
      }}
    >
      <h2 style={{color:'#3e4247'}}>Post a New Bounty</h2>
      <form onSubmit={handleSubmit}>
        <div style={{marginTop:18}} />
        <label>Title</label>
        <input
          required
          style={inputStyle}
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <label>GitHub Repo Link</label>
        <input
          required
          type="url"
          style={inputStyle}
          value={repo_link}
          onChange={e => setRepoLink(e.target.value)}
        />
        <label>Description</label>
        <textarea
          required
          style={{...inputStyle, minHeight:70}}
          value={desc}
          onChange={e => setDesc(e.target.value)}
        />
        <label>Amount (USD)</label>
        <input
          required
          type="number"
          min={1}
          style={inputStyle}
          value={amount}
          onChange={e => setAmount(e.target.value)}
        />
        <button
          disabled={isSaving}
          style={{
            ...inputStyle,
            background: "#fbc02d",
            color: "#3e4247",
            border: "none",
            fontWeight: "bold",
            cursor: "pointer",
            marginTop: 15,
          }}
          type="submit"
        >
          {isSaving ? "Posting..." : "Post Bounty"}
        </button>
      </form>
    </div>
  );
}

const inputStyle = {
  display: "block",
  width: "100%",
  margin: "7px 0 12px 0",
  padding: 10,
  borderRadius: 7,
  border: "1px solid var(--border-color)",
  fontSize: 16,
  background: "white",
};

export default PostBounty;

