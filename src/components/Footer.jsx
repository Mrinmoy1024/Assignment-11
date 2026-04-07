import React from "react";
import logo from "../assets/logo.png";
import facebook from "../assets/facebook.png";
import instagram from "../assets/instagram.png";
import twitter from "../assets/twitter.png";
const Footer = () => {
  return (
    <div>
      <footer className="footer footer-horizontal footer-center back text-base-content rounded p-10">
        <nav>
          <img src={logo} className="w-100 rounded-2xl" />
        </nav>
        <nav className="grid grid-flow-col gap-4">
          <a className="link link-hover">About us</a>
          <a className="link link-hover">Contact</a>
          <a className="link link-hover">Privacy Policy</a>
          <a className="link link-hover">Join Our Newsletter</a>
        </nav>
        <nav>
          <div className="grid grid-flow-col gap-4">
            <img src={facebook} className="w-10" />
            <img src={instagram} className="w-10" />
            <img src={twitter} className="w-10" />
          </div>
        </nav>
        <aside>
          <p>
            Copyright &copy; 2026 &mdash; All right reserved by Contest Carnival Inc
          </p>
        </aside>
      </footer>
    </div>
  );
};

export default Footer;
