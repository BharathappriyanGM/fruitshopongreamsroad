import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

export default function CartPage({ cart, setCart }) {
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + item.qty, 0);

  const updateQty = (name, delta) => {
    setCart((prev) =>
      prev
        .map((item) => item.name === name ? { ...item, qty: item.qty + delta } : item)
        .filter((item) => item.qty > 0)
    );
  };

  const removeItem = (name) => {
    setCart((prev) => prev.filter((item) => item.name !== name));
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f8fdf8",
      fontFamily: "var(--font-ui)",
      paddingTop: 80,
    }}>
      {/* Header */}
      <div style={{
        background: "#0f4025", padding: "24px 48px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      }}>
        <div>
          <div style={{ color: "#fff", fontWeight: 800, fontSize: 20 }}>Your Cart</div>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>
            {total} item{total !== 1 ? "s" : ""}
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/")}
          style={{
            background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)",
            color: "#fff", padding: "8px 18px", borderRadius: 100, cursor: "pointer",
            fontSize: 14, fontWeight: 600, fontFamily: "var(--font-ui)",
            display: "flex", alignItems: "center", gap: 6,
          }}
        >
          <FiArrowLeft /> Back
        </motion.button>
      </div>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "32px 24px" }}>
        {cart.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ textAlign: "center", padding: "80px 24px" }}
          >
            <div style={{ fontSize: 72, marginBottom: 16 }}>🛒</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#1a2e1a", marginBottom: 8 }}>
              Your cart is empty
            </div>
            <p style={{ color: "#6b7280", marginBottom: 32 }}>
              Add some fresh juices to get started!
            </p>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/")}
              style={{
                background: "#1a5c2a",
                color: "#fff",
                border: "none",
                padding: "12px 32px",
                borderRadius: 100,
                fontSize: 15,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "var(--font-ui)",
              }}
            >
              Browse Menu
            </motion.button>
          </motion.div>
        ) : (
          <>
            <AnimatePresence>
              {cart.map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 24, height: 0, marginBottom: 0 }}
                  transition={{ delay: i * 0.06 }}
                  style={{
                    background: "#fff",
                    borderRadius: 20,
                    padding: "16px 20px",
                    marginBottom: 14,
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    border: `2px solid ${item.accent}22`,
                    boxShadow: `0 4px 20px ${item.accent}14`,
                  }}
                >
                  {/* Image */}
                  <div style={{
                    width: 72, height: 72,
                    borderRadius: 16,
                    background: item.bg,
                    overflow: "hidden",
                    flexShrink: 0,
                  }}>
                    <img
                      src={item.img}
                      alt={item.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 800, fontSize: 15, color: "#1a2e1a", marginBottom: 4 }}>
                      {item.name}
                    </div>
                    <div style={{
                      display: "inline-block",
                      background: item.accent + "22",
                      color: item.accent,
                      fontSize: 11, fontWeight: 700,
                      padding: "2px 10px", borderRadius: 100,
                    }}>
                      {item.tag}
                    </div>
                  </div>

                  {/* Qty controls */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => updateQty(item.name, -1)}
                      style={{
                        width: 30, height: 30, borderRadius: "50%",
                        background: item.accent + "22",
                        border: "none", cursor: "pointer",
                        color: item.accent, fontWeight: 800, fontSize: 16,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}
                    >−</motion.button>

                    <span style={{ fontSize: 16, fontWeight: 800, color: "#1a2e1a", minWidth: 20, textAlign: "center" }}>
                      {item.qty}
                    </span>

                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => updateQty(item.name, 1)}
                      style={{
                        width: 30, height: 30, borderRadius: "50%",
                        background: item.accent,
                        border: "none", cursor: "pointer",
                        color: "#fff", fontWeight: 800, fontSize: 16,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}
                    >+</motion.button>
                  </div>

                  {/* Remove */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => removeItem(item.name)}
                    style={{
                      background: "#fef2f2",
                      border: "none", cursor: "pointer",
                      width: 30, height: 30, borderRadius: "50%",
                      color: "#ef4444", fontSize: 14,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >✕</motion.button>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                background: "#0f4025",
                borderRadius: 24,
                padding: "24px 28px",
                marginTop: 24,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 14 }}>Total items</span>
                <span style={{ color: "#f5c842", fontWeight: 800, fontSize: 16 }}>{total}</span>
              </div>
              <div style={{ height: 1, background: "rgba(255,255,255,0.1)", margin: "12px 0" }} />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  width: "100%",
                  background: "linear-gradient(135deg, #f5c842, #f97316)",
                  border: "none",
                  padding: "14px 0",
                  borderRadius: 100,
                  color: "#1a2e1a",
                  fontWeight: 800,
                  fontSize: 16,
                  cursor: "pointer",
                  fontFamily: "var(--font-ui)",
                  marginTop: 4,
                }}
              >
                Place Order 🎉
              </motion.button>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}