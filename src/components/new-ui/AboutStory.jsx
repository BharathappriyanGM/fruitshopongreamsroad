import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useInView } from "framer-motion";
import "./landing.css";

const SCENES = [
  {
    id: 0,
    desktopBg: "/images/landing/story_scene0.png",
    mobileBg: "/images/landing/about_mobile0.png",
    type: "scene0",
    title: "We'll keep this short.",
    subtitle: "(like a banana's lifespan\nin a gorilla's hands)",
  },
  {
    id: 1,
    desktopBg: "/images/landing/story_scene1_shadow.png",
    mobileBg: "/images/landing/about_mobile1.png",
    type: "body",
    text: "At Fruitshop on Greams Road, we have one simple mission: to serve the freshest, juiciest fruit juices you've ever tasted. We do milkshakes, too. Some of them have delightfully odd names – like Jughead Special, Bartender’s Blush (made with no bartenders and a little blushing), and Ban the Banana (ironically, made with bananas).",
  },
  {
    id: 2,
    desktopBg: "/images/landing/story_scene2_snatch.jpg",
    mobileBg: "/images/landing/about_mobile2.png",
    type: "body",
    text: "Over the years, we’ve added to our menu to keep up with changing tastes, changing times and the ever-evolving lingo (thank you, Gen\u2011Z).",
    hasBubble: true,
  },
  {
    id: 3,
    desktopBg: "/images/landing/story_scene3_peel.png",
    mobileBg: "/images/landing/about_mobile3.png",
    type: "callout",
    intro: "We’d love to tell you more in person.",
    callout: "So drop in at any one of our stores\n and\nwe’ll get down to juicing.",
  },
];

