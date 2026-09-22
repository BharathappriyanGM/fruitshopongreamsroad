import Navbar from "./Navbar";
import Hero from "./Hero";
import AboutStory from "./AboutStory";
import Order from "./Order";
import Footer from "./Footer";
import "./landing.css";

export default function Landing() {
  return (
    <div className="new-ui-landing" style={{ position: "relative" }}>
      <Navbar />
      <Hero />
      <AboutStory />
      <Order />
      <Footer />
    </div>
  );
}
