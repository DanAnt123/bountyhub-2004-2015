import React, { useState } from "react";
import { completeBounty } from "../api";

/**
 * Button + feedback UI to mark a claimed bounty as complete.
 * Calls backend API, handles UI states.
 * @param {{
 *   bountyId: string|number,
 *   currentStatus: string,
 *   onComplete: function,
 *   style?: object,
 *   disabled?: boolean
 * }} props
 */
function MarkAsCompletedButton({ bountyId, currentStatus, onComplete, style, disabled }) {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [done, setDone] = useState(currentStatus === "done" || currentStatus === "completed");

  async function handleComplete() {
    if (loading || done) return;
    setLoading(true);
    setFeedback("");
    try {
      await completeBounty(bountyId);
      setDone(true);
      setFeedback("Marked as completed!");
      if (onComplete) onComplete();
    } catch (e) {
      setFeedback(e && e.message ? e.message : "Failed to mark as complete");
    }
    setLoading(false);
  }

  if (done) {
    return (
      <div style={{ marginTop: 10, color: "#1aad3f", fontWeight: 600 }} aria-live="polite" role="status">
        ✅ Completed
      </div>
    );
  }

  return (
    <div style={{ marginTop: 10 }}>
      <button
        type="button"
        style={{
          background: "#1aad3f",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          padding: "8px 18px",
          fontWeight: 700,
          cursor: loading || disabled ? "wait" : "pointer",
          opacity: loading || disabled ? 0.7 : 1,
          boxShadow: loading ? "0 0 0 2px #1aad3f44 inset" : undefined,
          transition: "all .2s",
          marginBottom: 2,
          ...style,
        }}
        disabled={loading || disabled}
        aria-disabled={loading || disabled}
        onClick={handleComplete}
      >
        {loading ? "Marking..." : "Mark as Complete"}
      </button>
      {feedback && (
        <div
          style={{
            fontSize: 14,
            marginTop: 4,
            color: feedback.includes("complete") ? "#1aad3f" : "indianred",
            transition: "color .2s"
          }}
          aria-live="polite"
        >
          {feedback}
        </div>
      )}
    </div>
  );
}

export default MarkAsCompletedButton;
