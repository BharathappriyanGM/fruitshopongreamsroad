import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./landing.css";

const ORDER_MOBILE_IMAGE = "/images/landing/order_mobile2.png";

function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth <= breakpoint
  );

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const handler = (e) => setIsMobile(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [breakpoint]);

  return isMobile;
}

export default function Order() {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef(null);
  const isMobile = useIsMobile();

  // Preload mobile image
  useEffect(() => {
    if (!isMobile) return;
    const img = new Image();
    img.src = ORDER_MOBILE_IMAGE;
  }, [isMobile]);

  // Desktop: Play video once when scrolled into view
  useEffect(() => {
    if (isMobile || !videoRef.current) return;
    const video = videoRef.current;
    let played = false;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !played) {
            played = true;
            video.currentTime = 0;
            video.play().catch(() => {});
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [isMobile]);

  return (
    <section className="nui-order" id="order">
      {/* Desktop: Background Video */}
      {!isMobile && (
        <>
          <video
            ref={videoRef}
            className="nui-order-video"
            muted
            playsInline
            preload="auto"
            onLoadedData={() => setVideoLoaded(true)}
            style={{ opacity: videoLoaded ? 1 : 0, transition: "opacity 0.8s ease" }}
          >
            <source src="/videos/order-online.mp4" type="video/mp4" />
          </video>
          <div className="nui-order-overlay" />
        </>
      )}

      {/* Mobile: Cinematic scooter riding continuous motion + staggered announcement */}
      {isMobile && (
        <div className="nui-order-mobile-container">
          <motion.img
            src={ORDER_MOBILE_IMAGE}
            alt="Fruit Shop delivery scooter"
            className="nui-order-mobile-bg"
            draggable={false}
            loading="eager"
            animate={{
              y: [0, -3.5, 0],
            }}
            transition={{
              duration: 3,
              ease: "easeInOut",
              repeat: Infinity,
            }}
          />

          {/* Announcement text overlay with staggered sequential entrance */}
          <div className="nui-order-announcement-wrap">
            {/* 1. Intro Line */}
            <motion.p
              className="nui-order-announcement-intro"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            >
              By the way, our team is working on
            </motion.p>

            {/* 2. Hero Title with Sparkles (pops in with bounce matching order_online.mp4) */}
            <div className="nui-order-announcement-hero">
              <h2 className="nui-order-announcement-title">
                {/* Line 1: 'an online' with springing outward sparkles */}
                <motion.span
                  className="nui-order-title-line-1"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.5, delay: 0.65, type: "spring", stiffness: 320, damping: 20 }}
                >
                  {/* Left Sprinkles (popping outward to the left) */}
                  <motion.svg
                    className="nui-order-sparkle nui-order-sparkle-left"
                    viewBox="0 0 26 26"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: 0.4, delay: 0.85, type: "spring", stiffness: 380, damping: 16 }}
                  >
                    <path
                      d="M 21 16 C 22 10, 21 5, 18 2"
                      stroke="#FFBD00"
                      strokeWidth="2.8"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 17 14 C 13 8, 9 5, 5 3"
                      stroke="#FFBD00"
                      strokeWidth="2.8"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 14 18 C 10 18, 5 16, 1 15"
                      stroke="#FFBD00"
                      strokeWidth="2.8"
                      strokeLinecap="round"
                    />
                  </motion.svg>

                  <span>an online</span>

                  {/* Right Sprinkles (popping outward to the right) */}
                  <motion.svg
                    className="nui-order-sparkle nui-order-sparkle-right"
                    viewBox="0 0 26 26"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: 0.4, delay: 0.85, type: "spring", stiffness: 380, damping: 16 }}
                  >
                    <path
                      d="M 5 16 C 4 10, 5 5, 8 2"
                      stroke="#FFBD00"
                      strokeWidth="2.8"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 9 14 C 13 8, 17 5, 21 3"
                      stroke="#FFBD00"
                      strokeWidth="2.8"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 12 18 C 16 18, 21 16, 25 15"
                      stroke="#FFBD00"
                      strokeWidth="2.8"
                      strokeLinecap="round"
                    />
                  </motion.svg>
                </motion.span>

                {/* Line 2: 'ordering system' drops into place */}
                <motion.span
                  className="nui-order-title-line-2"
                  initial={{ opacity: 0, y: -10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.5, delay: 0.95, ease: [0.22, 1, 0.36, 1] }}
                >
                  ordering system
                </motion.span>
              </h2>
            </div>

            {/* 3. 'for you' connector (fades in at 00:05) */}
            <motion.p
              className="nui-order-announcement-for-you"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, delay: 1.35, ease: "easeOut" }}
            >
              for you
            </motion.p>

            {/* 4. Highlight Ribbon Badge (paints across like brush stroke at 00:06) */}
            <motion.div
              className="nui-order-badge-wrap"
              initial={{ opacity: 0, scaleX: 0 }}
              whileInView={{ opacity: 1, scaleX: 1 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.65, delay: 1.7, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: "left center" }}
            >
              <div className="nui-order-badge-ribbon">
                ‘Stay-at-home’ juice aholics.
              </div>
            </motion.div>

            {/* 5. Subtitle Footer (fades in at 00:08) */}
            <motion.p
              className="nui-order-announcement-footer"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.55, delay: 2.15, ease: "easeOut" }}
            >
              You’ll be the first to know when<br />it’s up and running.
            </motion.p>

            {/* 6. Signature Line (draws smoothly across at 00:09 with stay-at-home yellow) */}
            <div className="nui-order-signature-wrap">
              <motion.div
                className="nui-order-signature-box"
                initial={{ opacity: 0, scaleX: 0 }}
                whileInView={{ opacity: 1, scaleX: 1 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.75, delay: 2.55, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformOrigin: "left center", display: "inline-block" }}
              >
                <svg
                  className="nui-order-signature-svg"
                  viewBox="0 0 260 38"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M 8 28 C 68 4, 192 4, 252 26 C 192 15, 68 15, 8 28 Z"
                    fill="#FFBD00"
                  />
                </svg>
              </motion.div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
