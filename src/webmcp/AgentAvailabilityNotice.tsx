"use client";

import { useEffect, useState } from "react";
import {
  WEBMCP_AVAILABILITY_EVENT,
  type AgentAvailabilityNotice as AgentAvailabilityNoticeData,
} from "@/webmcp/events";

function formatTHB(value: number | null) {
  if (value === null) return "Price unavailable";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function AgentAvailabilityNotice() {
  const [result, setResult] = useState<AgentAvailabilityNoticeData | null>(null);

  useEffect(() => {
    function handleAvailability(event: Event) {
      const customEvent = event as CustomEvent<AgentAvailabilityNoticeData>;
      setResult(customEvent.detail);
    }

    window.addEventListener(WEBMCP_AVAILABILITY_EVENT, handleAvailability);
    return () => window.removeEventListener(WEBMCP_AVAILABILITY_EVENT, handleAvailability);
  }, []);

  if (!result) return null;

  return (
    <aside className="webmcp-availability-notice" aria-live="polite">
      <button
        className="webmcp-availability-close"
        type="button"
        aria-label="Close availability result"
        onClick={() => setResult(null)}
      >
        ×
      </button>
      <p className="webmcp-availability-eyebrow">Agent checked live availability</p>
      <h2>{result.checkIn} → {result.checkOut}</h2>
      <p>{result.nights} nights · ages {result.guestAges.join(", ")}</p>

      {result.options.length ? (
        <div className="webmcp-availability-options">
          {result.options.slice(0, 4).map((option) => (
            <div className="webmcp-availability-option" key={option.roomType}>
              <strong>{option.name}</strong>
              <span>{formatTHB(option.totalThb)}</span>
            </div>
          ))}
        </div>
      ) : (
        <p>No exact matches for those dates and guests.</p>
      )}

      <a className="button webmcp-availability-link" href="/#availability">
        View booking search
      </a>
    </aside>
  );
}
