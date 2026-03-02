import { useState } from "react";
import { FaInstagram, FaLinkedinIn } from "react-icons/fa";
import "../App.css";

const FRUIT_IMGS = {
  mango:      "/fruits/mango.jpg",
  orange:     "/fruits/orange.jpg",
  strawberry: "/fruits/strawberry.jpg",
  kiwi:       "/fruits/kiwi.jpg",
  watermelon: "/fruits/watermelon.jpg",
  avocado:    "/fruits/avocado.jpg",
  pineapple:  "/fruits/pineapple.jpg",
  grape:      "/fruits/grape.jpg",
  cherry:     "/fruits/cherry.jpg",
};

const products = [
  {
    img: "/menu/jughead.png",
    name: "Jughead Special",
    tag: "Most Popular",
    desc: "Their legendary signature shake — a rich blend of dried fruits and ice cream. The one everyone orders first.",
    bg: "#fff3e0",
    alt: "Jughead Special shake"
  },
  {
    img: "/menu/coconut.jpg",
    name: "Tender Coconut Pudding",
    tag: "Fan Favourite",
    desc: "Silky, fresh, melt-in-mouth coconut pudding. The dessert Chennai can't stop talking about.",
    bg: "#e8f5e9",
    alt: "Tender Coconut Pudding"
  },
  {
    img: "/menu/mint.jpg",
    name: "Mint Lime Cooler",
    tag: "Refreshing",
    desc: "Zesty lime and fresh mint. Pro tip — tastes even better without sugar.",
    bg: "#e0f2f1",
    alt: "Mint Lime Cooler"
  },
  {
    img: "/menu/falooda.jpg",
    name: "Falooda",
    tag: "Classic",
    desc: "Chilled layers of vermicelli, rose syrup, basil seeds and fruit jelly. A Chennai staple.",
    bg: "#fce4ec",
    alt: "Falooda"
  },
  {
    img: "/menu/caramel.jpg",
    name: "Caramel Custard Pudding",
    tag: "Dessert",
    desc: "Silky, rich caramel custard — just the right amount of sweetness. A must-try.",
    bg: "#fff8e1",
    alt: "Caramel Custard Pudding"
  },
  {
    img: "/menu/mango.png",
    name: "Fresh Mango Juice",
    tag: "Seasonal",
    desc: "Pure, thick Alphonso mango juice. No water, no sugar — just mango at peak ripeness.",
    bg: "#fffde7",
    alt: "Fresh Mango Juice"
  },
  {
    img: "/menu/fruitcup.jpg",
    name: "Fruit in a Cup",
    tag: "Healthy",
    desc: "A generous bowl of fresh seasonal fruits, served chilled. Simple, honest, and refreshing.",
    bg: "#f3e5f5",
    alt: "Fruit in a Cup"
  },
  {
    img: "/menu/smoothie.jpg",
    name: "Fresh Fruit Smoothie",
    tag: "Signature",
    desc: "Thick blended seasonal fruits — no artificial flavors, no gas, no shortcuts. Pure fruit.",
    bg: "#ede7f6",
    alt: "Fresh Fruit Smoothie"
  },
];

