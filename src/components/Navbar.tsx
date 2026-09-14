"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Phone,
  Mail,
  Clock,
  MapPin,
  MessageCircle,
  Menu,
  X,
  FileText,
  ChevronRight,
} from "lucide-react";
import { COMPANY_INFO } from "@/data/dairyData";

interface NavbarProps {
  onOpenQuoteModal: () => void;
}

export default function Navbar({ onOpenQuoteModal }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "About Us", href: "#about" },
    { name: "Products & Services", href: "#products" },
    { name: "Mooi River Supply", href: "#provenance" },
    { name: "Contact & Directory", href: "#contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Top Utility Bar (Preserved exact live information) */}
      <div className="bg-jozi-navy text-slate-200 text-xs py-2 px-4 border-b border-white/10 hidden lg:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-jozi-cyan" />
              <span>{COMPANY_INFO.city}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-jozi-amber" />
              <span>{COMPANY_INFO.hours}</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <a
              href={COMPANY_INFO.phones.officeTelLink}
              className="flex items-center gap-2 hover:text-jozi-cyan transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-jozi-cyan" />
              <span>Tel: {COMPANY_INFO.phones.office}</span>
            </a>
            <a
              href={COMPANY_INFO.phones.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-green-400 hover:text-green-300 font-medium transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span>WhatsApp: {COMPANY_INFO.phones.whatsapp}</span>
            </a>
            <a
              href={`mailto:${COMPANY_INFO.emails.operations}`}
              className="flex items-center gap-2 hover:text-jozi-cyan transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-jozi-cyan" />
              <span>{COMPANY_INFO.emails.operations}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <nav
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? "glass-nav py-2.5 shadow-card"
            : "bg-white/95 backdrop-blur-md py-3.5 border-b border-jozi-navy/5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo with automatic scaling h-12 to h-14 */}
          <Link href="#home" className="flex items-center gap-3 group">
            <div className="relative h-12 sm:h-14 w-32 sm:w-40 flex items-center justify-start transition-transform group-hover:scale-[1.02]">
              {/* Crisp SVG Logo */}
              <Image
                src="/assets/logo.svg"
                alt="Jozi Dairy Official Logo"
                fill
                priority
                className="object-contain object-left"
              />
            </div>
            <div className="hidden xl:flex flex-col border-l border-slate-200 pl-3">
              <span className="text-[11px] font-bold tracking-widest text-jozi-navy uppercase">
                Midrand Hub
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                Direct Cold-Chain Supply
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-semibold text-jozi-navy hover:text-jozi-cyan transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-jozi-cyan hover:after:w-full after:transition-all after:duration-200"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Right Action Trigger Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href={COMPANY_INFO.phones.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-jozi-green/10 text-jozi-green hover:bg-jozi-green hover:text-white transition-all text-xs font-bold border border-jozi-green/20"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>WhatsApp Us</span>
            </a>

            <button
              onClick={onOpenQuoteModal}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-jozi-cyan hover:bg-jozi-cyan-light text-white text-xs font-bold shadow-glow hover:shadow-glow-lg transition-all hover:-translate-y-0.5"
            >
              <FileText className="w-4 h-4" />
              <span>Get a Quote</span>
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={onOpenQuoteModal}
              className="px-3 py-1.5 rounded-full bg-jozi-cyan text-white text-xs font-bold shadow-sm"
            >
              Quote
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-jozi-navy hover:bg-slate-100 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/98 backdrop-blur-xl border-b border-jozi-navy/10 shadow-2xl px-5 py-6 flex flex-col gap-4 animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-3 px-3 rounded-xl text-sm font-bold text-jozi-navy hover:bg-slate-50 hover:text-jozi-cyan transition-colors"
              >
                <span>{link.name}</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenQuoteModal();
              }}
              className="w-full py-3 rounded-xl bg-jozi-cyan text-white text-sm font-bold shadow-glow flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4" />
              <span>Request Wholesale / Retail Quote</span>
            </button>

            <a
              href={COMPANY_INFO.phones.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-xl bg-jozi-green text-white text-sm font-bold flex items-center justify-center gap-2 shadow-sm"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Chat on WhatsApp (065 234 2460)</span>
            </a>

            <div className="mt-2 text-center text-xs text-slate-500 flex flex-col gap-1">
              <span>Tel: {COMPANY_INFO.phones.office} • {COMPANY_INFO.hours}</span>
              <span>Midrand, Johannesburg</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
