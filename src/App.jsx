import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import FruitShopLanding from "./components/FruitShopLanding";
import CartPage from "./components/CartPage";
import FranchiseEnquiry from "./components/FranchiseEnquiry";
import PickMeUp from "./components/PickMeUp";
import StallEnquiry from "./components/StallEnquiry";

export default function App() {
  const [cart, setCart] = useState([]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FruitShopLanding cart={cart} setCart={setCart} />} />
        <Route path="/cart" element={<CartPage cart={cart} setCart={setCart} />} />
        <Route path="/franchise" element={<FranchiseEnquiry />} />
        <Route path="/pickup" element={<PickMeUp />} />
        <Route path="/stall" element={<StallEnquiry />} />
      </Routes>
    </BrowserRouter>
  );
}