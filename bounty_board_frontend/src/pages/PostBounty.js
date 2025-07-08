import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBounty } from "../api";

// PUBLIC_INTERFACE
/**
 * PostBounty - Fully functional form for posting a new bounty task.
 * Handles state, inline validation, error/success feedback, triggers bounty refresh.
 */
function PostBounty() {
  const [fields, setFields] = useState({
    title: "",
    repo_link: "",
    description: "",
    amount: "",
  });
  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState("");
  const [status, setStatus] = useState(""); // "success"|"error"|"" for UI feedback
  const [isSaving, setIsSaving] = useState(false);
  const nav = useNavigate();

  // Validate form before submit (client side)
  function validate(f) {
    let e = {};
    if (!f.title.trim()) e.title = "Title is required";
    if (!f.repo_link.trim()) e.repo_link = "Repository link is required";
    else if (!/^https:\/\/(github\.com|www\.github\.com)\/.+/.test(f.repo_link.trim()))
      e.repo_link = "Must be a valid GitHub repo URL";
    if (!f.description.trim()) e.description = "Description is required";
    if (!f.amount || isNaN(Number(f.amount)) || Number(f.amount) < 1)
      e.amount = "Amount must be at least $1";
    return e;
  }

  // Handle field changes
  function handleField(field, value) {
    setFields(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
    setStatus("");
    setFeedback("");
  }

  // PUBLIC_INTERFACE
  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("");
    setFeedback("");
    // Validate
    const fieldErrors = validate(fields);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;

    setIsSaving(true);
    try {
      await createBounty({
        title: fields.title,
        repo_link: fields.repo_link,
        description: fields.description,
        amount: Number(fields.amount),
      });
      setStatus("success");
      setFeedback("Bounty posted successfully!");
      setFields({ title: "", repo_link: "", description: "", amount: "" });

      // Optionally: brief delay, then navigate to /bounties
      setTimeout(() => {
        nav("/bounties", { replace: true });
      }, 1200);

    } catch (err) {
      setStatus("error");
      setFeedback(
        err && err.message
          ? "Failed to create bounty: " + err.message
          : "Failed to create bounty. Please try again."
      );
    }
    setIsSaving(false);
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
      <h2 style={{ color: "#3e4247" }}>Post a New Bounty</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div style={{ marginTop: 18 }} />
        <label>Title</label>
        <input
          required
          style={inputStyle}
          value={fields.title}
          onChange={e => handleField("title", e.target.value)}
          disabled={isSaving}
        />
        {errors.title && (
          <div style={errorStyle}>{errors.title}</div>
        )}

        <label>GitHub Repo Link</label>
        <input
          required
          type="url"
          style={inputStyle}
          value={fields.repo_link}
          onChange={e => handleField("repo_link", e.target.value)}
          disabled={isSaving}
          placeholder="https://github.com/your/repo"
        />
        {errors.repo_link && (
          <div style={errorStyle}>{errors.repo_link}</div>
        )}

        <label>Description</label>
        <textarea
          required
          style={{ ...inputStyle, minHeight: 70 }}
          value={fields.description}
          onChange={e => handleField("description", e.target.value)}
          disabled={isSaving}
        />
        {errors.description && (
          <div style={errorStyle}>{errors.description}</div>
        )}

        <label>Amount (USD)</label>
        <input
          required
          type="number"
          min={1}
          style={inputStyle}
          value={fields.amount}
          onChange={e => handleField("amount", e.target.value)}
          disabled={isSaving}
          step="any"
        />
        {errors.amount && (
          <div style={errorStyle}>{errors.amount}</div>
        )}

        <button
          disabled={isSaving}
          style={{
            ...inputStyle,
            background: "#fbc02d",
            color: "#3e4247",
            border: "none",
            fontWeight: "bold",
            cursor: isSaving ? "wait" : "pointer",
            marginTop: 15,
            opacity: isSaving ? 0.6 : 1,
          }}
          type="submit"
        >
          {isSaving ? "Posting..." : "Post Bounty"}
        </button>

        {feedback && (
          <div
            style={{
              color: status === "success" ? "green" : "indianred",
              fontWeight: 600,
              marginTop: 14,
              minHeight: 24,
              transition: "color .3s"
            }}
            role={status === "success" ? "status" : "alert"}
          >
            {feedback}
          </div>
        )}
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

const errorStyle = {
  color: "indianred",
  margin: "3px 0 10px 0",
  fontSize: 14,
  fontWeight: 500,
};

export default PostBounty;

