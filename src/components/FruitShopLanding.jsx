/* ══════════════════════════════════════════════════════════════════════
   Fruit Shop on Greams Road — Landing Page
   ──────────────────────────────────────────────────────────────────────
   Sub-routes (/cart, /pickup, /franchise, /stall) remain completely
   functional via App.jsx — they are NOT affected by this change.
   ══════════════════════════════════════════════════════════════════════ */

import Landing from "./new-ui/Landing";

export default function FruitShopLanding({ cart, setCart }) {
  return <Landing />;
}
