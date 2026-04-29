import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { FiCalendar, FiUsers, FiMapPin, FiTruck, FiCoffee, FiStar, FiZap } from "react-icons/fi";
import { API_ENDPOINTS } from "../config/api";

const STALL_MENU = [
  { category: "Fresh Fruit Juices", items: [
    { name: "Lime Mint Cooler", price: 80, img: "/menu/mint.jpg" },
    { name: "California Quencher", price: 80, img: "/menu/california-quencher.png" },
    { name: "Pink Panther", price: 120, img: "/menu/pink-panther.png" },
    { name: "Orange Punch", price: 120, img: "/menu/orange-punch.png" },
    { name: "Sunshine Juice", price: 130, img: "/menu/sunshine-juice.png" },
  ]},
  { category: "Ice Cream Milkshakes", items: [
    { name: "Strawberry Milkshake", price: 100, img: "/menu/strawberry-milkshake.jpg" },
    { name: "Vanilla Milkshake", price: 100, img: "/menu/vanilla-milkshake.jpg" },
    { name: "Chocolate Milkshake", price: 120, img: "/menu/chocolate-milkshake.jpg" },
    { name: "Kolkofe (No Icecream)", price: 110, img: "/menu/kolkofe.png" },
  ]},
  { category: "Fresh Fruit Shakes", items: [
    { name: "Jughead Special", price: 140, img: "/menu/jughead.png" },
    { name: "Fresh Mango Milkshake", price: 140, img: "/menu/mango.png" },
  ]},
];

