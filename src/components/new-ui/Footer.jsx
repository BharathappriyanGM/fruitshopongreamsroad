import { motion } from "framer-motion";
import { FaInstagram, FaLinkedinIn } from "react-icons/fa";
import "./landing.css";

export default function Footer() {
  return (
    <footer className="nui-footer" id="footer">
      <motion.div
        className="nui-footer-frame"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        {/* Peeking fruits image with the wall ledge */}
        <img
          src="/images/landing/footer_peeking_fruits_clean.png"
          alt="Fruits peeking over rail"
          className="nui-footer-img"
        />

        {/* Content overlaid directly on the wall ledge of the picture */}
        <div className="nui-footer-overlay">
          {/* Logo on the left */}
          <a href="#home" className="nui-footer-logo-link">
            <img
              src="/images/landing/logo-official.png"
              alt="Fruit Shop on Greams Road"
              className="nui-footer-logo-img"
            />
          </a>

          {/* Nav links and social icons on the right */}
          <div className="nui-footer-nav-group">
            <a href="#home" className="nui-footer-link nui-link-home">Home</a>
            <a href="#about" className="nui-footer-link nui-link-about">About Us</a>
            <a href="#footer" className="nui-footer-link nui-link-contact">Contact Us</a>
            <div className="nui-footer-social-row">
              <a
                className="footer-social-link"
                href="https://www.instagram.com/fruitshopongreamsroad.in"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
              <a
                className="footer-social-link"
                href="https://www.linkedin.com/company/fruit-shop-on-greams-road"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn />
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