const outlets = [
  { num: "01", name: "Thousand Lights", area: "Greams Road", city: "Chennai", address: "11, Greams Road, Thousand Lights, Chennai, Tamil Nadu – 600006", flag: "flagship", map: "https://www.google.com/maps/search/?api=1&query=Fruit+Shop+On+Greams+Road+11+Greams+Road+Thousand+Lights+Chennai" },
  { num: "02", name: "Anna Nagar", area: "", city: "Chennai", address: "AH Block, 4th Avenue, Anna Nagar East, Chennai, Tamil Nadu – 600040", map: "https://www.google.com/maps/search/?api=1&query=Fruit+Shop+On+Greams+Road+Anna+Nagar+East+Chennai" },
  { num: "03", name: "T. Nagar", area: "", city: "Chennai", address: "2, Rajan Street, T. Nagar, Chennai, Tamil Nadu – 600017", map: "https://www.google.com/maps/search/?api=1&query=Fruit+Shop+On+Greams+Road+Rajan+Street+T+Nagar+Chennai" },
  { num: "04", name: "Egmore", area: "", city: "Chennai", address: "Opposite Commissioner Office, Pantheon Road, Egmore, Chennai, Tamil Nadu – 600008", map: "https://www.google.com/maps/search/?api=1&query=Fruit+Shop+On+Greams+Road+Egmore+Pantheon+Road+Chennai" },
  { num: "05", name: "Besant Nagar", area: "", city: "Chennai", address: "21, 3rd Avenue, Besant Nagar, Chennai, Tamil Nadu – 600090", map: "https://www.google.com/maps/search/?api=1&query=Fruit+Shop+On+Greams+Road+Besant+Nagar+Chennai" },
  { num: "06", name: "Kilpauk", area: "", city: "Chennai", address: "Harleys Road / Kilpauk area, Chennai, Tamil Nadu", map: "https://www.google.com/maps/search/?api=1&query=Fruit+Shop+On+Greams+Road+Kilpauk+Chennai" },
  { num: "07", name: "Kodambakkam", area: "", city: "Chennai", address: "Jain Antariksha Apartments area, Kodambakkam, Chennai, Tamil Nadu", map: "https://www.google.com/maps/search/?api=1&query=Fruit+Shop+On+Greams+Road+Kodambakkam+Chennai" },
  { num: "08", name: "Cathedral Road", area: "Gopalapuram", city: "Chennai", address: "Cathedral Road, Gopalapuram, Chennai, Tamil Nadu", map: "https://www.google.com/maps/search/?api=1&query=Fruit+Shop+On+Greams+Road+Cathedral+Road+Chennai" },
  { num: "09", name: "Perungudi", area: "Kandanchavadi", city: "Chennai", address: "MGR Main Road / Kandanchavadi, Perungudi, Chennai, Tamil Nadu", map: "https://www.google.com/maps/search/?api=1&query=Fruit+Shop+On+Greams+Road+Perungudi+Chennai" },
  { num: "10", name: "Santhome", area: "Pattinapakkam", city: "Chennai", address: "Pattinapakkam / Santhome area, Chennai, Tamil Nadu", map: "https://www.google.com/maps/search/?api=1&query=Fruit+Shop+On+Greams+Road+Santhome+Chennai" },
  { num: "11", name: "Iyyappanthangal", area: "", city: "Chennai", address: "Poonamallee High Road, Iyyappanthangal, Chennai, Tamil Nadu", map: "https://www.google.com/maps/search/?api=1&query=Fruit+Shop+On+Greams+Road+Iyyappanthangal+Chennai" },
  { num: "12", name: "Race Course", area: "Gopalapuram", city: "Coimbatore", address: "127, Thirugnanasambandam Road, Race Course, Gopalapuram, Coimbatore, Tamil Nadu – 641018", flag: "coimbatore", map: "https://www.google.com/maps/search/?api=1&query=Fruit+Shop+On+Greams+Road+Race+Course+Coimbatore" },
  { num: "13", name: "Puducherry", area: "Heritage Town", city: "Puducherry", address: "Mango Tree Food Court, Sri Aurobindo Street, Heritage Town, Puducherry – 605001", flag: "puducherry", map: "https://www.google.com/maps/search/?api=1&query=Fruit+Shop+On+Greams+Road+Sri+Aurobindo+Street+Puducherry" },
];

const reviews = [
  { stars: 5, text: "Been coming here since my college days in the 90s. The quality has never dipped — ever. The pomegranate juice is something else entirely.", name: "Karthik S.", tag: "Regular since 1998", avatar: "🧑" },
  { stars: 5, text: "You can smell the freshness the moment you walk in. No artificial flavors, no shortcuts. This is what a juice shop should be.", name: "Priya N.", tag: "Health enthusiast", avatar: "👩" },
  { stars: 5, text: "Their quirky banner puns keep me coming back almost as much as the mango shake does. Chennai institution, truly.", name: "Arun M.", tag: "Food blogger", avatar: "👨‍💻" },
  { stars: 5, text: "The Blue Dot Special is a revelation. I have no idea what goes in it but I've ordered it 47 times.", name: "Deepa R.", tag: "Loyal customer", avatar: "👩‍🦱" },
  { stars: 5, text: "Took my daughter here for the first time and she immediately declared it the best place in Chennai. She's not wrong.", name: "Sundar K.", tag: "Parent & fan", avatar: "👨" },
  { stars: 5, text: "The coconut pudding! The coconut pudding! The coconut pudding! That's all I need to say.", name: "Meera T.", tag: "Dessert lover", avatar: "👩‍🦰" },
];

const LOGO_URL = "https://lh3.googleusercontent.com/p/AF1QipOv1gahWILGcuRlXmFXMIEjfhFBn0Gg9oGEdPU=s400";