export default function StallEnquiry() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", contact: "", eventType: "", date: "", guests: "", venue: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(API_ENDPOINTS.stallEnquiry, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="stall-bg-page">
      {/* Header */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          background: "rgba(30, 15, 10, 0.24)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.14)",
          padding: "0 48px", display: "flex", alignItems: "center",
          justifyContent: "space-between", height: 72, position: "sticky",
          top: 0, zIndex: 1000,
        }}>

        <a href="/" style={{ display: "flex", alignItems: "center", gap: 2, textDecoration: "none" }}>
          <img src="/logo.png" alt="" style={{ width: 55, height: 55, borderRadius: "50%", objectFit: "cover", marginRight: 3 }} />
          <div>
            <img src="/logo-name.png" alt="Fruit Shop on Greams Road" style={{ height: 55, width: "auto", marginTop: 4 }} />
          </div>
        </a>

        <ul style={{ display: "flex", alignItems: "center", gap: 32, listStyle: "none", margin: 0, padding: 0 }} className="nav-links">
          <li><a onClick={() => { navigate("/"); setTimeout(() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" }), 100); }} style={{ color: "#ffffff", fontWeight: 600, fontSize: 14, textDecoration: "none", cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>Menu</a></li>

          <li style={{ position: "relative" }}
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}>
            <button style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, color: "#ffffff", fontWeight: 600, fontSize: 14, padding: 0, fontFamily: "'Poppins', sans-serif" }}>
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
                  style={{ position: "absolute", top: "calc(100% + 12px)", left: "50%", transform: "translateX(-50%)",background: "rgba(30, 15, 10, 0.44)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 16, padding: "8px", minWidth: 210, zIndex: 2000 }}>
                  {[
                    { label: "🍹 Pick Me Up", path: "/pickup", sub: "Order fresh to your location" },
                    { label: "🏪 Stall Enquiry", path: "/stall", sub: "Book us for your event" },
                    { label: "🤝 Franchise", path: "/franchise", sub: "Open your own outlet" },
                  ].map(({ label, path, sub }) => (
                    <motion.div key={label} whileHover={{ background: "rgba(255,255,255,0.08)", x: 3 }}
                      onClick={() => { navigate(path); setServicesOpen(false); }}
                      style={{ padding: "10px 14px", borderRadius: 10, cursor: "pointer" }}>
                      <div style={{ color: "#fff", fontWeight: 700, fontSize: 14, fontFamily: "'Merienda', serif" }}>{label}</div>
                      <div style={{ color: "rgba(255,255,255,0.82)", fontSize: 12, marginTop: 2, fontWeight: 600, fontFamily: "'Poppins', sans-serif", textWrap: "nowrap" }}>{sub}</div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </li>

          <li><a onClick={() => { navigate("/"); setTimeout(() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" }), 100); }} style={{ color: "#ffffff", fontWeight: 600, fontSize: 14, textDecoration: "none", cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>About</a></li>
          <li><a onClick={() => { navigate("/"); setTimeout(() => document.getElementById("locations")?.scrollIntoView({ behavior: "smooth" }), 100); }} style={{ color: "#ffffff", fontWeight: 600, fontSize: 14, textDecoration: "none", cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>Locations</a></li>
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
            ? <div key={label} style={{ fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "1.5px", padding: "14px 16px 4px", fontFamily: "'Poppins', sans-serif" }}>{label}</div>
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
                  style={{ textDecoration: "none", color: "#fff", fontSize: "15px", fontWeight: 600, padding: "10px 16px", borderRadius: "10px", display: "block", background: "none", border: "none", cursor: "pointer", width: "100%", textAlign: "left", fontFamily: "'Poppins', sans-serif" }}>
                  {label}
                </button>
              : <a key={label} href={href} onClick={() => setMenuOpen(false)}
                  style={{ textDecoration: "none", color: "#fff", fontSize: "15px", fontWeight: 600, padding: "10px 16px", borderRadius: "10px", display: "block", fontFamily: "'Poppins', sans-serif" }}>{label}</a>
        )}
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "64px 48px" }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ textAlign: "center", marginBottom: 56 }}>
          <span style={{ display: "inline-block", background: "rgba(192,133,82,0.42)", color: "#4B2E2B", fontSize: 14, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", padding: "6px 16px", borderRadius: 100, marginBottom: 16, fontFamily: "'Poppins', sans-serif" }}>Stall Enquiry</span>
          <h2 style={{ fontSize: "clamp(32px,4vw,52px)", fontWeight: 900, color: "#4B2E2B", lineHeight: 1.15, marginBottom: 12, fontFamily: "'Merienda', serif", letterSpacing: "-0.3px" }}>
            Bring the Freshness<br /><em style={{ color: "#C08552", fontStyle: "italic" }}>To Your Event</em>
          </h2>
          <p style={{ fontSize: 16, color: "#fff", fontWeight: 600, lineHeight: 1.7, maxWidth: 560, margin: "0 auto", fontFamily: "'Poppins', sans-serif", textShadow: "0 1px 4px rgba(0,0,0,0.2)" }}>
            Corporate events, weddings, college fests — we set up, squeeze fresh, and make your crowd smile. Book a stall today.
          </p>
        </motion.div>

        <div className="stall-page-inner" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start" }}>

          {/* Menu price list */}
          <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#4B2E2B", textTransform: "uppercase", letterSpacing: 2, marginBottom: 20, display: "flex", alignItems: "center", gap: 8, fontFamily: "'Poppins', sans-serif" }}>
              <FiCoffee size={15} color="#4B2E2B" /> Stall Menu & Pricing
            </div>

            {/* Category tabs */}
            <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
              {STALL_MENU.map((cat, i) => (
                <button key={i} onClick={() => setActiveTab(i)}
                  style={{ padding: "7px 16px", borderRadius: 100, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700, transition: "all 0.2s", fontFamily: "'Poppins', sans-serif",
                    background: activeTab === i ? "#4B2E2B" : "rgba(192,133,82,0.15)",
                    color: activeTab === i ? "#fff" : "#fff" }}>
                  {cat.category}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={activeTab}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                style={{ background: "rgba(255,255,255,0.55)", backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)", borderRadius: 20, overflow: "hidden", border: "1px solid rgba(255,255,255,0.65)" }}>
                <div style={{ background: "#4B2E2B", padding: "14px 20px" }}>
                  <div style={{ color: "#E8C49A", fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, fontFamily: "'Merienda', serif" }}>{STALL_MENU[activeTab].category}</div>
                </div>
                {STALL_MENU[activeTab].items.map((item, i) => (
                  <motion.div key={item.name}
                    initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                    style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
                      padding: "12px 20px", borderBottom: i < STALL_MENU[activeTab].items.length - 1 ? "1px solid rgba(192,133,82,0.1)" : "none", gap: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 10, overflow: "hidden", flexShrink: 0, background: "#F5EDE0" }}>
                      <img src={item.img} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { e.target.style.display = "none"; }} />
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: "#1a0f0d", flex: 1, fontFamily: "'Poppins', sans-serif" }}>{item.name}</div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: "#4B2E2B", background: "rgba(192,133,82,0.1)", padding: "4px 12px", borderRadius: 100, flexShrink: 0, fontFamily: "'Poppins', sans-serif" }}>₹{item.price}</div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Stall highlights */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 24 }}>
              {[
                [<FiTruck size={20} color="#4B2E2B" />,   "Event Setup",   "We bring everything"],
                [<FiCoffee size={20} color="#C08552" />,  "Live Juicing",  "Fresh squeezed on-site"],
                [<FiStar size={20} color="#cbc213" />,    "Trained Staff", "Friendly & professional"],
                [<FiZap size={20} color="#8C5A3C" />,     "Fast Service",  "No long queues"],
              ].map(([icon, title, desc]) => (
                <div key={title} style={{ background: "rgba(255,255,255,0.5)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", border: "1px solid rgba(255,255,255,0.65)", borderRadius: 16, padding: "16px" }}>
                  <div style={{ marginBottom: 6 }}>{icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#4B2E2B", fontFamily: "'Poppins', sans-serif" }}>{title}</div>
                  <div style={{ fontSize: 11, color: "#36454F", fontWeight: 600, fontFamily: "'Poppins', sans-serif" }}>{desc}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Enquiry form */}
          <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
            <div style={{ background: "rgba(255,255,255,0.5)", backdropFilter: "blur(22px)", WebkitBackdropFilter: "blur(22px)", borderRadius: 24, padding: 32, border: "1px solid rgba(255,255,255,0.7)", boxShadow: "0 8px 40px rgba(75,46,43,0.12)" }}>
              <div style={{ fontSize: 18, fontWeight: 900, color: "#4B2E2B", marginBottom: 24, fontFamily: "'Merienda', serif", letterSpacing: "0.2px" }}>Book a Stall for Your Event</div>

              {submitted ? (
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ textAlign: "center", padding: "40px 20px" }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>🎪</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: "#4B2E2B", marginBottom: 8, fontFamily: "'Merienda', serif" }}>Your stall is as good as booked!</div>
                  <p style={{ color: "#6B4A3A", fontSize: 14, lineHeight: 1.6, fontWeight: 600, fontFamily: "'Poppins', sans-serif" }}>Our events team will contact you within 24 hours to confirm the freshest stall your event has ever seen.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {[["Name *", "name", "text", "Your full name"], ["Email *", "email", "email", "your@email.com"]].map(([label, key, type, ph]) => (
                    <div key={key} style={{ marginBottom: 16 }}>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: "#4B2E2B", marginBottom: 7, textTransform: "uppercase", letterSpacing: 0.5, fontFamily: "'Poppins', sans-serif" }}>{label}</label>
                      <input required type={type} placeholder={ph} value={form[key]} onChange={set(key)}
                        style={{ width: "100%", padding: "12px 16px", border: "1.5px solid rgba(192,133,82,0.25)", borderRadius: 12, fontSize: 14, outline: "none", boxSizing: "border-box", background: "rgba(255,255,255,0.65)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", fontFamily: "'Poppins', sans-serif", fontWeight: 500 }} />
                    </div>
                  ))}
                  <div className="stall-form-grid-2col" style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 14, marginBottom: 16 }}>
                    <div>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: "#4B2E2B", marginBottom: 7, textTransform: "uppercase", letterSpacing: 0.5, fontFamily: "'Poppins', sans-serif" }}>Contact *</label>
                      <input required placeholder="+91 XXXXXXXXXX" value={form.contact} onChange={set("contact")}
                        style={{ width: "100%", padding: "12px 16px", border: "1.5px solid rgba(192,133,82,0.25)", borderRadius: 12, fontSize: 14, outline: "none",background: "rgba(255,255,255,0.65)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", boxSizing: "border-box", fontFamily: "'Poppins', sans-serif", fontWeight: 500 }} />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: "#4B2E2B", marginBottom: 7, textTransform: "uppercase", letterSpacing: 0.5, fontFamily: "'Poppins', sans-serif" }}>Event Type *</label>
                      <select required value={form.eventType} onChange={set("eventType")}
                        style={{ width: "100%", padding: "12px 16px", border: "1.5px solid rgba(192,133,82,0.25)", borderRadius: 12, fontSize: 14, outline: "none", appearance: "none", background: "rgba(255,255,255,0.65)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", boxSizing: "border-box", fontFamily: "'Poppins', sans-serif", fontWeight: 500 }}>
                        <option value="">Select type</option>
                        {["Corporate Event", "Wedding", "College Fest", "School Event", "Exhibition", "Sports Event", "Other"].map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="stall-form-grid-2col" style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 14, marginBottom: 16 }}>
                    <div>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: "#4B2E2B", marginBottom: 7, textTransform: "uppercase", letterSpacing: 0.5, fontFamily: "'Poppins', sans-serif" }}><FiCalendar size={12} style={{ marginRight: 4 }} />Event Date *</label>
                      <input required type="date" value={form.date} onChange={set("date")} min={new Date().toISOString().split("T")[0]}
                        style={{ width: "100%", padding: "12px 16px", border: "1.5px solid rgba(192,133,82,0.25)", borderRadius: 12, fontSize: 14, outline: "none",background: "rgba(255,255,255,0.65)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", boxSizing: "border-box", fontFamily: "'Poppins', sans-serif", fontWeight: 500 }} />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: "#4B2E2B", marginBottom: 7, textTransform: "uppercase", letterSpacing: 0.5, fontFamily: "'Poppins', sans-serif" }}><FiUsers size={12} style={{ marginRight: 4 }} />Expected Guests *</label>
                      <input required type="number" placeholder="e.g. 500" value={form.guests} onChange={set("guests")}
                        style={{ width: "100%", padding: "12px 16px", border: "1.5px solid rgba(192,133,82,0.25)", borderRadius: 12, fontSize: 14, outline: "none",background: "rgba(255,255,255,0.65)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", boxSizing: "border-box", fontFamily: "'Poppins', sans-serif", fontWeight: 500 }} />
                    </div>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: "#4B2E2B", marginBottom: 7, textTransform: "uppercase", letterSpacing: 0.5, fontFamily: "'Poppins', sans-serif" }}><FiMapPin size={12} style={{ marginRight: 4 }} />Venue / City *</label>
                    <input required placeholder="Event venue and city" value={form.venue} onChange={set("venue")}
                      style={{ width: "100%", padding: "12px 16px", border: "1.5px solid rgba(192,133,82,0.25)", borderRadius: 12, fontSize: 14,background: "rgba(255,255,255,0.65)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", outline: "none", fontFamily: "'Poppins', sans-serif", fontWeight: 500 }} />
                  </div>
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: "#4B2E2B", marginBottom: 7, textTransform: "uppercase", letterSpacing: 0.5, fontFamily: "'Poppins', sans-serif" }}>Additional Notes</label>
                    <textarea placeholder="Any specific requirements, theme, or details..." value={form.message} onChange={set("message")}
                      style={{ width: "100%", padding: "12px 16px", border: "1.5px solid rgba(192,133,82,0.25)", borderRadius: 12, fontSize: 14, outline: "none", minHeight: 90,background: "rgba(255,255,255,0.65)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", resize: "vertical", fontFamily: "'Poppins', sans-serif", fontWeight: 500 }} />
                  </div>
                  {error && (
                    <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "10px 16px", marginBottom: 16, color: "#dc2626", fontSize: 13, fontWeight: 600, fontFamily: "'Poppins', sans-serif" }}>
                      {error}
                    </div>
                  )}
                  <motion.button type="submit" disabled={loading} whileHover={{ y: -2, boxShadow: "0 12px 32px rgba(75,46,43,0.25)" }} whileTap={{ scale: 0.97 }}
                    style={{ width: "100%", background: loading ? "#8C5A3C" : "#4B2E2B", color: "#fff", border: "none", padding: "14px 40px", borderRadius: 100, fontSize: 15, fontWeight: 800, cursor: loading ? "not-allowed" : "pointer", fontFamily: "'Poppins', sans-serif", letterSpacing: "0.3px" }}>
                    {loading ? "Submitting..." : "Book a Stall 🎪"}
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}