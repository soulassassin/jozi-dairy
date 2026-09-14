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
  Home,
  Info,
  Package,
  Truck,
} from "lucide-react";
import { COMPANY_INFO } from "@/data/dairyData";

interface NavbarProps {
  onOpenQuoteModal: () => void;
}

export default function Navbar({ onOpenQuoteModal }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("home");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll spy to highlight active menu section
  useEffect(() => {
    const sectionIds = ["home", "about", "products", "provenance", "contact"];
    const handleScrollSpy = () => {
      const scrollPosition = window.scrollY + 140;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(sectionIds[i]);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScrollSpy, { passive: true });
    handleScrollSpy();
    return () => window.removeEventListener("scroll", handleScrollSpy);
  }, []);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const navLinks = [
    { name: "Home", href: "#home", id: "home", icon: Home },
    { name: "About Us", href: "#about", id: "about", icon: Info },
    { name: "Products & Services", href: "#products", id: "products", icon: Package },
    { name: "Mooi River Supply", href: "#provenance", id: "provenance", icon: Truck },
    { name: "Contact & Directory", href: "#contact", id: "contact", icon: Phone },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        {/* Top Utility Bar (Exact live contact details) */}
        <div className="bg-jozi-navy text-slate-200 text-xs py-2 px-4 border-b border-white/10 hidden lg:block">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-jozi-cyan shrink-0" />
                <span>{COMPANY_INFO.city}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Clock className="w-3.5 h-3.5 text-jozi-amber shrink-0" />
                <span>{COMPANY_INFO.hours}</span>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <a
                href={COMPANY_INFO.phones.officeTelLink}
                className="flex items-center gap-2 hover:text-jozi-cyan transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-jozi-cyan shrink-0" />
                <span>Tel: {COMPANY_INFO.phones.office}</span>
              </a>
              <a
                href={COMPANY_INFO.phones.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-green-400 hover:text-green-300 font-medium transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-current shrink-0" />
                <span>WhatsApp: {COMPANY_INFO.phones.whatsapp}</span>
              </a>
              <a
                href={COMPANY_INFO.emails.operationsLink}
                className="flex items-center gap-2 hover:text-jozi-cyan transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-jozi-cyan shrink-0" />
                <span>{COMPANY_INFO.emails.operations}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Main Sticky Navbar */}
        <nav
          className={`w-full transition-all duration-300 ${
            isScrolled
              ? "glass-nav py-2 shadow-card"
              : "bg-white/95 backdrop-blur-md py-3 border-b border-jozi-navy/5"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            {/* Brand Logo with Authentic High-Res Asset */}
            <Link
              href="#home"
              className="flex items-center gap-3 group py-1"
              aria-label="Jozi Dairy Home"
            >
              <div className="relative flex items-center justify-start transition-transform group-hover:scale-[1.02]">
                <Image
                  src="/assets/logo.png"
                  alt="Jozi Dairy Official Logo"
                  width={160}
                  height={107}
                  priority
                  className="h-10 sm:h-12 md:h-13 w-auto object-contain drop-shadow-sm"
                />
              </div>
              <div className="hidden xl:flex flex-col border-l border-slate-200 pl-3">
                <span className="text-[11px] font-bold tracking-widest text-jozi-navy uppercase font-display">
                  Midrand Hub
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  Direct Cold-Chain Supply
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links with Scroll Spy */}
            <div className="hidden lg:flex items-center gap-7">
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    className={`text-sm font-semibold transition-all relative py-1.5 ${
                      isActive
                        ? "text-jozi-cyan font-bold"
                        : "text-jozi-navy hover:text-jozi-cyan"
                    } after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:transition-all after:duration-200 ${
                      isActive
                        ? "after:w-full after:bg-jozi-cyan"
                        : "after:w-0 after:bg-jozi-cyan hover:after:w-full"
                    }`}
                  >
                    {link.name}
                  </a>
                );
              })}
            </div>

            {/* Right Action Trigger Buttons */}
            <div className="hidden sm:flex items-center gap-3">
              <a
                href={COMPANY_INFO.phones.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-jozi-green/10 text-jozi-green hover:bg-[#2E7D32] hover:text-white transition-all text-xs md:text-sm font-semibold border border-jozi-green/20 min-h-[48px] focus-visible:ring-2 focus-visible:ring-[#2E7D32] focus:outline-none active:scale-[0.98]"
              >
                <MessageCircle className="w-4 h-4 fill-current shrink-0" />
                <span>WhatsApp Us</span>
              </a>

              <button
                type="button"
                onClick={onOpenQuoteModal}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-jozi-cyan hover:brightness-105 active:scale-[0.98] text-white text-xs md:text-sm font-semibold shadow-glow hover:shadow-glow-lg transition-all duration-200 min-h-[48px] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#00A8E8] focus:outline-none"
              >
                <FileText className="w-4 h-4 shrink-0" />
                <span>Get a Quote</span>
              </button>
            </div>

            {/* Mobile Hamburger Toggle & Quote Button */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                type="button"
                onClick={onOpenQuoteModal}
                className="px-3.5 py-2.5 rounded-xl bg-jozi-cyan hover:brightness-105 active:scale-[0.98] text-white text-xs font-bold shadow-sm min-h-[48px] inline-flex items-center justify-center focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-jozi-cyan"
              >
                Quote
              </button>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-3 rounded-xl text-jozi-navy hover:bg-slate-100 active:bg-slate-200 transition-colors min-h-[48px] min-w-[48px] inline-flex items-center justify-center focus-visible:ring-2 focus-visible:ring-jozi-navy"
                aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 shrink-0 text-jozi-navy" />
                ) : (
                  <Menu className="w-6 h-6 shrink-0 text-jozi-navy" />
                )}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Backdrop overlay for mobile menu drawer */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-jozi-navy/50 backdrop-blur-sm z-40 lg:hidden transition-opacity animate-in fade-in duration-200"
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed top-[56px] sm:top-[64px] left-0 right-0 z-50 bg-white/98 backdrop-blur-2xl border-b border-slate-200 shadow-2xl px-5 py-5 max-h-[calc(100dvh-4rem)] overflow-y-auto animate-in slide-in-from-top-3 duration-200"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
        >
          {/* Logo & Brand Header inside the Menu Drawer */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <Link
              href="#home"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3"
            >
              <Image
                src="/assets/logo.png"
                alt="Jozi Dairy Logo"
                width={140}
                height={94}
                className="h-9 w-auto object-contain"
              />
              <div className="flex flex-col">
                <span className="text-sm font-bold text-jozi-navy leading-tight font-display">
                  Jozi Dairy
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  Midrand Hub • Cold Chain
                </span>
              </div>
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg text-slate-400 hover:text-jozi-navy hover:bg-slate-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links with Icons & Active Indicator */}
          <nav className="flex flex-col gap-1 py-3" aria-label="Mobile Navigation">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between py-3.5 px-3.5 rounded-xl text-sm font-semibold transition-all min-h-[48px] ${
                    isActive
                      ? "bg-jozi-cyan/10 text-jozi-cyan font-bold"
                      : "text-jozi-navy hover:bg-slate-50 hover:text-jozi-cyan"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? "text-jozi-cyan" : "text-slate-400"}`} />
                    <span>{link.name}</span>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 ${
                      isActive ? "text-jozi-cyan" : "text-slate-300"
                    }`}
                  />
                </a>
              );
            })}
          </nav>

          {/* Action CTAs inside Menu Drawer */}
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenQuoteModal();
              }}
              className="w-full min-h-[48px] py-3.5 px-5 rounded-xl bg-jozi-cyan hover:brightness-105 active:scale-[0.98] text-white text-sm font-semibold shadow-glow flex items-center justify-center gap-2 transition-all duration-200"
            >
              <FileText className="w-4 h-4 shrink-0" />
              <span>Request Wholesale / Retail Quote</span>
            </button>

            <a
              href={COMPANY_INFO.phones.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full min-h-[48px] py-3.5 px-5 rounded-xl bg-[#2E7D32] hover:bg-[#276a2b] text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-current shrink-0" />
              <span>WhatsApp: {COMPANY_INFO.phones.whatsapp}</span>
            </a>

            <a
              href={COMPANY_INFO.phones.officeTelLink}
              className="w-full min-h-[48px] py-3 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 text-jozi-navy text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Phone className="w-4 h-4 text-jozi-cyan shrink-0" />
              <span>Call Office: {COMPANY_INFO.phones.office}</span>
            </a>

            <div className="mt-2 text-center text-xs text-slate-500 flex flex-col gap-1">
              <span>{COMPANY_INFO.hours} • Midrand Distribution Hub</span>
              <span>Direct Cold-Chain Delivery across Gauteng</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
