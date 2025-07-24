"use client";

import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const footerLinks = {
  quickLinks: [
    { name: "About Us", href: "#" },
    { name: "Our Services", href: "#" },
    { name: "Resource Center", href: "#" },
    { name: "Contact", href: "#contact" },
  ],
  legal: [
    { name: "Privacy Policy", href: "#" },
    { name: "Terms & Conditions", href: "#" },
    { name: "Disclaimer", href: "#" },
  ],
  social: [
    { name: "Facebook", icon: <Facebook className="h-6 w-6" />, href: "#" },
    { name: "Twitter", icon: <Twitter className="h-6 w-6" />, href: "#" },
    { name: "Instagram", icon: <Instagram className="h-6 w-6" />, href: "#" },
    { name: "LinkedIn", icon: <Linkedin className="h-6 w-6" />, href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Logo and Description */}
          <div className="col-span-2 md:col-span-1">
            <a href="#" className="flex items-center">
              <img src="/Logo.png" className="mr-3 h-8" alt="LOKSamarth Logo" />
              <span className="self-center text-2xl font-semibold whitespace-nowrap">
                LOKSamarth
              </span>
            </a>
            <p className="mt-4 text-gray-400">
              Empowering rural communities through technology and financial
              inclusion.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-gray-300 uppercase">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-base text-gray-400 hover:text-white"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-gray-300 uppercase">
              Legal
            </h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-base text-gray-400 hover:text-white"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-gray-300 uppercase">
              Follow Us
            </h3>
            <div className="mt-4 flex space-x-4">
              {footerLinks.social.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="text-gray-400 hover:text-white"
                >
                  <span className="sr-only">{social.name}</span>
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-700 pt-8 text-center text-base text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} LOKSamarth, Ministry of Rural
            Development. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
