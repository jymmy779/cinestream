"use client";

import { useEffect, useState } from "react";

export default function InitialLoader() {
  const [show, setShow] = useState(true);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const startTime = Date.now();
    const minimumDisplayTime = 2000; // 2 giây hiển thị tối thiểu

    const startFadeOut = () => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, minimumDisplayTime - elapsed);

      window.setTimeout(() => {
        setFadingOut(true);
        window.setTimeout(() => {
          setShow(false);
          document.body.style.overflow = "unset";
        }, 700);
      }, remaining);
    };

    const handleLoad = () => {
      startFadeOut();
    };

    if (document.readyState === "complete") {
      startFadeOut();
    } else {
      window.addEventListener("load", handleLoad);
    }

    // Dự phòng: tối đa 10s nếu có tài nguyên nào đó bị kẹt
    const safety = window.setTimeout(() => {
      startFadeOut();
    }, 10000);

    return () => {
      window.removeEventListener("load", handleLoad);
      window.clearTimeout(safety);
      document.body.style.overflow = "unset";
    };
  }, []);

  if (!show) return null;

  return (
    <>
      <div 
        className={`cinestream-loader-overlay ${fadingOut ? 'fade-out' : ''}`}
        style={{ position: 'fixed', inset: 0, backgroundColor: '#0F1115', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <div className="cinestream-loader-content">
          <div className="cinestream-loader-text">
            CineStream
          </div>

          <div className="cinestream-loader-bar-container">
            <div className="cinestream-loader-bar-fill"></div>
          </div>
          <div className="vn-copyright">
            Thế giới phim ảnh trong tầm tay
          </div>
        </div>
      </div>
    </>
  );
}