export default function AboutStory() {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const [current, setCurrent] = useState(0);

  const isInView = useInView(sceneRef, { amount: 0.15 });

  const isLocked = useRef(false);
  const lockTimer = useRef(null);
  const currentRef = useRef(0);
  currentRef.current = current;

  const triggerSceneChange = useCallback((targetIndex) => {
    if (targetIndex < 0 || targetIndex >= SCENES.length) return;
    if (isLocked.current) return;

    isLocked.current = true;
    setCurrent(targetIndex);

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const containerTop = rect.top + scrollTop;
      const containerHeight = containerRef.current.offsetHeight;
      const windowHeight = window.innerHeight;
      const maxScroll = containerHeight - windowHeight;
      const targetScroll = containerTop + (targetIndex / (SCENES.length - 1)) * maxScroll;

      window.scrollTo({ top: targetScroll, behavior: "smooth" });
    }

    clearTimeout(lockTimer.current);
    lockTimer.current = setTimeout(() => {
      isLocked.current = false;
    }, 600);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    return scrollYProgress.on("change", (latest) => {
      if (isLocked.current) return;
      let nextIndex = 0;
      if (latest < 0.25) {
        nextIndex = 0;
      } else if (latest < 0.52) {
        nextIndex = 1;
      } else if (latest < 0.78) {
        nextIndex = 2;
      } else {
        nextIndex = 3;
      }
      setCurrent((prev) => (prev !== nextIndex ? nextIndex : prev));
    });
  }, [scrollYProgress]);

  // Desktop wheel: 1 scroll gesture = 1 scene transition
  useEffect(() => {
    const handleWheel = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const isPinned = rect.top <= 15 && rect.bottom >= windowHeight - 15;
      if (!isPinned) return;

      const cur = currentRef.current;
      const delta = e.deltaY;

      if (delta > 0) {
        // Scrolling down: advance 1 scene
        if (cur < SCENES.length - 1) {
          e.preventDefault();
          triggerSceneChange(cur + 1);
        }
      } else if (delta < 0) {
        // Scrolling up: go back 1 scene
        if (cur > 0) {
          e.preventDefault();
          triggerSceneChange(cur - 1);
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [triggerSceneChange]);

  // Mobile touch: 1 swipe gesture = 1 scene transition
  useEffect(() => {
    let touchStartY = 0;
    let touchStartX = 0;
    let isTouchActive = false;

    const handleTouchStart = (e) => {
      if (e.touches.length !== 1) return;
      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
      isTouchActive = true;
    };

    const handleTouchMove = (e) => {
      if (!isTouchActive || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const isPinned = rect.top <= 25 && rect.bottom >= windowHeight - 25;
      if (!isPinned) return;

      const currentY = e.touches[0].clientY;
      const currentX = e.touches[0].clientX;
      const diffY = touchStartY - currentY;
      const diffX = touchStartX - currentX;

      if (Math.abs(diffX) > Math.abs(diffY)) return;
      if (Math.abs(diffY) < 30) return;

      const cur = currentRef.current;

      if (diffY > 0) {
        // Swiping UP -> move to next scene
        if (cur < SCENES.length - 1) {
          e.preventDefault();
          isTouchActive = false;
          triggerSceneChange(cur + 1);
        }
      } else if (diffY < 0) {
        // Swiping DOWN -> move to previous scene
        if (cur > 0) {
          e.preventDefault();
          isTouchActive = false;
          triggerSceneChange(cur - 1);
        }
      }
    };

    const handleTouchEnd = () => {
      isTouchActive = false;
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [triggerSceneChange]);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const isPinned = rect.top <= 20 && rect.bottom >= windowHeight - 20;
      if (!isPinned) return;

      const cur = currentRef.current;
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        if (cur < SCENES.length - 1) {
          e.preventDefault();
          triggerSceneChange(cur + 1);
        }
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        if (cur > 0) {
          e.preventDefault();
          triggerSceneChange(cur - 1);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [triggerSceneChange]);

  useEffect(() => {
    return () => {
      clearTimeout(lockTimer.current);
    };
  }, []);

  const scene = SCENES[current];

  return (
    <section className="nui-about" id="about" ref={containerRef} style={{ position: "relative" }}>
      <div className="nui-about-scene" ref={sceneRef}>
        {/* All backgrounds stacked — responsive picture elements with desktop and mobile sources */}
        {SCENES.map((s) => (
          <picture
            key={s.id}
            className="nui-about-scene-bg-wrap"
            style={{
              opacity: s.id === scene.id ? 1 : 0,
              transition: "opacity 0.75s ease-in-out",
            }}
          >
            <source media="(max-width: 640px)" srcSet={s.mobileBg} />
            <img
              src={s.desktopBg}
              alt=""
              className="nui-about-scene-bg"
            />
          </picture>
        ))}

        {/* Ambient museum lighting scrim */}
        <div className="nui-about-scrim" />

        {/* Story Content — animated with AnimatePresence */}
        <AnimatePresence mode="wait">
          {isInView && (
            <motion.div
              key={scene.id}
              className={`nui-about-content nui-scene-content-${scene.id}`}
              initial={{ opacity: 0, scale: 0.88, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.90, y: -10 }}
              transition={{
                type: "spring",
                stiffness: 280,
                damping: 20,
                mass: 0.8,
              }}
            >
              {/* Scene 0: Staged text animation with signature curve matching reference */}
              {scene.type === "scene0" && (
                <div className="nui-story-scene0-wrap">
                  <motion.h3
                    className="nui-story-title-line"
                    initial={{ opacity: 0, scale: 0.9, y: 12 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 18,
                      delay: 0.1,
                    }}
                  >
                    {scene.title}
                  </motion.h3>

                  <motion.p
                    className="nui-story-paren-line"
                    initial={{ opacity: 0, scale: 0.88, y: 12 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 320,
                      damping: 18,
                      delay: 0.35,
                    }}
                  >
                    {scene.subtitle}
                  </motion.p>

                  <div className="nui-story-signature-wrap">
                    <motion.div
                      className="nui-story-signature-box"
                      initial={{ clipPath: "inset(0% 100% 0% 0%)" }}
                      animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
                      transition={{ duration: 0.85, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <svg
                        className="nui-story-signature-svg"
                        viewBox="0 0 260 38"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M 8 28 C 68 4, 192 4, 252 26 C 192 15, 68 15, 8 28 Z"
                          fill="#221109"
                        />
                      </svg>
                    </motion.div>
                  </div>
                </div>
              )}

              {/* Scene 1 & 2: Story Body text */}
              {scene.type === "body" && (
                <motion.p
                  className="nui-story-text nui-story-italic"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 280,
                    damping: 20,
                    delay: 0.08,
                  }}
                >
                  {scene.text}
                </motion.p>
              )}

              {/* Scene 3: Invitation Callout (without CTA button) */}
              {scene.type === "callout" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 280,
                    damping: 20,
                    delay: 0.08,
                  }}
                >
                  <h3 className="nui-story-intro">{scene.intro}</h3>
                  <p className="nui-story-text nui-story-italic nui-story-callout">
                    {scene.callout.split("\n").map((line, i) => (
                      <span key={i}>
                        {line}
                        {i < scene.callout.split("\n").length - 1 && <br />}
                      </span>
                    ))}
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* "uh-oh!" Speech Bubble (Scene 2 only) */}
        <AnimatePresence>
          {scene.hasBubble && (
            <motion.div
              className="nui-speech-bubble"
              initial={{ scale: 0, rotate: -18 }}
              animate={{ scale: 1, rotate: -10 }}
              exit={{ scale: 0, rotate: 10 }}
              transition={{ type: "spring", stiffness: 260, damping: 15, delay: 0.3 }}
            >
              uh-oh!
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modern Right-Side Vertical Dotted-to-Line Navigation */}
        <nav className="nui-about-indicator-nav" aria-label="Story scene navigation">
          {SCENES.map((s, i) => (
            <button
              key={s.id}
              type="button"
              className={`nui-nav-dot ${i === current ? "active" : ""}`}
              onClick={() => triggerSceneChange(i)}
              aria-label={`Jump to scene ${i + 1}`}
            />
          ))}
        </nav>
      </div>
    </section>
  );
}
