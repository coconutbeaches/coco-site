"use client";

import { useEffect, useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

type WhatsAppHandoffProps = {
  url: string;
  label?: string;
  summary?: string;
};

function isMobileLikeDevice() {
  if (typeof window === "undefined") return false;
  const coarsePointer = window.matchMedia?.("(pointer: coarse)").matches ?? false;
  const mobileUserAgent = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
  return coarsePointer || mobileUserAgent;
}

function makeWhatsAppWebUrl(url: string) {
  try {
    const parsed = new URL(url);
    const phone = parsed.pathname.replace(/^\//, "");
    const text = parsed.searchParams.get("text") ?? "";
    return `https://web.whatsapp.com/send?phone=${encodeURIComponent(phone)}&text=${encodeURIComponent(text)}`;
  } catch {
    return url;
  }
}

export default function WhatsAppHandoff({
  url,
  label = "Continue on WhatsApp",
  summary,
}: WhatsAppHandoffProps) {
  const [open, setOpen] = useState(false);
  const webUrl = useMemo(() => makeWhatsAppWebUrl(url), [url]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  function handleClick() {
    if (isMobileLikeDevice()) {
      window.location.href = url;
      return;
    }

    setOpen(true);
  }

  return (
    <>
      <button className="button room-action whatsapp-handoff-trigger" type="button" onClick={handleClick}>
        {label}
      </button>

      {open && (
        <div className="whatsapp-modal-backdrop" role="presentation" onMouseDown={() => setOpen(false)}>
          <section
            className="whatsapp-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="whatsapp-modal-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              className="whatsapp-modal-close"
              type="button"
              aria-label="Close WhatsApp QR code"
              onClick={() => setOpen(false)}
            >
              ×
            </button>

            <div className="whatsapp-modal-copy">
              <p className="eyebrow">Continue on your phone</p>
              <h3 id="whatsapp-modal-title">Scan to open WhatsApp</h3>
              <p>Scan this QR code with your phone. Your room, dates, guest count and quoted total are already included.</p>
              {summary && <p className="whatsapp-modal-summary">{summary}</p>}
            </div>

            <div className="whatsapp-qr-shell" aria-label="WhatsApp booking QR code">
              <QRCodeSVG
                value={url}
                size={220}
                level="M"
                marginSize={2}
                bgColor="#fffdf8"
                fgColor="#17322b"
              />
            </div>

            <a className="button whatsapp-web-button" href={webUrl} target="_blank" rel="noreferrer">
              Open WhatsApp Web
            </a>
          </section>
        </div>
      )}
    </>
  );
}