function FlagBadge({ flag }) {
  if (!flag) return null;
  const map = { flagship: ["Flagship", "flagship"], coimbatore: ["Coimbatore", "other"], puducherry: ["Puducherry", "other"] };
  const [label, cls] = map[flag] || ["", "other"];
  return <span className={`outlet-flag ${cls}`}>{label}</span>;
}

export default function FruitShopLanding() {
  const [form, setForm] = useState({ name: "", email: "", contact: "", state: "", city: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [logoErr, setLogoErr] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSubmit = (e) => { e.preventDefault(); setSubmitted(true); };
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <>
      {/* ── NAVBAR ── */}
      <nav className="nav">
        <a href="#" className="nav-logo">
            <img src="/logo.png" alt="" style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover", verticalAlign: "middle", marginRight: 4 }} />
            <div>
            <div className="nav-logo-text">Fruit Shop</div>
            <div className="nav-logo-sub">On Greams Road</div>
            </div>
        </a>
        <ul className="nav-links">
            <li><a href="#products">Menu</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#locations">Locations</a></li>
            <li><a href="#reviews">Reviews</a></li>
            <li><a href="#franchise">Contact</a></li>
        </ul>
        <div
            role="button"
            tabIndex={0}
            aria-label="Menu"
            className="mobile-hamburger"
            onClick={() => setMenuOpen(true)}
            style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
            padding: '8px',
            cursor: 'pointer',
            background: 'none',
            border: 'none',
            zIndex: 1070,
            }}
        >
            <div style={{ width: '24px', height: '3px', backgroundColor: '#0f4025', borderRadius: '2px' }}></div>
            <div style={{ width: '24px', height: '3px', backgroundColor: '#0f4025', borderRadius: '2px' }}></div>
            <div style={{ width: '24px', height: '3px', backgroundColor: '#0f4025', borderRadius: '2px' }}></div>
        </div>
        </nav>

        {/* Mobile menu overlay */}
        {menuOpen && (
        <div
            style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', zIndex: 9998,
            }}
            onClick={() => setMenuOpen(false)}
        />
        )}

        {/* Mobile slide menu */}
        <div
        style={{
            position: 'fixed', top: 0, right: 0, bottom: 0,
            width: '280px',
            background: '#0f4025',
            zIndex: 9999,
            transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
            transition: 'transform 0.3s ease',
            padding: '80px 32px 24px',
            boxShadow: menuOpen ? '-4px 0 20px rgba(0,0,0,0.3)' : 'none',
            display: 'flex', flexDirection: 'column', gap: '8px',
        }}
        >
        <button
            onClick={() => setMenuOpen(false)}
            style={{
            position: 'absolute', top: '20px', right: '20px',
            background: 'none', border: 'none', fontSize: '20px',
            cursor: 'pointer', color: '#ffffff', lineHeight: 1,
            }}
        >
            ✕
        </button>
        {[
            ["#products", "Menu"],
            ["#about", "About"],
            ["#locations", "Locations"],
            ["#reviews", "Reviews"],
            ["#franchise", "Contact"],
        ].map(([href, label]) => (
            <a
            key={href}
            href={href}
            onClick={() => setMenuOpen(false)}
            style={{
                textDecoration: 'none',
                color: '#ffffff',
                fontSize: '16px',
                fontWeight: 600,
                padding: '12px 16px',
                borderRadius: '10px',
                display: 'block',
            }}
            >
            {label}
            </a>
        ))}
        </div>

        {/* Hamburger button */}
        <div
          role="button"
          tabIndex={0}
          aria-label="Menu"
          className="mobile-hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: menuOpen ? 'none' : 'flex',
            flexDirection: 'column',
            gap: '5px',
            padding: '8px',
            cursor: 'pointer',
            background: 'none',
            border: 'none',
            zIndex: 1070,
          }}
        >
        <div style={{ width: '24px', height: '3px', backgroundColor: '#0f4025', borderRadius: '2px' }}></div>
        <div style={{ width: '24px', height: '3px', backgroundColor: '#0f4025', borderRadius: '2px' }}></div>
        <div style={{ width: '24px', height: '3px', backgroundColor: '#0f4025', borderRadius: '2px' }}></div>
      </div>

    {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">Since 1994</div>
          <h1 className="hero-title">
            Pure Fruits,
            <em className="hero-title-accent">Pure Joy.</em>
          </h1>
          <p className="hero-subtitle">
            No artificial colors. No fake flavoring. No gas in our juices. Just the freshest
            fruits Chennai has to offer — squeezed to perfection. Because that's how we roll.
          </p>
        </div>

        <div className="hero-visual">
          <div className="hero-fruit-grid">
            {[
              { src: FRUIT_IMGS.mango, label: "Mango", alt: "Fresh ripe mango" },
              { src: FRUIT_IMGS.orange, label: "Orange", alt: "Fresh Valencia orange" },
              { src: FRUIT_IMGS.strawberry, label: "Strawberry", alt: "Fresh strawberry" },
              { src: FRUIT_IMGS.kiwi, label: "Kiwi", alt: "Fresh kiwi fruit" },
            ].map(({ src, label, alt }) => (
              <div className="fruit-card-mini" key={label}>
                <img src={src} alt={alt} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>
            ))}
          </div>

          <div className="hero-stats">
            <div className="stat"><div className="stat-num">30+</div><div className="stat-label">Years</div></div>
            <div className="stat"><div className="stat-num">13</div><div className="stat-label">Outlets</div></div>
            <div className="stat"><div className="stat-num">50+</div><div className="stat-label">Flavours</div></div>
            <div className="stat"><div className="stat-num">100%</div><div className="stat-label">Natural</div></div>
          </div>
        </div>
      </section>

      {/* ── PRODUCTS ── */}
      <section className="products" id="products">
        <div className="products-header">
          <span className="section-label">Our Menu</span>
          <h2 className="section-title">Freshly Squeezed,<br /><em>Every Single Time</em></h2>
          <p className="section-subtitle">From classic juices to signature specials, every sip is made from fruits sourced daily from local sellers.</p>
        </div>
        <div className="products-grid">
          {products.map((p) => (
            <div className="product-card" key={p.name}>
              <div className="product-img" style={{ background: p.bg }}>
                <img src={p.img} alt={p.alt} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
              </div>
              <div className="product-body">
                <span className="product-tag">{p.tag}</span>
                <div className="product-name">{p.name}</div>
                <p className="product-desc">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section className="about" id="about">
        <span className="section-label">Our Story</span>
        <h2 className="section-title">From a Small Shop<br /><em style={{ color: '#f5c842' }}>to a Chennai Icon</em></h2>
        <p className="about-text">
          Harris Abdulla and Mohammed Salim walked away from their timber business in 1994 with one dream: serve the freshest, most honest juice in Chennai. They found a small commercial space on Greams Road, and the rest is history.
        </p>
        <p className="about-text">
          Today, Fruit Shop on Greams Road has 13 locations across Tamil Nadu — from Greams Road to Coimbatore to Puducherry — and still holds the same promise: no fake coloring, no fake flavoring, no gas in our juices. Every outlet replicates that original first-store experience.
        </p>
        <div className="about-pillars">
          {[
            ["🌱", "No Shortcuts", "We source locally and serve freshly — every single day."],
            ["💡", "Keep Innovating", "New specials, quirky names, unexpected twists."],
            ["🤝", "Stay Simple", "Great ambience doesn't need to be complicated."],
            ["📍", "Keep Expanding", "13 locations and still replicating that first-store magic."],
          ].map(([icon, title, desc]) => (
            <div className="pillar" key={title}>
              <div className="pillar-icon">{icon}</div>
              <div className="pillar-title">{title}</div>
              <div className="pillar-desc">{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── LOCATIONS ── */}
      <section className="locations" id="locations">
        <div className="locations-header">
          <span className="section-label">Find Us</span>
          <h2 className="section-title">Our <em>Outlets</em></h2>
          <p className="section-subtitle" style={{ margin: '12px auto 0', textAlign: 'center' }}>
            13 locations across Tamil Nadu — Chennai, Coimbatore & Puducherry.
          </p>
        </div>
        <div className="outlets-grid">
          {outlets.map((o) => (
            <div className="outlet-card" key={o.num}>
              <div className="outlet-top">
                <span className="outlet-num">#{o.num}</span>
                <FlagBadge flag={o.flag} />
              </div>
              <div className="outlet-name">{o.name}</div>
              <div className="outlet-city">🍹 {o.city}</div>
              <p className="outlet-address">{o.address}</p>
              <a className="outlet-map-btn" href={o.map} target="_blank" rel="noopener noreferrer">
                📍 Get Directions
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ── REVIEWS ── */}
      <section className="reviews" id="reviews">
        <div className="reviews-header">
          <span className="section-label">Reviews</span>
          <h2 className="section-title">Our Customers Says</h2>
        </div>
        <div className="reviews-grid">
          {reviews.map((r, i) => (
            <div className="review-card" key={i}>
              <div className="review-stars">{"★".repeat(r.stars)}</div>
              <p className="review-text">"{r.text}"</p>
              <div className="review-author">
                <div className="review-avatar">{r.avatar}</div>
                <div>
                  <div className="review-name">{r.name}</div>
                  <div className="review-tag">{r.tag}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FRANCHISE ── */}
      <section className="franchise" id="franchise">
        <div className="franchise-inner">
          <div className="franchise-form-side">
            <span className="section-label">Franchise</span>
            <h2 className="section-title">For Franchise<br /><em>Enquiry</em></h2>
            <p className="section-subtitle">Interested in bringing Fruit Shop on Greams Road to your city? Fill in your details and our team will get in touch.</p>

            {submitted ? (
              <div className="form-success">
                <div style={{ fontSize: 52, marginBottom: 16 }}>🎉</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: 'var(--green-dark)', fontWeight: 700, marginBottom: 8 }}>Thank you!</div>
                <p style={{ color: 'var(--text-light)', fontSize: 15, lineHeight: 1.6 }}>We've received your enquiry and will be in touch shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ marginTop: 8 }}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Name *</label>
                    <input required placeholder="Your full name" value={form.name} onChange={set("name")} />
                  </div>
                  <div className="form-group">
                    <label>Email *</label>
                    <input type="email" required placeholder="your@email.com" value={form.email} onChange={set("email")} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Contact *</label>
                    <input required placeholder="+91 XXXXXXXXXX" value={form.contact} onChange={set("contact")} />
                  </div>
                  <div className="form-group">
                    <label>State *</label>
                    <select required value={form.state} onChange={set("state")}>
                      <option value="">Choose state</option>
                      {["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman & Nicobar Islands", "Chandigarh", "Dadra & Nagar Haveli and Daman & Diu", "Delhi", "Jammu & Kashmir", "Ladakh", "Lakshadweep", "Puducherry"].map(s => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Interested City / Location *</label>
                  <input required placeholder="City or identified location" value={form.city} onChange={set("city")} />
                </div>
                <div className="form-group">
                  <label>Message</label>
                  <textarea placeholder="Tell us about yourself and your interest..." value={form.message} onChange={set("message")} />
                </div>
                <button type="submit" className="form-submit">Submit Enquiry →</button>
              </form>
            )}
          </div>

          <div className="franchise-brand-side">
            <div className="fbs-logo-ring">
              <div className="fbs-logo-ring">
                <img
                  src="/logo.png"
                  alt="Fruit Shop on Greams Road logo"
                  style={{ width: "150px", height: "150px", borderRadius: "50%", objectFit: "cover" }}
                />
              </div>
            </div>
            <div className="fbs-brand-name">Fruit Shop<br />on Greams Road</div>
            <div className="fbs-brand-sub">Est. 1994 · Tamil Nadu</div>
            <p className="fbs-desc">
              Our humble beginnings started with a passion to create the best fruit juices and shakes — capturing the crisp, vibrant taste of beautiful fresh fruit. Pure, natural, full-bodied, nothing artificial. Other outlets use reconstituted juice and add preservatives — it doesn't taste like real juice. We never will.
            </p>
            <div className="fbs-badges">
              {["100% Natural", "No Preservatives", "No Gas Added", "Fresh Daily", "30+ Yrs Trust"].map(b => (
                <span className="fbs-badge" key={b}>{b}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer>
        <div className="footer-inner">
          <div className="footer-brand-name">Fruit Shop on Greams Road</div>
          <p className="footer-tagline">
            No artificial colors. No fake flavoring. No gas in our juices.<br />
            Serving Chennai with freshness since 1994.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
            <span className="footer-contact-title">Contact Us</span>
          </div>

          <div className="footer-social">
            <a
              className="footer-social-link"
              href="https://www.instagram.com/fruitshopongreamsroad.in"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on Instagram"
            >
              <FaInstagram />
            </a>
            <a
              className="footer-social-link"
              href="https://www.linkedin.com/company/fruit-shop-on-greams-road"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Connect on LinkedIn"
            >
              <FaLinkedinIn />
            </a>
          </div>

          <div className="footer-divider" />
          <span className="footer-copy">© {new Date().getFullYear()} Fruit Shop on Greams Road. All rights reserved.</span>
        </div>
      </footer>
    </>
  );
}