import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { FiShoppingCart, FiMinus, FiPlus } from "react-icons/fi";

const CATEGORY_ACCENTS = {
  "Fresh Fruit Juices": "#4B2E2B",
  "Ice Cream Milkshakes": "#C08552",
  "Fresh Fruit Shakes": "#8C5A3C",
};

function Confetti({ active }) {
  const colors = ["#E8C49A", "#C08552", "#4B2E2B", "#D4B49A", "#8C5A3C"];
  return (
    <AnimatePresence>
      {active && (
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9999 }}>
          {Array.from({ length: 32 }).map((_, i) => (
            <motion.div key={i}
              initial={{ opacity: 1, y: 0, x: 0, rotate: 0, scale: 1 }}
              animate={{ opacity: 0, y: -Math.random() * 400 - 200, x: (Math.random() - 0.5) * 600, rotate: Math.random() * 720, scale: 0 }}
              transition={{ duration: 1.2, delay: Math.random() * 0.3, ease: "easeOut" }}
              style={{
                position: "absolute", bottom: "40%", left: "50%",
                width: 10, height: 10, borderRadius: Math.random() > 0.5 ? "50%" : 2,
                background: colors[Math.floor(Math.random() * colors.length)],
              }} />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}

function Toast({ message, show }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -80, x: "-50%", scale: 0.9 }}
          animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
          exit={{ opacity: 0, y: -60, x: "-50%", scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          style={{
            position: "fixed", top: 24, left: "50%",
            background: "#4B2E2B", color: "#fff",
            padding: "16px 28px", borderRadius: 100,
            fontSize: 15, fontWeight: 700,
            boxShadow: "0 8px 32px rgba(75,46,43,0.35)",
            zIndex: 99999, display: "flex", alignItems: "center", gap: 10,
            border: "1px solid rgba(232,196,154,0.3)",
            maxWidth: "90vw", textAlign: "center",
          }}>
          <span style={{ fontSize: 20 }}>🧃</span>
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function PickMeUp() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [pickupTime, setPickupTime] = useState("");
  const [servicesOpen, setServicesOpen] = useState(false);
  const [outletId, setOutletId] = useState("");
  const [quantities, setQuantities] = useState({});
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [outlets, setOutlets] = useState([]);
  const [menu, setMenu] = useState([]);
  const [orderError, setOrderError] = useState("");

  useEffect(() => {
    fetch("http://localhost:3001/api/outlets")
      .then(r => r.json())
      .then(setOutlets)
      .catch(err => console.error("Failed to fetch outlets:", err));
  }, []);

  useEffect(() => {
    fetch("http://localhost:3001/api/menu")
      .then(r => r.json())
      .then(setMenu)
      .catch(err => console.error("Failed to fetch menu:", err));
  }, []);

  const setQty = (name, delta) => {
    setQuantities(prev => {
      const curr = prev[name] || 0;
      const next = Math.max(0, curr + delta);
      return { ...prev, [name]: next };
    });
  };

  const allItems = menu.flatMap(cat => cat.items);
  const cartItems = allItems.filter(item => (quantities[item.name] || 0) > 0);
  const total = cartItems.reduce((sum, item) => sum + item.price * quantities[item.name], 0);
  const totalQty = cartItems.reduce((sum, item) => sum + quantities[item.name], 0);

  const toastMessages = [
    "Your thirst just got a date! 🍹 Squeezing it fresh — hold tight!",
    "Order received! 🎉 Our juicers are already warming up for you!",
    "You're about to taste pure joy 🌟 We're on it — fresh and fast!",
    "Boom! Your order's in the press 🍊 Freshness incoming!",
  ];

  const handlePlaceOrder = async () => {
    if (!outletId || !customerName || !customerPhone || !pickupTime || cartItems.length === 0) return;
    setPlacing(true);
    setOrderError("");
    try {
      const itemsForApi = cartItems.map(item => ({
        menu_item_id: item.id,
        name: item.name,
        quantity: quantities[item.name],
        unit_price: item.price,
      }));

      const res = await fetch("http://localhost:3001/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          outlet_id: parseInt(outletId),
          customer_name: customerName,
          customer_mobile: customerPhone,
          pickup_time: pickupTime,
          items: itemsForApi,
          subtotal: total,
          total,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to place order");

      setPlaced(true);
      setShowConfetti(true);
      setShowToast(true);
      setTimeout(() => setShowConfetti(false), 1500);
      setTimeout(() => setShowToast(false), 4000);
    } catch (err) {
      setOrderError(err.message);
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="pickup-bg-page">
      <video autoPlay muted loop playsInline className="pickup-bg-video">
        <source src="/videos/pickup-bg.mp4" type="video/mp4" />
      </video>
      <div className="pickup-bg-overlay" />
      <Confetti active={showConfetti} />
      <Toast show={showToast} message={toastMessages[Math.floor(Math.random() * toastMessages.length)]} />

      {/* Header */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          background: "rgba(30, 15, 10, 0.20)",
          backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
          borderBottom: "1px solid rgba(255,255,255,0.14)",
          padding: "0 48px", display: "flex", alignItems: "center",
          justifyContent: "space-between", height: 72, position: "sticky",
          top: 0, zIndex: 1000,
        }}>

        <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <img src="/logo.png" alt="" style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover", marginRight: 4 }} />
          <div>
            <div style={{ color: "#137c41", fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: 20, lineHeight: 1.2 }}>Fruit Shop</div>
            <div style={{ color: "#E91D24", fontSize: 10, fontWeight: 500, textTransform: "uppercase" }}>On Greams Road</div>
          </div>
        </a>

        <ul style={{ display: "flex", alignItems: "center", gap: 32, listStyle: "none", margin: 0, padding: 0 }} className="nav-links">
          <li><a onClick={() => { navigate("/"); setTimeout(() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" }), 100); }} style={{ color: "rgba(255,255,255,0.75)", fontWeight: 500, fontSize: 14, textDecoration: "none", cursor: "pointer" }}>Menu</a></li>

          <li style={{ position: "relative" }}
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}>
            <button style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, color: "rgba(255,255,255,0.75)", fontWeight: 500, fontSize: 14, padding: 0 }}>
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
                  style={{ position: "absolute", top: "calc(100% + 12px)", left: "50%", transform: "translateX(-50%)",background: "rgba(255,255,255,0.12)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 16, padding: "8px", minWidth: 210, zIndex: 2000 }}>
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
          </li>

          <li><a onClick={() => { navigate("/"); setTimeout(() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" }), 100); }} style={{ color: "rgba(255,255,255,0.75)", fontWeight: 500, fontSize: 14, textDecoration: "none", cursor: "pointer" }}>About</a></li>
          <li><a onClick={() => { navigate("/"); setTimeout(() => document.getElementById("locations")?.scrollIntoView({ behavior: "smooth" }), 100); }} style={{ color: "rgba(255,255,255,0.75)", fontWeight: 500, fontSize: 14, textDecoration: "none", cursor: "pointer" }}>Locations</a></li>
        </ul>

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
          { label: "Menu", href: "products", isRoute: true },
          { label: "Services", href: null, isRoute: false, isHeader: true },
          { label: "🍹 Pick Me Up", href: "/pickup", isRoute: true },
          { label: "🏪 Stall Enquiry", href: "/stall", isRoute: true },
          { label: "🤝 Franchise", href: "/franchise", isRoute: true },
          { label: "About", href: "about", isRoute: true },
          { label: "Locations", href: "locations", isRoute: true },
        ].map(({ label, href, isRoute, isHeader }) =>
          isHeader
            ? <div key={label} style={{ fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "1.5px", padding: "14px 16px 4px" }}>{label}</div>
            : isRoute
              ? <button key={label} onClick={() => {
                  if (["products","about","locations","reviews"].includes(href)) {
                    navigate("/");
                    setTimeout(() => document.getElementById(href)?.scrollIntoView({ behavior: "smooth" }), 100);
                  } else {
                    navigate(href);
                  }
                  setMenuOpen(false);
                }}
                  style={{ textDecoration: "none", color: "#fff", fontSize: "15px", fontWeight: 600, padding: "10px 16px", borderRadius: "10px", display: "block", background: "none", border: "none", cursor: "pointer", width: "100%", textAlign: "left" }}>
                  {label}
                </button>
              : <a key={label} href={href} onClick={() => setMenuOpen(false)}
                  style={{ textDecoration: "none", color: "#fff", fontSize: "15px", fontWeight: 600, padding: "10px 16px", borderRadius: "10px", display: "block" }}>{label}</a>
        )}
      </div>

      <div className="pickup-page-inner" style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 48px 120px", display: "grid", gridTemplateColumns: "1fr 380px", gap: 40, alignItems: "start" }}>

        {/* Left — intro + location + menu */}
        <div>
          {/* "More Than Juice" banner */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", border: "1px solid rgba(255,255,255,0.35)", borderRadius: 24, padding: "32px 36px", marginBottom: 32, position: "relative", overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}>
            <motion.div style={{ position: "absolute", right: -40, top: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(232,196,154,0.08)" }}
              animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 6, repeat: Infinity }} />
            <h3 style={{ fontSize: 22, fontWeight: 900, color: "#fff", marginBottom: 14, textShadow: "0 1px 8px rgba(0,0,0,0.4)" }}>More Than Juice</h3>
              <p style={{ fontSize: 14, color: "#fff", fontWeight: 500, lineHeight: 1.8, marginBottom: 12,justifyContent:"center", textAlign:"justify" }}>
                We don't bottle or process nature, we serve it pure. We never use preservatives, artificial colors, or synthetic sweeteners. Instead, we use imagination to create <strong style={{ color: "#FFD9A0" }}>120+ unique varieties</strong> of healthy, caffeine free "pick-me-ups" that far surpass standard coffee or soda.
                <br /><br />Whether you need a morning energy boost, a midday recovery, or a refreshing evening treat — our juices provide the <em style={{ color: "#FFD9A0" }}>"vim and verve"</em> to power your day.
              </p>
            <div style={{ display: "flex", gap: 10, marginTop: 20, flexWrap: "wrap" }}>
              {["🌿 No Preservatives", "🎨 No Artificial Colors", "☕ Caffeine Free", "120+ Varieties"].map(tag => (
                <span key={tag} style={{ background: "rgba(255,255,255,0.18)", color: "#fff", fontWeight: 700, padding: "5px 14px", borderRadius: 100, fontSize: 11, border: "1px solid rgba(255,255,255,0.15)" }}>{tag}</span>
              ))}
            </div>
          </motion.div>

          {/* Location selector */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            style={{ marginBottom: 32 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#4B2E2B", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>📍 Select Your Outlet</label>
            <select value={outletId} onChange={e => setOutletId(e.target.value)}
              style={{ width: "100%", padding: "14px 18px", border: "2px solid rgba(192,133,82,0.25)", borderRadius: 14, fontSize: 14, outline: "none", background: "white", appearance: "none", color: outletId ? "#2C1810" : "#9ca3af", cursor: "pointer" }}>
              <option value="">Choose the nearest outlet...</option>
              {outlets.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
            </select>
          </motion.div>

          {/* Menu section — gated by outlet selection */}
          <AnimatePresence mode="wait">
            {!outletId ? (
              <motion.div
                key="no-outlet"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4 }}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  minHeight: 320, textAlign: "center",
                  background: "white", borderRadius: 24,
                  border: "2px dashed rgba(192,133,82,0.25)",
                  padding: "48px 32px",
                }}>
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  style={{ fontSize: 56, marginBottom: 20 }}>
                  🍹
                </motion.div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#4B2E2B", marginBottom: 10 }}>
                  Pick your outlet first!
                </div>
                <p style={{ fontSize: 14, color: "#9ca3af", lineHeight: 1.7, maxWidth: 340, fontWeight: 400 }}>
                  Please select your nearest outlet above to browse our fresh menu and place your order.
                </p>
                <motion.div
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 6, color: "#C08552", fontSize: 13, fontWeight: 600 }}>
                  <span>👆</span> Select an outlet to see the menu
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4 }}>
                {menu.map((cat, ci) => {
                  const accent = CATEGORY_ACCENTS[cat.category] || "#4B2E2B";
                  return (
                    <motion.div key={cat.category} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: ci * 0.1 }} style={{ marginBottom: 28 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                        <div style={{ width: 4, height: 20, background: accent, borderRadius: 2 }} />
                        <div style={{ fontSize: 15, fontWeight: 800, color: "#2C1810" }}>{cat.category}</div>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
                        {cat.items.map((item, ii) => {
                          const qty = quantities[item.name] || 0;
                          return (
                            <motion.div key={item.name}
                              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: ii * 0.04 + ci * 0.1 }}
                              style={{ background: qty > 0 ? `rgba(255,255,255,0.75)` : "rgba(255,255,255,0.5)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", borderRadius: 16, padding: "12px", border: `1.5px solid ${qty > 0 ? accent : "rgba(192,133,82,0.15)"}`,
                                boxShadow: qty > 0 ? `0 4px 20px ${accent}22` : "none", transition: "all 0.2s", position: "relative", textAlign: "center" }}>
                              <div style={{
                                width: 70, height: 70, borderRadius: "50%", overflow: "hidden",
                                margin: "0 auto 12px", background: "#F5EDE0",
                                border: `2px solid ${qty > 0 ? accent : "rgba(192,133,82,0.2)"}`,
                                boxShadow: qty > 0 ? `0 4px 12px ${accent}33` : "0 2px 8px rgba(0,0,0,0.08)",
                                transition: "all 0.2s", flexShrink: 0,
                              }}>
                                <img src={item.image_url} alt={item.name}
                                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                  onError={(e) => { e.target.style.display = "none"; }} />
                              </div>
                              <div style={{ fontSize: 14, fontWeight: 700, color: "#2C1810", marginBottom: 12, lineHeight: 1.3 }}>{item.name}</div>
                              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#F5EDE0", borderRadius: 100, padding: "5px 10px" }}>
                                  <motion.button whileTap={{ scale: 0.8 }} onClick={() => setQty(item.name, -1)}
                                    style={{ width: 26, height: 26, borderRadius: "50%", background: qty > 0 ? accent : "#e4e4e7", border: "none", cursor: "pointer", color: qty > 0 ? "#fff" : "#9ca3af", fontWeight: 800, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}>
                                    <FiMinus size={12} />
                                  </motion.button>
                                  <AnimatePresence mode="wait">
                                    <motion.span key={qty} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }}
                                      style={{ fontSize: 14, fontWeight: 800, color: "#2C1810", minWidth: 18, textAlign: "center" }}>{qty}</motion.span>
                                  </AnimatePresence>
                                  <motion.button whileTap={{ scale: 0.8 }} onClick={() => setQty(item.name, 1)}
                                    style={{ width: 26, height: 26, borderRadius: "50%", background: accent, border: "none", cursor: "pointer", color: "#fff", fontWeight: 800, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}>
                                    <FiPlus size={12} />
                                  </motion.button>
                                </div>
                                <div style={{ fontSize: 15, fontWeight: 800, color: accent }}>₹{item.price}</div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right — sticky bill */}
        <div style={{ position: "sticky", top: 24 }}>
          <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
            style={{ background: "rgba(255,255,255,0.55)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", borderRadius: 24, border: "1px solid rgba(255,255,255,0.7)", overflow: "hidden", boxShadow: "0 8px 40px rgba(75,46,43,0.12)" }}>

            {/* Bill header */}
            <div style={{ background: "rgba(75,46,43,0.85)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", padding: "18px 24px", display: "flex", alignItems: "center", gap: 10 }}>
              <FiShoppingCart color="#E8C49A" size={16} />
              <div style={{ color: "#fff", fontWeight: 800, fontSize: 15 }}>Your Order</div>
              {totalQty > 0 && <span style={{ marginLeft: "auto", background: "#E8C49A", color: "#4B2E2B", borderRadius: 100, width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800 }}>{totalQty}</span>}
            </div>

            <div style={{ padding: 24 }}>
              {placed ? (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: "center", padding: "24px 0" }}>
                  <motion.div animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }} transition={{ duration: 0.6 }} style={{ fontSize: 48, marginBottom: 12 }}>🧃</motion.div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "#4B2E2B", marginBottom: 8 }}>Order Placed! Yay!</div>
                  <p style={{ fontSize: 13, color: "#9ca3af", lineHeight: 1.6 }}>We're squeezing it fresh just for you. See you soon, {customerName}!</p>
                  <motion.button whileHover={{ scale: 1.03 }}
                    style={{ marginTop: 20, background: "#4B2E2B", color: "#fff", border: "none", padding: "10px 24px", borderRadius: 100, fontSize: 13, fontWeight: 700, cursor: "pointer" }}
                    onClick={() => { setPlaced(false); setQuantities({}); setCustomerName(""); setCustomerPhone(""); setPickupTime(""); setOutletId(""); setOrderError(""); }}>
                    Order Again 🍹
                  </motion.button>
                </motion.div>
              ) : (
                <>
                  <AnimatePresence>
                    {cartItems.length === 0 ? (
                      <div style={{ textAlign: "center", padding: "32px 0", color: "#9ca3af" }}>
                        <div style={{ fontSize: 36, marginBottom: 8 }}>🛒</div>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>Add items to get started</div>
                      </div>
                    ) : (
                      <div style={{ marginBottom: 20 }}>
                        {cartItems.map(item => (
                          <motion.div key={item.name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
                            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(192,133,82,0.1)" }}>
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 600, color: "#2C1810" }}>{item.name}</div>
                              <div style={{ fontSize: 11, color: "#9ca3af" }}>x{quantities[item.name]} · ₹{item.price} each</div>
                            </div>
                            <div style={{ fontSize: 14, fontWeight: 800, color: "#4B2E2B" }}>₹{item.price * quantities[item.name]}</div>
                          </motion.div>
                        ))}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14, paddingTop: 14, borderTop: "2px solid rgba(192,133,82,0.15)" }}>
                          <div style={{ fontSize: 15, fontWeight: 800, color: "#4B2E2B" }}>Total</div>
                          <div style={{ fontSize: 20, fontWeight: 900, color: "#4B2E2B" }}>₹{total}</div>
                        </div>
                      </div>
                    )}
                  </AnimatePresence>

                  {/* Customer details */}
                  <div style={{ marginBottom: 12, display: "flex", flexDirection: "column", gap: 14 }}>
                    {[
                      { label: "Your Name", value: customerName, setter: setCustomerName, type: "text", placeholder: "e.g. Arun Kumar" },
                      { label: "Mobile Number", value: customerPhone, setter: setCustomerPhone, type: "tel", placeholder: "e.g. 9876543210" },
                    ].map(({ label, value, setter, type, placeholder }) => (
                      <div key={label} style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                        <label style={{ fontSize: 11, fontWeight: 700, color: "#8C5A3C", letterSpacing: 0.5, textTransform: "uppercase" }}>
                          {label}
                        </label>
                        <input type={type} value={value} onChange={e => setter(e.target.value)} placeholder={placeholder}
                          style={{ width: "100%", padding: "11px 14px", border: "1.5px solid rgba(192,133,82,0.35)", borderRadius: 10, fontSize: 13, outline: "none", boxSizing: "border-box", background: "rgba(255,255,255,0.75)" }} />
                      </div>
                    ))}

                    {/* Pickup Time — 20-min interval dropdown */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                      <label style={{ fontSize: 11, fontWeight: 700, color: "#8C5A3C", letterSpacing: 0.5, textTransform: "uppercase" }}>
                        Pick Up Time
                      </label>
                      <select value={pickupTime} onChange={e => setPickupTime(e.target.value)}
                        style={{ width: "100%", padding: "11px 14px", border: "1.5px solid rgba(192,133,82,0.35)", borderRadius: 10, fontSize: 13, outline: "none", boxSizing: "border-box", background: "rgba(255,255,255,0.75)", color: pickupTime ? "#2C1810" : "#9ca3af", appearance: "none", cursor: "pointer" }}>
                        <option value="">Select a pickup time...</option>
                        {Array.from({ length: 13 * 3 }).map((_, i) => {
                          const totalMins = 9 * 60 + i * 20;
                          if (totalMins > 22 * 60) return null;
                          const h = Math.floor(totalMins / 60);
                          const m = totalMins % 60;
                          const h12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
                          const ampm = h >= 12 ? "PM" : "AM";
                          const label = `${h12}:${m.toString().padStart(2, "0")} ${ampm}`;
                          const value = `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
                          return <option key={value} value={value}>{label}</option>;
                        })}
                      </select>
                    </div>
                  </div>

                  {orderError && (
                    <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "10px 14px", marginBottom: 12, color: "#dc2626", fontSize: 12 }}>
                      {orderError}
                    </div>
                  )}

                  <motion.button
                    onClick={handlePlaceOrder}
                    disabled={!outletId || !customerName || !customerPhone || !pickupTime || cartItems.length === 0 || placing}
                    animate={placing ? { scale: [1, 0.95, 1.02, 1], rotate: [0, -2, 2, 0] } : {}}
                    transition={{ duration: 0.4 }}
                    whileHover={(!placing && outletId && customerName && customerPhone && cartItems.length > 0) ? { scale: 1.03, boxShadow: "0 8px 28px rgba(75,46,43,0.3)" } : {}}
                    whileTap={{ scale: 0.96 }}
                    style={{
                      width: "100%", padding: "14px",
                      background: (!outletId || !customerName || !customerPhone || cartItems.length === 0)
                        ? "#e4e4e7"
                        : placing ? "#8C5A3C" : "linear-gradient(135deg, #4B2E2B, #8C5A3C)",
                      color: (!outletId || !customerName || !customerPhone || cartItems.length === 0) ? "#9ca3af" : "#fff",
                      border: "none", borderRadius: 100, fontSize: 14, fontWeight: 800,
                      cursor: (!outletId || !customerName || !customerPhone || cartItems.length === 0) ? "not-allowed" : "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      transition: "background 0.3s",
                    }}>
                    {placing ? (
                      <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} style={{ display: "inline-block", fontSize: 18 }}>🧃</motion.span>
                    ) : (
                      <><FiShoppingCart size={15} /> Place Your Order</>
                    )}
                  </motion.button>

                  {(!outletId || cartItems.length === 0) && (
                    <p style={{ fontSize: 11, color: "#9ca3af", textAlign: "center", marginTop: 8 }}>
                      {!outletId ? "👆 Select an outlet first" : "👆 Add at least one item"}
                    </p>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}