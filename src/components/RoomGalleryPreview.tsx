"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

type RoomGalleryPreviewProps = {
  label: string;
  coverUrl: string;
  images: string[];
};

export default function RoomGalleryPreview({ label, coverUrl, images }: RoomGalleryPreviewProps) {
  const gallery = useMemo(() => Array.from(new Set([coverUrl, ...images].filter(Boolean))), [coverUrl, images]);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => setMounted(true), []);

  function showAt(nextIndex: number) {
    setIndex((nextIndex + gallery.length) % gallery.length);
  }

  function openGallery() {
    const coverIndex = gallery.indexOf(coverUrl);
    setIndex(coverIndex >= 0 ? coverIndex : 0);
    setOpen(true);
  }

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
      if (event.key === "ArrowLeft") showAt(index - 1);
      if (event.key === "ArrowRight") showAt(index + 1);
    }

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, index, gallery.length]);

  const lightbox = open ? (
    <div
      className="room-gallery-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`${label} photo gallery`}
      onClick={() => setOpen(false)}
    >
      <div className="room-gallery-shell" onClick={(event) => event.stopPropagation()}>
        <div className="room-gallery-topbar">
          <div>
            <strong>{label}</strong>
            <span>{index + 1} / {gallery.length}</span>
          </div>
          <button type="button" className="room-gallery-close" onClick={() => setOpen(false)} aria-label="Close gallery">×</button>
        </div>

        <div
          className="room-gallery-stage"
          onTouchStart={(event) => { touchStartX.current = event.touches[0]?.clientX ?? null; }}
          onTouchEnd={(event) => {
            if (touchStartX.current === null) return;
            const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
            const delta = endX - touchStartX.current;
            if (Math.abs(delta) > 45 && gallery.length > 1) showAt(delta > 0 ? index - 1 : index + 1);
            touchStartX.current = null;
          }}
        >
          <img src={gallery[index]} alt={`${label} photo ${index + 1}`} />
          {gallery.length > 1 && (
            <>
              <button type="button" className="room-gallery-nav prev" onClick={() => showAt(index - 1)} aria-label="Previous photo">‹</button>
              <button type="button" className="room-gallery-nav next" onClick={() => showAt(index + 1)} aria-label="Next photo">›</button>
            </>
          )}
        </div>

        {gallery.length > 1 && (
          <div className="room-gallery-thumbs" aria-label="Gallery thumbnails">
            {gallery.map((image, imageIndex) => (
              <button
                type="button"
                key={image}
                className={imageIndex === index ? "active" : ""}
                onClick={() => setIndex(imageIndex)}
                aria-label={`View photo ${imageIndex + 1}`}
                aria-current={imageIndex === index ? "true" : undefined}
              >
                <img src={image} alt="" loading="lazy" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        type="button"
        className="room-gallery-trigger"
        onClick={openGallery}
        aria-label={`Open ${label} photo gallery`}
      >
        <img className="room-result-image" src={coverUrl} alt={`${label} at Coconut Beach`} />
        {gallery.length > 1 && <span className="room-gallery-badge">View {gallery.length} photos</span>}
      </button>
      {mounted && lightbox ? createPortal(lightbox, document.body) : null}
    </>
  );
}
