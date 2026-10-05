import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
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
    text: "At Fruitshop on Greams Road, we have one simple mission: to serve the freshest, juiciest fruit juices you've ever tasted. We do milkshakes, too. Some of them have delightfully odd names – like Jughead Special, Bartender's Blush (made with no bartenders and a little blushing), and Ban the Banana (ironically, made with bananas).",
  },
  {
    id: 2,
    desktopBg: "/images/landing/story_scene2_snatch.jpg",
    mobileBg: "/images/landing/about_mobile2.png",
    type: "body",
    text: "Over the years, we've added to our menu to keep up with changing tastes, changing times and the ever-evolving lingo (thank you, Gen\u2011Z).",
  },
  {
    id: 3,
    desktopBg: "/images/landing/story_scene3_peel.png",
    mobileBg: "/images/landing/about_mobile3.png",
    type: "callout",
    intro: "We'd love to tell you more in person.",
    callout: "So drop in at any one of our stores\n and\nwe'll get down to juicing.",
  },
];

/* Whole-text Clean Zoom-In (enter) & Zoom-Out (exit) animation */
const wholeTextZoomVariants = {
  hidden: {
    opacity: 0,
    scale: 0.75,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.85,
    transition: {
      duration: 0.35,
      ease: "easeIn",
    },
  },
};

export default function AboutStory() {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const [current, setCurrent] = useState(0);
  const autoTimerRef = useRef(null);

  const isInView = useInView(sceneRef, { amount: 0.15 });

  // Auto-advance: 5 seconds per scene, loops continuously
  useEffect(() => {
    if (!isInView) return;

    autoTimerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SCENES.length);
    }, 5000);

    return () => clearInterval(autoTimerRef.current);
  }, [isInView]);

  const scene = SCENES[current];
  const isScene0 = scene.type === "scene0";

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
              {...(isScene0
                ? {
                    initial: { opacity: 0, scale: 0.88, y: 14 },
                    animate: { opacity: 1, scale: 1, y: 0 },
                    exit: { opacity: 0, scale: 0.9, y: -10 },
                    transition: { type: "spring", stiffness: 280, damping: 20, mass: 0.8 },
                  }
                : {
                    initial: { opacity: 1 },
                    animate: { opacity: 1 },
                    exit: { opacity: 0, transition: { duration: 0.3 } },
                  })}
            >
              {/* Scene 0: Staged text animation with signature curve */}
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

              {/* Scene 1 & 2: Story Body text — whole text zooms in and lands */}
              {scene.type === "body" && (
                <motion.p
                  key={scene.id}
                  className="nui-story-text nui-story-italic"
                  variants={wholeTextZoomVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  style={{ transformOrigin: "center center" }}
                >
                  {scene.text}
                </motion.p>
              )}

              {/* Scene 3: Invitation Callout — whole intro & callout zoom in and land */}
              {scene.type === "callout" && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: { staggerChildren: 0.16, delayChildren: 0.04 },
                    },
                    exit: { opacity: 0, transition: { duration: 0.3 } },
                  }}
                >
                  <motion.h3
                    variants={wholeTextZoomVariants}
                    className="nui-story-intro"
                    style={{ transformOrigin: "center center" }}
                  >
                    {scene.intro}
                  </motion.h3>
                  <motion.p
                    variants={wholeTextZoomVariants}
                    className="nui-story-text nui-story-italic nui-story-callout"
                    style={{ transformOrigin: "center center" }}
                  >
                    {scene.callout.split("\n").map((line, i) => (
                      <span key={i}>
                        {line}
                        {i < scene.callout.split("\n").length - 1 && <br />}
                      </span>
                    ))}
                  </motion.p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scene indicator dots (read-only, no click navigation) */}
        <nav className="nui-about-indicator-nav" aria-label="Story scene indicator">
          {SCENES.map((s, i) => (
            <div
              key={s.id}
              className={`nui-nav-dot ${i === current ? "active" : ""}`}
              aria-label={`Scene ${i + 1}${i === current ? " (current)" : ""}`}
            />
          ))}
        </nav>
      </div>
    </section>
  );
}
