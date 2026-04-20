import { useState, useEffect, useRef } from "react";
import { motion, useInView, animate, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaInstagram, FaLinkedinIn, FaLeaf } from "react-icons/fa";
import { FiShoppingCart, FiChevronDown, FiMapPin, FiMinus, FiPlus, FiZap, FiUsers } from "react-icons/fi";
import "../App.css";

/* ── Animated Counter ─────────────────────────────────────────────────── */
function AnimatedCounter({ target, suffix = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, target, {
      duration: 2, ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return controls.stop;
  }, [inView, target]);
  return <span ref={ref}>{display}{suffix}</span>;
}

/* ── Typewriter ───────────────────────────────────────────────────────── */
function Typewriter({ lines }) {
  const [displayed, setDisplayed] = useState([]);
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (lineIdx >= lines.length) { setDone(true); return; }
    const line = lines[lineIdx];
    if (charIdx <= line.length) {
      const t = setTimeout(() => {
        setDisplayed((prev) => { const next = [...prev]; next[lineIdx] = line.slice(0, charIdx); return next; });
        setCharIdx((c) => c + 1);
      }, 38);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => { setLineIdx((l) => l + 1); setCharIdx(0); }, 120);
      return () => clearTimeout(t);
    }
  }, [charIdx, lineIdx, lines]);
  return (
    <>
      {lines.map((line, i) => (
        <span key={i} style={{ display: "inline-block", whiteSpace: "pre" }}>
          {i === 1 ? <em className="hero-title-accent">{displayed[i] ?? ""}</em> : (displayed[i] ?? "")}
          {i === lineIdx && charIdx <= line.length && !done && <span className="cursor-blink">|</span>}
        </span>
      ))}
    </>
  );
}

/* ── FadeUp wrapper ───────────────────────────────────────────────────── */
function FadeUp({ children, delay = 0, className = "", style = {} }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} className={className} style={style}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: "easeOut" }}>
      {children}
    </motion.div>
  );
}

/* ── Data ─────────────────────────────────────────────────────────────── */
const FRUIT_IMGS = {
  mango: "/fruits/mango.jpg", orange: "/fruits/orange.jpg",
  strawberry: "/fruits/strawberry.jpg", kiwi: "/fruits/kiwi.jpg",
};

const products = [
  { img: "/menu/jughead.png", name: "Jughead Special", tag: "Most Popular", category: "signature", desc: "A rich blend of dried fruits and ice cream. The one everyone orders first.", bg: "linear-gradient(135deg, #C08552, #8C5A3C)", solidBg: "#FFF8F0", accent: "#8C5A3C", alt: "Jughead Special" },
  { img: "/menu/coconut.jpg", name: "Tender Coconut Pudding", tag: "Fan Favourite", category: "dessert", desc: "Silky, fresh, melt-in-mouth coconut pudding. Chennai can't stop talking about it.", bg: "linear-gradient(135deg, #C08552, #4B2E2B)", solidBg: "#F5EDE0", accent: "#4B2E2B", alt: "Coconut Pudding" },
  { img: "/menu/mint.jpg", name: "Mint Lime Cooler", tag: "Refreshing", category: "juice", desc: "Zesty lime and fresh mint. Tastes even better without sugar.", bg: "linear-gradient(135deg, #8C5A3C, #6B3E2E)", solidBg: "#F5EDE0", accent: "#6B3E2E", alt: "Mint Lime Cooler" },
  { img: "/menu/falooda.jpg", name: "Falooda", tag: "Classic", category: "dessert", desc: "Chilled layers of vermicelli, rose syrup, basil seeds and fruit jelly.", bg: "linear-gradient(135deg, #C08552, #A06840)", solidBg: "#FFF0E0", accent: "#A06840", alt: "Falooda" },
  { img: "/menu/caramel.jpg", name: "Caramel Custard Pudding", tag: "Dessert", category: "dessert", desc: "Silky, rich caramel custard — just the right sweetness.", bg: "linear-gradient(135deg, #D4A070, #C08552)", solidBg: "#FFF8F0", accent: "#C08552", alt: "Caramel Custard" },
  { img: "/menu/mango.png", name: "Fresh Mango Juice", tag: "Seasonal", category: "juice", desc: "Pure thick Alphonso mango juice. No water, no sugar — just mango.", bg: "linear-gradient(135deg, #C08552, #8C5A3C)", solidBg: "#FFF8E0", accent: "#8C5A3C", alt: "Mango Juice" },
  { img: "/menu/fruitcup.jpg", name: "Fruit in a Cup", tag: "Healthy", category: "healthy", desc: "A generous bowl of fresh seasonal fruits, served chilled.", bg: "linear-gradient(135deg, #8C5A3C, #4B2E2B)", solidBg: "#F5EDE0", accent: "#4B2E2B", alt: "Fruit Cup" },
  { img: "/menu/smoothie.jpg", name: "Fresh Fruit Smoothie", tag: "Signature", category: "signature", desc: "Thick blended seasonal fruits — no artificial flavors, no shortcuts.", bg: "linear-gradient(135deg, #C08552, #8C5A3C)", solidBg: "#F5EDE0", accent: "#8C5A3C", alt: "Smoothie" },
];

