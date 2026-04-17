import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiChevronDown } from "react-icons/fi";
import { API_ENDPOINTS } from "../config/api";

const STATES = ["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Andaman & Nicobar Islands","Chandigarh","Dadra & Nagar Haveli and Daman & Diu","Delhi","Jammu & Kashmir","Ladakh","Lakshadweep","Puducherry"];

export default function FranchiseEnquiry() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", contact: "", state: "", city: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(API_ENDPOINTS.franchiseEnquiry, {
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
    <div style={{ minHeight: "100vh", background: "#FFF8F0" }}>
      {/* Header */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          background: "rgba(75, 46, 43, 0.97)",
          backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          padding: "0 48px", display: "flex", alignItems: "center",
          justifyContent: "space-between", height: 72, position: "sticky",
          top: 0, zIndex: 1000,
        }}>

        <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <img src="/logo.png" alt="" style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover", marginRight: 4 }} />
          <div>
            <div style={{ color: "#fff", fontFamily: "'Fraunces', serif", fontSize: 16, fontWeight: 700, lineHeight: 1.2 }}>Fruit Shop</div>
            <div style={{ color: "#E8C49A", fontSize: 11, fontWeight: 600 }}>On Greams Road</div>
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
          </li>

          <li><a onClick={() => { navigate("/"); setTimeout(() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" }), 100); }} style={{ color: "rgba(255,255,255,0.75)", fontWeight: 500, fontSize: 14, textDecoration: "none", cursor: "pointer" }}>About</a></li>
          <li><a onClick={() => { navigate("/"); setTimeout(() => document.getElementById("locations")?.scrollIntoView({ behavior: "smooth" }), 100); }} style={{ color: "rgba(255,255,255,0.75)", fontWeight: 500, fontSize: 14, textDecoration: "none", cursor: "pointer" }}>Locations</a></li>
          <li><a onClick={() => { navigate("/"); setTimeout(() => document.getElementById("reviews")?.scrollIntoView({ behavior: "smooth" }), 100); }} style={{ color: "rgba(255,255,255,0.75)", fontWeight: 500, fontSize: 14, textDecoration: "none", cursor: "pointer" }}>Reviews</a></li>
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
          { label: "Reviews", href: "reviews", isRoute: true },
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

      <div className="franchise-page-inner" style={{ maxWidth: 1100, margin: "0 auto", padding: "64px 48px", display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 80, alignItems: "start" }}>

        {/* Form side */}
        <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span style={{ display: "inline-block", background: "rgba(192,133,82,0.12)", color: "#4B2E2B", fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", padding: "6px 16px", borderRadius: 100, marginBottom: 16 }}>Franchise</span>
          <h2 style={{ fontSize: "clamp(32px,4vw,48px)", fontWeight: 900, color: "#4B2E2B", lineHeight: 1.15, marginBottom: 8 }}>
            Own a Slice of<br /><em style={{ color: "#C08552" }}>Tamil Nadu's Freshest</em>
          </h2>
          <p style={{ fontSize: 16, color: "#6B4A3A", fontWeight: 300, lineHeight: 1.7, marginBottom: 32 }}>
            30 years of trust, 13 thriving locations, and a brand that Chennai swears by.
            Bring the freshness to your city.
          </p>

          {submitted ? (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              style={{ textAlign: "center", padding: "48px 32px", background: "rgba(192,133,82,0.08)", borderRadius: 20, border: "1.5px solid rgba(192,133,82,0.25)" }}>
              <div style={{ fontSize: 52, marginBottom: 16 }}>🎉</div>
              <div style={{ fontSize: 22, color: "#4B2E2B", fontWeight: 700, marginBottom: 8 }}>Your dream just took a step closer!</div>
              <p style={{ color: "#6B4A3A", fontSize: 15, lineHeight: 1.6 }}>We've received your enquiry. Our team will squeeze some time to reach you shortly.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                {[["Name *", "name", "text", "Your full name"], ["Email *", "email", "email", "your@email.com"]].map(([label, key, type, ph]) => (
                  <div key={key}>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#4B2E2B", marginBottom: 7 }}>{label}</label>
                    <input required type={type} placeholder={ph} value={form[key]} onChange={set(key)}
                      style={{ width: "100%", padding: "13px 16px", border: "1.5px solid rgba(192,133,82,0.3)", borderRadius: 12, fontSize: 14, outline: "none", background: "white" }} />
                  </div>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#4B2E2B", marginBottom: 7 }}>Contact *</label>
                  <input required placeholder="+91 XXXXXXXXXX" value={form.contact} onChange={set("contact")}
                    style={{ width: "100%", padding: "13px 16px", border: "1.5px solid rgba(192,133,82,0.3)", borderRadius: 12, fontSize: 14, outline: "none", background: "white" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#4B2E2B", marginBottom: 7 }}>State *</label>
                  <select required value={form.state} onChange={set("state")}
                    style={{ width: "100%", padding: "13px 16px", border: "1.5px solid rgba(192,133,82,0.3)", borderRadius: 12, fontSize: 14, outline: "none", background: "white", appearance: "none" }}>
                    <option value="">Choose state</option>
                    {STATES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#4B2E2B", marginBottom: 7 }}>Interested City / Location *</label>
                <input required placeholder="City or identified location" value={form.city} onChange={set("city")}
                  style={{ width: "100%", padding: "13px 16px", border: "1.5px solid rgba(192,133,82,0.3)", borderRadius: 12, fontSize: 14, outline: "none", background: "white" }} />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#4B2E2B", marginBottom: 7 }}>Message</label>
                <textarea placeholder="Tell us about yourself and why you'd be a great franchise partner..." value={form.message} onChange={set("message")}
                  style={{ width: "100%", padding: "13px 16px", border: "1.5px solid rgba(192,133,82,0.3)", borderRadius: 12, fontSize: 14, outline: "none", background: "white", minHeight: 110, resize: "vertical" }} />
              </div>
              {error && (
                <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "10px 16px", marginBottom: 16, color: "#dc2626", fontSize: 13 }}>
                  {error}
                </div>
              )}
              <motion.button type="submit" disabled={loading} whileHover={{ y: -2, boxShadow: "0 12px 32px rgba(75,46,43,0.25)" }} whileTap={{ scale: 0.97 }}
                style={{ width: "100%", background: loading ? "#8C5A3C" : "#4B2E2B", color: "#fff", border: "none", padding: "15px 40px", borderRadius: 100, fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer" }}>
                {loading ? "Submitting..." : "Submit Franchise Enquiry →"}
              </motion.button>
            </form>
          )}
        </motion.div>

        {/* Brand side */}
        <motion.div initial={{ opacity: 0, x: 32 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
          style={{ background: "#4B2E2B", borderRadius: 32, padding: "48px 32px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 22, position: "sticky", top: 100 }}>
          <div style={{ width: 140, height: 140, borderRadius: "50%", background: "white", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 16px 48px rgba(0,0,0,0.25)", border: "5px solid rgba(232,196,154,0.35)" }}>
            <img src="/logo.png" alt="Logo" style={{ width: 110, height: 110, borderRadius: "50%", objectFit: "cover" }} />
          </div>
          <div style={{ fontSize: 26, fontWeight: 900, color: "white", lineHeight: 1.2 }}>Fruit Shop<br />on Greams Road</div>
          <div style={{ fontSize: 12, color: "#E8C49A", fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase" }}>Est. 1992 · Tamil Nadu</div>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.8, fontWeight: 300 }}>Pure, natural, full-bodied, nothing artificial. Other outlets use reconstituted juice and add preservatives. We never will.</p>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8 }}>
            {["100% Natural", "No Preservatives", "No Gas Added", "Fresh Daily", "30+ Yrs Trust"].map(b => (
              <span key={b} style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.85)", padding: "6px 14px", borderRadius: 100, fontSize: 11, fontWeight: 600, border: "1px solid rgba(255,255,255,0.15)" }}>{b}</span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}