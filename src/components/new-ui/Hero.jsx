import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./landing.css";

const MOBILE_IMAGES = [
  "/images/landing/mobile_landing1.png",
  "/images/landing/mobile_landing3.png",
  "/images/landing/mobile_landing5.png",
];

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

export default function Hero() {
  const videoRef = useRef(null);
  const isMobile = useIsMobile();
  const [slideIndex, setSlideIndex] = useState(0);
  const [textStage, setTextStage] = useState(0);

  // Desktop: autoplay video
  useEffect(() => {
    if (!isMobile && videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay policy fallback: poster image stays visible
      });
    }
  }, [isMobile]);

  // Preload all 3 mobile curtain images
  useEffect(() => {
    if (!isMobile) return;
    MOBILE_IMAGES.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [isMobile]);

  // Mobile: coordinated sequence with staged text animation and curtain opening
  useEffect(() => {
    if (!isMobile) return;

    let timers = [];

    const runSequence = () => {
      // 0.0s: Start with closed curtains (frame 0) and initial text state
      setSlideIndex(0);
      setTextStage(0);

      // 0.35s: Headline fades/slides in
      timers.push(setTimeout(() => setTextStage(1), 350));

      // 1.05s: Sprinkles radiate on 'n' of billion
      timers.push(setTimeout(() => setTextStage(2), 1050));

      // 1.75s: Bang / Thud zoom-in for (Beat that, rest of the internet!)
      timers.push(setTimeout(() => setTextStage(3), 1750));

      // 4.2s: Fade out text overlay
      timers.push(setTimeout(() => setTextStage(4), 4200));

      // 4.65s: Curtains opening / spotlight peek (Frame 1 -> mobile_landing3)
      timers.push(setTimeout(() => setSlideIndex(1), 4650));

      // 5.5s: Grand reveal with glowing marquee & cheering crowd (Frame 2 -> mobile_landing5)
      timers.push(setTimeout(() => setSlideIndex(2), 5500));

      // No loop: Sequence plays once and stays on the final celebration frame
    };

    runSequence();

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [isMobile]);

  return (
    <section className="nui-hero" id="home" style={{ backgroundColor: "#180504" }}>
      {/* Desktop: Background Video */}
      {!isMobile && (
        <video
          ref={videoRef}
          className="nui-hero-video"
          autoPlay
          muted
          playsInline
          webkit-playsinline="true"
          preload="auto"
          disablePictureInPicture
          controlsList="nodownload nofullscreen noremoteplayback"
          style={{ pointerEvents: "none", backgroundColor: "#180504" }}
        >
          <source src="/videos/landing-page.mp4" type="video/mp4" />
        </video>
      )}

      {/* Mobile: Direct animation with staged theater curtain text */}
      {isMobile && (
        <div className="nui-hero-mobile-slideshow">
          {MOBILE_IMAGES.map((src, index) => (
            <img
              key={src}
              src={src}
              alt="Fruit Shop on Greams Road"
              className={`nui-hero-mobile-slide ${index === slideIndex ? "active" : ""}`}
              draggable={false}
              loading="eager"
            />
          ))}

          {/* Staged mobile curtain text overlay (active during slideIndex === 0) */}
          <AnimatePresence>
            {slideIndex === 0 && textStage >= 1 && textStage < 4 && (
              <motion.div
                className="nui-hero-mobile-text-wrap"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.38, ease: "easeOut" }}
              >
                <h1 className="nui-hero-mobile-title">
                  There are roughly 1.5{" "}
                  <span className="nui-hero-sprinkles-anchor">
                    billion
                    <AnimatePresence>
                      {textStage >= 2 && (
                        <motion.svg
                          className="nui-hero-sprinkles-svg"
                          viewBox="0 0 26 26"
                          fill="none"
                          initial={{ scale: 0, opacity: 0, rotate: -25 }}
                          animate={{ scale: 1, opacity: 1, rotate: 0 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ type: "spring", stiffness: 450, damping: 14 }}
                        >
                          <path
                            d="M 5 16 C 4 10, 5 5, 8 2"
                            stroke="#FFFFFF"
                            strokeWidth="2.6"
                            strokeLinecap="round"
                          />
                          <path
                            d="M 9 14 C 13 8, 17 5, 21 3"
                            stroke="#FFFFFF"
                            strokeWidth="2.6"
                            strokeLinecap="round"
                          />
                          <path
                            d="M 12 18 C 16 18, 21 16, 25 15"
                            stroke="#FFFFFF"
                            strokeWidth="2.6"
                            strokeLinecap="round"
                          />
                        </motion.svg>
                      )}
                    </AnimatePresence>
                  </span>
                  <br />
                  websites and you’re here.
                </h1>

                <AnimatePresence>
                  {textStage >= 3 && (
                    <motion.p
                      className="nui-hero-mobile-sub"
                      initial={{ scale: 5.2, filter: "blur(12px)", opacity: 0 }}
                      animate={{ scale: 1, filter: "blur(0px)", opacity: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{
                        duration: 0.44,
                        ease: [0.18, 0.89, 0.32, 1.25],
                      }}
                    >
                      (Beat that, rest of the internet!)
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
}