const outlets = [
  { num: "01", name: "Greams Road", city: "Chennai", address: "11, Greams Road, Thousand Lights, Chennai, Tamil Nadu – 600006", flag: "flagship", map: "https://www.google.com/maps/search/?api=1&query=Fruit+Shop+On+Greams+Road+Thousand+Lights+Chennai" },
  { num: "02", name: "Besant Nagar", city: "Chennai", address: "21, 3rd Avenue, Besant Nagar, Chennai, Tamil Nadu – 600090", map: "https://www.google.com/maps/search/?api=1&query=Fruit+Shop+On+Greams+Road+Besant+Nagar+Chennai" },
  { num: "03", name: "Kilpauk", city: "Chennai", address: "Harleys Road / Kilpauk area, Chennai, Tamil Nadu", map: "https://www.google.com/maps/search/?api=1&query=Fruit+Shop+On+Greams+Road+Kilpauk+Chennai" },
  { num: "04", name: "Nungambakkam", city: "Chennai", address: "37, Nungambakkam High Rd, Ponnangipuram, Tirumurthy Nagar, Nungambakkam, Chennai, Tamil Nadu - 600034", map: "https://www.google.com/maps/search/?api=1&query=Fruit+Shop+On+Greams+Road+Anna+Nagar+East+Chennai3" },
  { num: "05", name: "Cathedral Road", city: "Chennai", address: "Cathedral Road, Gopalapuram, Chennai, Tamil Nadu", map: "https://www.google.com/maps/search/?api=1&query=Fruit+Shop+On+Greams+Road+Cathedral+Road+Chennai" },
  { num: "06", name: "Anna Nagar", city: "Chennai", address: "AH Block, 4th Avenue, Anna Nagar East, Chennai, Tamil Nadu – 600040", map: "https://www.google.com/maps/search/?api=1&query=Fruit+Shop+On+Greams+Road+Anna+Nagar+East+Chennai" },
  { num: "07", name: "Phoenix Mall", city: "Chennai", address: "Palladium Mall, Indira Gandhi Nagar, Velachery, Chennai, Tamil Nadu - 600042", map: "https://www.google.com/maps/search/?api=1&query=Fruit+Shop+On+Greams+Road+Anna+Nagar+East+Chennai4" },
  { num: "08", name: "Ashok Nagar", city: "Chennai", address: "Jain Antariksha Apartments area, Kodambakkam, Chennai, Tamil Nadu", map: "https://www.google.com/maps/search/?api=1&query=Fruit+Shop+On+Greams+Road+Kodambakkam+Chennai" },
  { num: "09", name: "Egmore", city: "Chennai", address: "Opposite Commissioner Office, Pantheon Road, Egmore, Chennai, Tamil Nadu – 600008", map: "https://www.google.com/maps/search/?api=1&query=Fruit+Shop+On+Greams+Road+Egmore+Chennai" },
  { num: "10", name: "Alwarpet", city: "Chennai", address: "77, CP Ramaswamy Rd, Sriram Colony, Abiramapuram, Chennai, Tamil Nadu - 600018", map: "https://www.google.com/maps/search/?api=1&query=Fruit+Shop+On+Greams+Road+Anna+Nagar+East+Chennai5" },
  { num: "11", name: "Iyyappanthangal", city: "Chennai", address: "Poonamallee High Road, Iyyappanthangal, Chennai, Tamil Nadu", map: "https://www.google.com/maps/search/?api=1&query=Fruit+Shop+On+Greams+Road+Iyyappanthangal+Chennai" },
  { num: "12", name: "Race Course", city: "Coimbatore", address: "127, Thirugnanasambandam Road, Race Course, Gopalapuram, Coimbatore, Tamil Nadu – 641018", flag: "coimbatore", map: "https://www.google.com/maps/search/?api=1&query=Fruit+Shop+On+Greams+Road+Race+Course+Coimbatore" },
  { num: "13", name: "T. Nagar", city: "Chennai", address: "2, Rajan Street, T. Nagar, Chennai, Tamil Nadu – 600017", map: "https://www.google.com/maps/search/?api=1&query=Fruit+Shop+On+Greams+Road+T+Nagar+Chennai" },
  { num: "14", name: "Santhome", city: "Chennai", address: "Pattinapakkam / Santhome area, Chennai, Tamil Nadu", map: "https://www.google.com/maps/search/?api=1&query=Fruit+Shop+On+Greams+Road+Santhome+Chennai" },
  { num: "15", name: "OMR", city: "Chennai", address: "12, MGR Main Rd, Kandhanchavadi, Perungudi, Chennai, Tamil Nadu - 600096", map: "https://www.google.com/maps/search/?api=1&query=Fruit+Shop+On+Greams+Road+Perungudi+Chennai" },
  { num: "16", name: "Puducherry", city: "Puducherry", address: "Mango Tree Food Court, Sri Aurobindo Street, Heritage Town, Puducherry – 605001", flag: "puducherry", map: "https://www.google.com/maps/search/?api=1&query=Fruit+Shop+On+Greams+Road+Puducherry" },
];

const reviews = [
  { stars: 5, text: "Been coming here since my college days in the 90s. The quality has never dipped — ever.", name: "Karthik S.", tag: "Regular since 1998", avatar: "🧑" },
  { stars: 5, text: "You can smell the freshness the moment you walk in. This is what a juice shop should be.", name: "Priya N.", tag: "Health enthusiast", avatar: "👩" },
  { stars: 5, text: "Their quirky banner puns keep me coming back almost as much as the mango shake does.", name: "Arun M.", tag: "Food blogger", avatar: "👨‍💻" },
  { stars: 5, text: "The Blue Dot Special is a revelation. I've ordered it 47 times and counting.", name: "Deepa R.", tag: "Loyal customer", avatar: "👩‍🦱" },
  { stars: 5, text: "Took my daughter here and she immediately declared it the best place in Chennai.", name: "Sundar K.", tag: "Parent & fan", avatar: "👨" },
  { stars: 5, text: "The coconut pudding! The coconut pudding! The coconut pudding!", name: "Meera T.", tag: "Dessert lover", avatar: "👩‍🦰" },
];

function FlagBadge({ flag }) {
  if (!flag) return null;
  const map = { flagship: ["Flagship", "flagship"], coimbatore: ["Coimbatore", "other"], puducherry: ["Puducherry", "other"] };
  const [label, cls] = map[flag] || ["", "other"];
  return <span className={`outlet-flag ${cls}`}>{label}</span>;
}

/* ── City color map — warm browns per city ────────────────────────────── */
const cityColors = {
  Chennai:    { color: "#4B2E2B", bg: "rgba(75,46,43,0.07)"  },
  Coimbatore: { color: "#8C5A3C", bg: "rgba(140,90,60,0.08)" },
  Puducherry: { color: "#C08552", bg: "rgba(192,133,82,0.10)" },
};

/* ── Product Card ─────────────────────────────────────────────────────── */
function ProductCard({ p, i, onAddToCart }) {
  const [qty, setQty] = useState(0);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    const finalQty = qty === 0 ? 1 : qty;
    onAddToCart(p, finalQty);
    setAdded(true);
    setTimeout(() => { setAdded(false); setQty(0); }, 1800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 48, rotate: -2 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.07, type: "spring", stiffness: 160, damping: 18 }}
      style={{
        width: "100%", maxWidth: "100%", borderRadius: 28, overflow: "visible",
        filter: "drop-shadow(0 16px 48px rgba(75,46,43,0.13))",
      }}
    >
      <div style={{ borderRadius: 28, overflow: "hidden", background: "#FFF8F0" }}>
        {/* Gradient header */}
        <div style={{
          background: p.bg, height: 220, position: "relative",
          display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden"
        }}>
          <div style={{ position: "absolute", width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.1)", top: -40, right: -40 }} />
          <div style={{ position: "absolute", width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.07)", bottom: -20, left: -10 }} />
          <div style={{ position: "absolute", width: 60, height: 60, borderRadius: "50%", background: "rgba(255,255,255,0.12)", top: 20, left: 20 }} />
          <div style={{ position: "absolute", top: 16, left: 16, background: "rgba(255,255,255,0.22)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)", color: "#fff", fontSize: 11, fontWeight: 700, padding: "5px 14px", borderRadius: 100, letterSpacing: "0.5px", border: "1px solid rgba(255,255,255,0.35)" }}>
            {p.tag}
          </div>
          <motion.img src={p.img} alt={p.alt}
            style={{
              width: 150, height: 150, objectFit: "cover", borderRadius: "50%",
              border: "5px solid rgba(255,255,255,0.5)",
              boxShadow: "0 16px 48px rgba(0,0,0,0.22)", position: "relative", zIndex: 2
            }}
          />
        </div>

        {/* Card body */}
        <div style={{ padding: "22px 20px 20px", background: "#FFF8F0" }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: p.accent, marginBottom: 12 }} />
          <div style={{ fontSize: 19, fontWeight: 800, color: "#2C1810", marginBottom: 6, lineHeight: 1.2 }}>
            {p.name}
          </div>
          <p style={{ fontSize: 13, color: "#9ca3af", lineHeight: 1.65, marginBottom: 20, fontWeight: 400, minHeight: 44 }}>
            {p.desc}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function ProductWheel({ products, onAddToCart }) {
  const n = products.length;
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const RADIUS = isMobile ? 130 : 210;
  const ITEM_SIZE = isMobile ? 64 : 80;
  const containerSize = RADIUS * 2 + ITEM_SIZE + 24;
  const center = containerSize / 2;

  const [totalAngle, setTotalAngle] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const stepAngle = 360 / n;

  const spin = () => {
    if (spinning) return;
    setTotalAngle((prev) => prev + (-stepAngle));
    setSelectedIdx((prev) => (prev + 1) % n);
    setSpinning(true);
    setTimeout(() => setSpinning(false), 500);
  };

  const selectManual = (idx) => {
    if (spinning) return;
    const targetMod = ((-stepAngle * idx) % 360 + 360) % 360;
    const currentMod = ((totalAngle % 360) + 360) % 360;
    let delta = targetMod - currentMod;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    setTotalAngle(totalAngle + delta);
    setSelectedIdx(idx);
  };

  const TRANSITION = "transform 0.5s cubic-bezier(0.34, 1.4, 0.64, 1)";

  return (
    <div style={{
      display: "flex", flexDirection: isMobile ? "column" : "row",
      alignItems: "flex-start", justifyContent: "center",
      gap: isMobile ? 32 : 64, padding: isMobile ? "0 16px" : "0 48px",
      width: "100%", boxSizing: "border-box",
    }}>
      {/* Wheel */}
      <div style={{ position: "relative", width: containerSize, height: containerSize, flexShrink: 0 }}>
        {/* Dashed track */}
        <div style={{
          position: "absolute",
          top: ITEM_SIZE / 2 + 12, left: ITEM_SIZE / 2 + 12,
          right: ITEM_SIZE / 2 + 12, bottom: ITEM_SIZE / 2 + 12,
          borderRadius: "50%", border: "2px dashed rgba(192,133,82,0.25)", pointerEvents: "none",
        }} />

        {/* Rotating items */}
        <div style={{
          position: "absolute", inset: 0,
          transform: `rotate(${totalAngle}deg)`, transition: TRANSITION,
        }}>
          {products.map((p, i) => {
            const angleRad = (stepAngle * i) * Math.PI / 180;
            const x = center + RADIUS * Math.sin(angleRad) - ITEM_SIZE / 2;
            const y = center - RADIUS * Math.cos(angleRad) - ITEM_SIZE / 2;
            const isSelected = selectedIdx === i;
            return (
              <div key={p.name} onClick={() => selectManual(i)}
                style={{
                  position: "absolute", left: x, top: y, width: ITEM_SIZE, height: ITEM_SIZE,
                  transform: `rotate(${-totalAngle}deg)`, transition: TRANSITION,
                  cursor: spinning ? "default" : "pointer", zIndex: isSelected ? 10 : 1,
                }}>
                <div style={{
                  width: "100%", height: "100%", borderRadius: "50%", overflow: "hidden",
                  border: isSelected ? "3px solid #C08552" : "3px solid rgba(255,255,255,0.92)",
                  boxShadow: isSelected
                    ? "0 0 0 3px #4B2E2B, 0 8px 24px rgba(0,0,0,0.18)"
                    : "0 4px 12px rgba(0,0,0,0.14)",
                  transition: "border-color 0.3s, box-shadow 0.3s",
                }}>
                  <img src={p.img} alt={p.alt}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>
                <div style={{
                  position: "absolute", bottom: -18, left: "50%",
                  transform: "translateX(-50%)", whiteSpace: "nowrap",
                  fontSize: isMobile ? 9 : 10, fontWeight: 700,
                  color: isSelected ? "#4B2E2B" : "#9ca3af",
                  letterSpacing: "0.3px", transition: "color 0.3s",
                }}>
                  {p.name.split(" ").slice(0, 2).join(" ")}
                </div>
              </div>
            );
          })}
        </div>

        {/* Top indicator */}
        <div style={{
          position: "absolute", top: 6, left: "50%", transform: "translateX(-50%)",
          width: 0, height: 0,
          borderLeft: "7px solid transparent", borderRight: "7px solid transparent",
          borderTop: "12px solid #4B2E2B", zIndex: 30, pointerEvents: "none",
        }} />

        {/* Center spin button */}
        <motion.button onClick={spin} disabled={spinning}
          whileTap={{ scale: 0.9 }}
          animate={spinning ? { scale: [1, 0.85, 1.1, 1], rotate: [0, -10, 5, 0] } : {}}
          transition={{ duration: 0.4, type: "spring", stiffness: 400, damping: 12 }}
          style={{
            position: "absolute", top: "50%", left: "50%",
            x: "-50%", y: "-50%",
            width: isMobile ? 90 : 140, height: isMobile ? 90 : 140,
            background: "transparent", border: "none",
            cursor: spinning ? "default" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 20,
          }}>
          <img src="/logo.png" alt="Spin"
            style={{ width: "100%", height: "100%", objectFit: "contain" }} />
        </motion.button>
      </div>

      {/* Card */}
      <div style={{
        flex: 1, width: isMobile ? "100%" : "auto",
        maxWidth: 480, minWidth: isMobile ? "unset" : 360,
      }}>
        <AnimatePresence mode="wait">
          <motion.div key={selectedIdx}
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ duration: 0.35, ease: "easeOut" }}>
            <ProductCard p={products[selectedIdx]} i={0} onAddToCart={onAddToCart} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ── Main Component ───────────────────────────────────────────────────── */
export default function FruitShopLanding({ cart, setCart }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [activeCity, setActiveCity] = useState("all");

  const totalCartItems = cart.reduce((sum, i) => sum + i.qty, 0);

  const handleAddToCart = (product, qty) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.name === product.name);
      if (existing) return prev.map((i) => i.name === product.name ? { ...i, qty: i.qty + qty } : i);
      return [...prev, { ...product, qty }];
    });
  };

  const cities = ["all", "Chennai", "Coimbatore", "Puducherry"];
  const filteredOutlets = activeCity === "all" ? outlets : outlets.filter(o => o.city === activeCity);

  return (
    <>
      {/* ── NAVBAR ── */}
      <motion.nav className="nav"
        initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{ background: "#4B2E2B", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>

        <a href="#" className="nav-logo">
          <img src="/logo.png" alt="" style={{ height: 48, width: "auto", marginRight: 4 }} />
          <div>
            <div className="nav-logo-text" style={{ color: "#fff", fontFamily: "'Fraunces', serif" }}>Fruit Shop</div>
            <div className="nav-logo-sub" style={{ color: "#E8C49A" }}>ON GREAMS ROAD</div>
          </div>
        </a>

        <ul className="nav-links">
          <motion.li initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <a href="#products" style={{ color: "#ffffff", fontWeight: 500 }}>Menu</a>
          </motion.li>

          {/* Services dropdown */}
          <motion.li initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 }}
            style={{ position: "relative" }}
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}>
            <button style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, color: "#ffffff", fontWeight: 500, fontSize: "inherit", padding: 0 }}>
              Services
              <motion.span animate={{ rotate: servicesOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <FiChevronDown size={14} />
              </motion.span>
            </button>
            <AnimatePresence>
              {servicesOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.18 }}
                  style={{ position: "absolute", top: "calc(100% + 12px)", left: "50%", transform: "translateX(-50%)", background: "rgba(75,46,43,0.97)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 16, padding: "8px", minWidth: 210, zIndex: 2000 }}>
                  {[
                    { label: "🍹 Pick Me Up", path: "/pickup", sub: "Order fresh to your location" },
                    { label: "🏪 Stall Enquiry", path: "/stall", sub: "Book us for your event" },
                    { label: "🤝 Franchise", path: "/franchise", sub: "Open your own outlet" },
                  ].map(({ label, path, sub }) => (
                    <motion.div key={label} whileHover={{ background: "rgba(255,255,255,0.08)", x: 3 }}
                      onClick={() => { navigate(path); setServicesOpen(false); }}
                      style={{ padding: "10px 14px", borderRadius: 10, cursor: "pointer" }}>
                      <div style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>{label}</div>
                      <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 11, marginTop: 2 }}>{sub}</div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.li>

          {["#about", "#locations"].map((href, i) => {
            const labels = ["About", "Locations"];
            return (
              <motion.li key={href} initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.46 + i * 0.08 }}>
                <a href={href} style={{ color: "#ffffff", fontWeight: 500 }}>{labels[i]}</a>
              </motion.li>
            );
          })}
        </ul>

        {/* Hamburger */}
        <div role="button" tabIndex={0} aria-label="Menu" className="mobile-hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ display: "flex", flexDirection: "column", gap: "5px", padding: "8px", cursor: "pointer", background: "none", border: "none", zIndex: 1070 }}>
          {[0, 1, 2].map(n => <div key={n} style={{ width: "24px", height: "3px", backgroundColor: "#ffffff", borderRadius: "2px" }} />)}
        </div>
      </motion.nav>

      {/* Mobile overlay */}
      {menuOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", zIndex: 9998 }}
          onClick={() => setMenuOpen(false)} />
      )}
      <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: "280px", background: "#4B2E2B", zIndex: 9999, transform: menuOpen ? "translateX(0)" : "translateX(100%)", transition: "transform 0.3s ease", padding: "80px 32px 24px", display: "flex", flexDirection: "column", gap: "8px" }}>
        <button onClick={() => setMenuOpen(false)} style={{ position: "absolute", top: "20px", right: "20px", background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#fff" }}>✕</button>
        {[
          { label: "Menu", href: "#products", isRoute: false },
          { label: "Services", href: null, isRoute: false, isHeader: true },
          { label: "🍹 Pick Me Up", href: "/pickup", isRoute: true },
          { label: "🏪 Stall Enquiry", href: "/stall", isRoute: true },
          { label: "🤝 Franchise", href: "/franchise", isRoute: true },
          { label: "About", href: "#about", isRoute: false },
          { label: "Locations", href: "#locations", isRoute: false },
        ].map(({ label, href, isRoute, isHeader }) =>
          isHeader
            ? <div key={label} style={{ fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "1.5px", padding: "14px 16px 4px" }}>{label}</div>
            : isRoute
              ? <button key={label} onClick={() => { navigate(href); setMenuOpen(false); }}
                  style={{ textDecoration: "none", color: "#fff", fontSize: "15px", fontWeight: 600, padding: "10px 16px", borderRadius: "10px", display: "block", background: "none", border: "none", cursor: "pointer", width: "100%", textAlign: "left" }}>
                  {label}
                </button>
              : <a key={label} href={href} onClick={() => setMenuOpen(false)}
                  style={{ textDecoration: "none", color: "#fff", fontSize: "15px", fontWeight: 600, padding: "10px 16px", borderRadius: "10px", display: "block" }}>{label}</a>
        )}
      </div>

      {/* ── HERO ── */}
      <section className="hero" style={{ position: "relative", overflow: "hidden" }}>
        <video autoPlay muted loop playsInline style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.65, zIndex: 0 }}>
          <source src="/videos/hero-bg.mp4" type="video/mp4" />
        </video>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(75,46,43,0.85) 0%, rgba(140,90,60,0.5) 60%, rgba(192,133,82,0.3) 100%)", zIndex: 1 }} />

        <motion.div className="hero-content" style={{ position: "relative", zIndex: 2 }}
          initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}>
          <motion.div className="hero-badge" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} style={{ gap: 10 }}>
            <motion.span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "#E8C49A", flexShrink: 0 }}
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.35, 1], boxShadow: ["0 0 0px #E8C49A", "0 0 8px 2px #E8C49A", "0 0 0px #E8C49A"] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }} />
            Since 1992
          </motion.div>
          <h1 className="hero-title">
            <Typewriter lines={["Pure Fruits, ", "Pure Joy."]} />
          </h1>
          <motion.p className="hero-subtitle" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.6, duration: 0.8 }}>
            No artificial colors. No fake flavoring. No gas in our juices. Just the freshest fruits Chennai has to offer — squeezed to perfection.
          </motion.p>
        </motion.div>

        <motion.div className="hero-visual" style={{ position: "relative", zIndex: 2 }}
          initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}>
          <div className="hero-fruit-grid">
            {[
              { src: FRUIT_IMGS.mango, label: "Mango", alt: "Mango" },
              { src: FRUIT_IMGS.orange, label: "Orange", alt: "Orange" },
              { src: FRUIT_IMGS.strawberry, label: "Strawberry", alt: "Strawberry" },
              { src: FRUIT_IMGS.kiwi, label: "Kiwi", alt: "Kiwi" },
            ].map(({ src, label, alt }, i) => (
              <motion.div className="fruit-card-mini" key={label}
                initial={{ opacity: 0, scale: 0.75, rotate: -6 }} animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 0.7 + i * 0.15, type: "spring", stiffness: 200, damping: 18 }}
                whileHover={{ scale: 1.07, rotate: 2 }}>
                <img src={src} alt={alt} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </motion.div>
            ))}
          </div>
          <motion.div className="hero-stats" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}
            style={{ background: "rgba(0,0,0,0.45)", border: "1px solid rgba(232,196,154,0.4)" }}>
            {[
              { target: 30, suffix: "+", label: "Years" },
              { target: 16, suffix: "", label: "Outlets" },
              { target: 50, suffix: "+", label: "Flavours" },
              { target: 100, suffix: "%", label: "Natural" },
            ].map(({ target, suffix, label }) => (
              <div className="stat" key={label}>
                <div className="stat-num"><AnimatedCounter target={target} suffix={suffix} /></div>
                <div className="stat-label">{label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ── PRODUCTS ── */}
      <section className="products" id="products">
        <FadeUp className="products-header">
          <span className="section-label">Our Menu</span>
          <h2 className="section-title">Freshly Squeezed,<br /><em>Every Single Time</em></h2>
          <p className="section-subtitle">From classic juices to signature specials — every sip made from fruits sourced daily.</p>
        </FadeUp>

        <div style={{ position: "sticky", top: 72, zIndex: 10, width: "100%", background: "#FFF8F0", paddingTop: 16, paddingBottom: 16 }}>
          <ProductWheel products={products} onAddToCart={handleAddToCart} />
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section className="about" id="about" style={{ position: "relative", overflow: "hidden" }}>
        <motion.img src="/fruits/mango.jpg" alt=""
          style={{ position: "absolute", top: -80, right: -80, width: 380, height: 380, borderRadius: "50%", opacity: 0.06, objectFit: "cover", pointerEvents: "none" }}
          animate={{ y: [0, -20, 0], rotate: [0, 8, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }} />
        <motion.img src="/fruits/orange.jpg" alt=""
          style={{ position: "absolute", bottom: -60, left: -80, width: 300, height: 300, borderRadius: "50%", opacity: 0.07, objectFit: "cover", pointerEvents: "none" }}
          animate={{ y: [0, 18, 0], rotate: [0, -6, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 2 }} />

        <FadeUp>
          <span className="section-label">Our Story</span>
          <motion.blockquote
            initial={{ opacity: 0, x: -32 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1 }}
            style={{ borderLeft: "3px solid #C08552", paddingLeft: 20, margin: "20px 0 32px", fontStyle: "italic", fontSize: 18, fontWeight: 300, color: "#ffffff", lineHeight: 1.8, maxWidth: 700 }}>
            "When you have our juices there is no dying off of the taste buds with age. They tingle all the time, in anticipation!"
          </motion.blockquote>

          <h2 className="section-title">
            From a Small Shop<br /><em style={{ color: "#E8C49A" }}>to a Chennai Icon</em>
          </h2>

          <motion.div
            initial={{ width: 0, opacity: 0 }} whileInView={{ width: 60, opacity: 1 }}
            viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.3 }}
            style={{ height: 4, borderRadius: 2, background: "linear-gradient(90deg, #E8C49A, #C08552)", margin: "18px 0 28px" }} />

          <motion.p className="about-text"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
            In 1992, Fruit Shop on Greams Road evolved from a single{" "}
            <strong style={{ color: "white", fontWeight: 700 }}>200 sq. ft.</strong> outlet into a celebrated juice icon. With over 18 locations in India, we now serve more than{" "}
            <strong style={{ color: "white", fontWeight: 700 }}>5 million cups</strong> of juice annually — crafted to keep your taste buds sharp and excited.
          </motion.p>
        </FadeUp>

        {/* Animated stat cards */}
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", margin: "40px 0 0" }}>
          {[
            { num: 1992, suffix: "", label: "Founded" },
            { num: 18, suffix: "+", label: "Locations in India" },
            { num: 5, suffix: "M+", label: "Cups Served Yearly" },
            { num: 30, suffix: "+ yrs", label: "Of Consistent Quality" },
          ].map(({ num, suffix, label }, i) => (
            <motion.div key={label}
              initial={{ opacity: 0, y: 30, scale: 0.9 }} whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 + 0.2, type: "spring", stiffness: 180, damping: 18 }}
              whileHover={{ y: -6 }}
              style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 20, padding: "28px 32px", minWidth: 155, flex: 1, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, #E8C49A, #C08552)", borderRadius: "20px 20px 0 0" }} />
              <div style={{ fontSize: 38, fontWeight: 900, color: "#E8C49A", lineHeight: 1, marginBottom: 6 }}>
                {num === 1992 ? "1992" : <AnimatedCounter target={num} suffix={suffix} />}
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "1.2px" }}>
                {label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Marquee ticker */}
        <div style={{ overflow: "hidden", margin: "48px -72px", borderTop: "1px solid rgba(255,255,255,0.08)", borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "18px 0", background: "rgba(0,0,0,0.15)" }}>
          <motion.div style={{ display: "flex", whiteSpace: "nowrap" }}
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 22, repeat: Infinity, ease: "linear" }}>
            {[
              "100% Natural", "No Artificial Colors", "No Fake Flavoring",
              "No Gas in Our Juices", "Fresh Daily", "Since 1992",
              "5 Million Cups", "Pure Fruits, Pure Joy",
              "100% Natural", "No Artificial Colors", "No Fake Flavoring",
              "No Gas in Our Juices", "Fresh Daily", "Since 1992",
              "5 Million Cups", "Pure Fruits, Pure Joy",
            ].map((item, i) => (
              <span key={i} style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.38)", textTransform: "uppercase", letterSpacing: "2px", padding: "0 32px" }}>
                {item}<span style={{ color: "#C08552", marginLeft: 32 }}>✦</span>
              </span>
            ))}
          </motion.div>
        </div>

        <FadeUp delay={0.1}>
          <motion.h3
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
            style={{ fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 700, color: "#E8C49A", margin: "0 0 16px", letterSpacing: "-0.3px" }}>
            Haven't we come a long way?
          </motion.h3>
          <p className="about-text">
            Our success is built on nearly thirty years of painstaking attention to detail and a strict commitment to using only 100% natural ingredients. By blending imagination with innovation, we create exotic flavors that our customers love.
          </p>
          <p className="about-text">
            Beyond the juice, we offer an experience. Our shops are designed to be vibrant, serene, and cozy — the perfect place to relax with friends and family. With a friendly team and a "no-rush" atmosphere, we've created a space where you can truly unwind.
          </p>
        </FadeUp>

        {/* Pillars */}
        <div className="about-pillars">
          {[
            { icon: <FaLeaf size={22} color="#C08552" />,    title: "No Shortcuts",    desc: "We source locally and serve freshly — every single day." },
            { icon: <FiZap size={22} color="#E8C49A" />,     title: "Keep Innovating", desc: "New specials, quirky names, unexpected twists." },
            { icon: <FiUsers size={22} color="#D4B49A" />,   title: "Stay Simple",     desc: "Great ambience doesn't need to be complicated." },
            { icon: <FiMapPin size={22} color="#C08552" />,  title: "Keep Expanding",  desc: "18 locations and still replicating that first-store magic." },
          ].map(({ icon, title, desc }, i) => (
            <FadeUp key={title} delay={i * 0.1}>
              <motion.div className="pillar"
                whileHover={{ y: -6, borderColor: "rgba(192,133,82,0.4)" }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                <div className="pillar-icon">{icon}</div>
                <div className="pillar-title">{title}</div>
                <div className="pillar-desc">{desc}</div>
              </motion.div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── LOCATIONS ── */}
      <section className="locations" id="locations">
        <FadeUp className="locations-header">
          <span className="section-label">Find Us</span>
          <h2 className="section-title">Our <em>Outlets</em></h2>
          <p className="section-subtitle" style={{ margin: "12px auto 0", textAlign: "center" }}>
            Spread across Tamil Nadu — so freshness is never far from you.
          </p>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }} transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#4B2E2B", color: "#E8C49A", fontSize: 13, fontWeight: 700, padding: "7px 18px", borderRadius: 100, marginTop: 16, letterSpacing: "0.5px" }}>
            <FiMapPin size={13} /> <AnimatedCounter target={16} suffix="" /> Outlets
          </motion.div>
        </FadeUp>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%" }}>

          {/* TOP ROW — 5 cards */}
          <div className="locations-top-row" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10, gridAutoRows: "1fr" }}>
            {filteredOutlets.slice(0, 5).map((o, i) => {
              const cc = cityColors[o.city];
              return (
                <motion.a key={o.num} href={o.map} target="_blank" rel="noopener noreferrer"
                  initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.06, type: "spring", stiffness: 180, damping: 20 }}
                  whileHover={{ y: -4, boxShadow: "0 14px 36px rgba(75,46,43,0.13)" }}
                  style={{
                    display: "flex", flexDirection: "column", textDecoration: "none",
                    background: "#fff", borderRadius: 12, border: `1.5px solid ${cc.color}22`,
                    overflow: "hidden", cursor: "pointer", boxShadow: "0 3px 12px rgba(75,46,43,0.07)",
                  }}>
                  <div style={{ width: "100%", background: cc.bg, display: "flex", justifyContent: "center", alignItems: "center", padding: "6px 0 5px", borderBottom: `1.5px solid ${cc.color}15`, flexShrink: 0 }}>
                    <img src="/logo.png" alt="Logo" style={{ width: 22, height: 22, borderRadius: "50%", objectFit: "cover", border: `2px solid ${cc.color}` }} />
                  </div>
                  <div style={{ padding: "7px 10px 8px", flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, textAlign: "center" }}>
                    <span style={{ fontSize: 8, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.2px", color: cc.color, background: cc.bg, padding: "2px 7px", borderRadius: 100 }}>{o.city}</span>
                    <div style={{ fontSize: 11, fontWeight: 800, color: "#2C1810", lineHeight: 1.2 }}>{o.name}</div>
                    <p style={{ fontSize: 9, color: "#6b7280", lineHeight: 1.5, margin: "2px 0 0", fontWeight: 400 }}>{o.address}</p>
                    <div style={{ marginTop: 3, fontSize: 9, fontWeight: 700, color: cc.color, display: "flex", alignItems: "center", gap: 3 }}>
                      <FiMapPin size={8} /> Get Directions
                    </div>
                  </div>
                </motion.a>
              );
            })}
          </div>

          {/* MIDDLE ROW */}
          <div className="locations-map-row" style={{ display: "flex", gap: 10, alignItems: "stretch", height: 480 }}>

            {/* Left 3 */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: "0 0 170px" }}>
              {filteredOutlets.slice(5, 8).map((o, i) => {
                const cc = cityColors[o.city];
                return (
                  <motion.a key={o.num} href={o.map} target="_blank" rel="noopener noreferrer"
                    initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.06, type: "spring", stiffness: 180, damping: 20 }}
                    whileHover={{ y: -4, boxShadow: "0 14px 36px rgba(75,46,43,0.13)" }}
                    style={{
                      display: "flex", flexDirection: "column", textDecoration: "none",
                      background: "#fff", borderRadius: 12, border: `1.5px solid ${cc.color}22`,
                      overflow: "hidden", cursor: "pointer", boxShadow: "0 3px 12px rgba(75,46,43,0.07)", flex: 1,
                    }}>
                    <div style={{ width: "100%", background: cc.bg, display: "flex", justifyContent: "center", alignItems: "center", padding: "6px 0 5px", borderBottom: `1.5px solid ${cc.color}15`, flexShrink: 0 }}>
                      <img src="/logo.png" alt="Logo" style={{ width: 22, height: 22, borderRadius: "50%", objectFit: "cover", border: `2px solid ${cc.color}` }} />
                    </div>
                    <div style={{ padding: "7px 8px 8px", flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, textAlign: "center" }}>
                      <span style={{ fontSize: 8, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.2px", color: cc.color, background: cc.bg, padding: "2px 7px", borderRadius: 100 }}>{o.city}</span>
                      <div style={{ fontSize: 11, fontWeight: 800, color: "#2C1810", lineHeight: 1.2 }}>{o.name}</div>
                      <p style={{ fontSize: 9, color: "#6b7280", lineHeight: 1.5, margin: "2px 0 0", fontWeight: 400 }}>{o.address}</p>
                      <div style={{ marginTop: 3, fontSize: 9, fontWeight: 700, color: cc.color, display: "flex", alignItems: "center", gap: 3 }}>
                        <FiMapPin size={8} /> Get Directions
                      </div>
                    </div>
                  </motion.a>
                );
              })}
            </div>

            {/* MAP */}
            <motion.div className="locations-map-center" initial={{ opacity: 0, scale: 0.94 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ duration: 0.7, ease: "easeOut" }}
              style={{ flex: 1, borderRadius: 16, overflow: "hidden", boxShadow: "0 16px 48px rgba(75,46,43,0.13)", border: "2px solid rgba(75,46,43,0.13)" }}>
              <img src="/map.png" alt="Outlet locations map"
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "55% 15%", display: "block" }} />
            </motion.div>

            {/* Right 3 */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: "0 0 170px" }}>
              {filteredOutlets.slice(8, 11).map((o, i) => {
                const cc = cityColors[o.city];
                return (
                  <motion.a key={o.num} href={o.map} target="_blank" rel="noopener noreferrer"
                    initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.06, type: "spring", stiffness: 180, damping: 20 }}
                    whileHover={{ y: -4, boxShadow: "0 14px 36px rgba(75,46,43,0.13)" }}
                    style={{
                      display: "flex", flexDirection: "column", textDecoration: "none",
                      background: "#fff", borderRadius: 12, border: `1.5px solid ${cc.color}22`,
                      overflow: "hidden", cursor: "pointer", boxShadow: "0 3px 12px rgba(75,46,43,0.07)", flex: 1,
                    }}>
                    <div style={{ width: "100%", background: cc.bg, display: "flex", justifyContent: "center", alignItems: "center", padding: "6px 0 5px", borderBottom: `1.5px solid ${cc.color}15`, flexShrink: 0 }}>
                      <img src="/logo.png" alt="Logo" style={{ width: 22, height: 22, borderRadius: "50%", objectFit: "cover", border: `2px solid ${cc.color}` }} />
                    </div>
                    <div style={{ padding: "7px 10px 8px", flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, textAlign: "center" }}>
                      <span style={{ fontSize: 8, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.2px", color: cc.color, background: cc.bg, padding: "2px 7px", borderRadius: 100 }}>{o.city}</span>
                      <div style={{ fontSize: 11, fontWeight: 800, color: "#2C1810", lineHeight: 1.2 }}>{o.name}</div>
                      <p style={{ fontSize: 9, color: "#6b7280", lineHeight: 1.5, margin: "2px 0 0", fontWeight: 400 }}>{o.address}</p>
                      <div style={{ marginTop: 3, fontSize: 9, fontWeight: 700, color: cc.color, display: "flex", alignItems: "center", gap: 3 }}>
                        <FiMapPin size={8} /> Get Directions
                      </div>
                    </div>
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* BOTTOM ROW */}
          {filteredOutlets.length > 9 && (
            <div className="locations-bottom-row" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10, gridAutoRows: "1fr" }}>
              {filteredOutlets.slice(11).map((o, i) => {
                const cc = cityColors[o.city];
                return (
                  <motion.a key={o.num} href={o.map} target="_blank" rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.06, type: "spring", stiffness: 180, damping: 20 }}
                    whileHover={{ y: -4, boxShadow: "0 14px 36px rgba(75,46,43,0.13)" }}
                    style={{
                      display: "flex", flexDirection: "column", textDecoration: "none",
                      background: "#fff", borderRadius: 12, border: `1.5px solid ${cc.color}22`,
                      overflow: "hidden", cursor: "pointer", boxShadow: "0 3px 12px rgba(75,46,43,0.07)",
                    }}>
                    <div style={{ width: "100%", background: cc.bg, display: "flex", justifyContent: "center", alignItems: "center", padding: "6px 0 5px", borderBottom: `1.5px solid ${cc.color}15`, flexShrink: 0 }}>
                      <img src="/logo.png" alt="Logo" style={{ width: 22, height: 22, borderRadius: "50%", objectFit: "cover", border: `2px solid ${cc.color}` }} />
                    </div>
                    <div style={{ padding: "7px 12px 9px", flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, textAlign: "center" }}>
                      <span style={{ fontSize: 8, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.2px", color: cc.color, background: cc.bg, padding: "2px 8px", borderRadius: 100 }}>{o.city}</span>
                      <div style={{ fontSize: 11, fontWeight: 800, color: "#2C1810", lineHeight: 1.2 }}>{o.name}</div>
                      <p style={{ fontSize: 9, color: "#6b7280", lineHeight: 1.55, margin: "2px 0 0", fontWeight: 400 }}>{o.address}</p>
                      <div style={{ marginTop: 3, fontSize: 9, fontWeight: 700, color: cc.color, display: "flex", alignItems: "center", gap: 3 }}>
                        <FiMapPin size={8} /> Get Directions
                      </div>
                    </div>
                  </motion.a>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer>
        <div className="footer-inner">
          <div className="footer-brand-name">Fruit Shop on Greams Road</div>
          <p className="footer-tagline">No artificial colors. No fake flavoring. No gas in our juices.<br />Serving Chennai with freshness since 1992.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "center" }}>
            <span className="footer-contact-title">Contact Us</span>
          </div>
          <div className="footer-social">
            <a className="footer-social-link" href="https://www.instagram.com/fruitshopongreamsroad.in" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram /></a>
            <a className="footer-social-link" href="https://www.linkedin.com/company/fruit-shop-on-greams-road" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FaLinkedinIn /></a>
          </div>
          <div className="footer-divider" />
          <span className="footer-copy">© {new Date().getFullYear()} Fruit Shop on Greams Road. All rights reserved.</span>
        </div>
      </footer>
    </>
  );
}