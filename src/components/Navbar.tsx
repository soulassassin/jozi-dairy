"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Phone,
  Mail,
  Clock,
  MapPin,
  Menu,
  X,
  FileText,
  ChevronRight,
  Home,
  Info,
  Package,
  Truck,
  Sparkles,
} from "lucide-react";
import { WhatsAppIcon, FacebookIcon, InstagramIcon } from "@/components/icons/SocialIcons";
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
    {
      name: "Home",
      href: "#home",
      id: "home",
      icon: Home,
      desc: "Overview & Midrand Hub",
    },
    {
      name: "About Us",
      href: "#about",
      id: "about",
      icon: Info,
      desc: "Our Story & KwaZulu-Natal Roots",
    },
    {
      name: "Products & Services",
      href: "#products",
      id: "products",
      icon: Package,
      desc: "Milk, Yogurt, Cream, Amasi & Juice",
    },
    {
      name: "Mooi River Supply",
      href: "#provenance",
      id: "provenance",
      icon: Truck,
      desc: "Cold-Chain Logistics & Quality",
    },
    {
      name: "Contact & Directory",
      href: "#contact",
      id: "contact",
      icon: Phone,
      desc: "Midrand Facility, Phones & Orders",
    },
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
                className="flex items-center gap-2 text-[#25D366] hover:text-green-300 font-medium transition-colors"
              >
                <WhatsAppIcon className="w-3.5 h-3.5 fill-current shrink-0" />
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
              : "bg-white/95 backdrop-blur-md py-2.5 sm:py-3 border-b border-jozi-navy/5"
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

            {/* Right Action Trigger Buttons (Desktop) */}
            <div className="hidden sm:flex items-center gap-3">
              <a
                href={COMPANY_INFO.phones.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-jozi-green/10 text-[#2E7D32] hover:bg-[#2E7D32] hover:text-white transition-all text-xs md:text-sm font-semibold border border-jozi-green/20 min-h-[44px] focus-visible:ring-2 focus-visible:ring-[#2E7D32] focus:outline-none active:scale-[0.98]"
              >
                <WhatsAppIcon className="w-4 h-4 fill-current shrink-0" />
                <span>WhatsApp Us</span>
              </a>

              {/* Cleaned up, premium Quote Button */}
              <button
                type="button"
                onClick={onOpenQuoteModal}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-jozi-cyan to-[#0091ca] hover:brightness-105 active:scale-[0.98] text-white text-xs md:text-sm font-semibold shadow-glow hover:shadow-glow-lg transition-all duration-200 min-h-[44px] border border-white/20 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#00A8E8] focus:outline-none"
              >
                <FileText className="w-4 h-4 shrink-0" />
                <span>Get a Quote</span>
              </button>
            </div>

            {/* Mobile Actions: Clean Quote Pill + Hamburger */}
            <div className="flex items-center gap-2 lg:hidden">
              {/* Clean, well-proportioned mobile quote button */}
              <button
                type="button"
                onClick={onOpenQuoteModal}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-jozi-cyan/10 hover:bg-jozi-cyan text-jozi-cyan hover:text-white border border-jozi-cyan/30 text-xs font-bold transition-all min-h-[42px] active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-jozi-cyan"
                aria-label="Request a Quote"
              >
                <FileText className="w-3.5 h-3.5 shrink-0" />
                <span>Quote</span>
              </button>

              {/* Mobile Hamburger Toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 rounded-xl text-jozi-navy bg-slate-100 hover:bg-slate-200 active:bg-slate-300 transition-colors min-h-[42px] min-w-[42px] inline-flex items-center justify-center focus-visible:ring-2 focus-visible:ring-jozi-navy"
                aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 shrink-0 text-jozi-navy" />
                ) : (
                  <Menu className="w-5 h-5 shrink-0 text-jozi-navy" />
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
          className="fixed inset-0 bg-jozi-navy/60 backdrop-blur-sm z-40 lg:hidden transition-opacity animate-in fade-in duration-200"
          aria-hidden="true"
        />
      )}

      {/* Enhanced Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed top-[56px] sm:top-[64px] left-0 right-0 bottom-0 z-50 bg-white border-b border-slate-200 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-top-3 duration-200"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
        >
          {/* Scrollable Body */}
          <div className="p-5 flex flex-col gap-4">
            {/* Header with Location Status & Close Button (No duplicate logo) */}
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-jozi-navy uppercase tracking-wider font-display">
                  Midrand Hub • Direct Supply
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-jozi-navy hover:bg-slate-100 transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cleaned Up Primary Quote Action inside Menu */}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenQuoteModal();
              }}
              className="w-full min-h-[50px] py-3 px-5 rounded-2xl bg-gradient-to-r from-jozi-cyan to-[#0091ca] hover:brightness-105 active:scale-[0.98] text-white font-bold text-sm shadow-glow flex items-center justify-between transition-all duration-200 border border-white/20"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold leading-tight">Request a Quote</div>
                  <div className="text-[10px] text-white/80 font-normal">Wholesale & Commercial Pricing</div>
                </div>
              </div>
              <Sparkles className="w-4 h-4 text-white/90 shrink-0" />
            </button>

            {/* Structured Navigation Items with Subtitles */}
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">
                Explore Sections
              </div>
              <nav className="flex flex-col gap-1.5" aria-label="Mobile Navigation">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = activeSection === link.id;
                  return (
                    <a
                      key={link.name}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between p-3 rounded-2xl transition-all min-h-[52px] ${
                        isActive
                          ? "bg-jozi-cyan/10 border border-jozi-cyan/30 text-jozi-navy font-bold shadow-sm"
                          : "text-slate-700 hover:bg-slate-50 hover:text-jozi-navy border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                            isActive
                              ? "bg-jozi-cyan text-white shadow-sm"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col text-left">
                          <span className={`text-sm ${isActive ? "font-bold text-jozi-cyan" : "font-semibold"}`}>
                            {link.name}
                          </span>
                          <span className="text-[10px] text-slate-400 font-normal">
                            {link.desc}
                          </span>
                        </div>
                      </div>
                      <ChevronRight
                        className={`w-4 h-4 shrink-0 ${
                          isActive ? "text-jozi-cyan" : "text-slate-300"
                        }`}
                      />
                    </a>
                  );
                })}
              </nav>
            </div>

            {/* Instant Contact Shortcuts */}
            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">
                Direct Contact
              </div>
              
              <a
                href={COMPANY_INFO.phones.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full min-h-[46px] py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] active:scale-[0.98] text-white text-xs font-bold flex items-center justify-between shadow-sm transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <WhatsAppIcon className="w-4 h-4 fill-current shrink-0" />
                  <span>Chat on WhatsApp Hotline</span>
                </div>
                <span className="text-[11px] bg-white/20 px-2 py-0.5 rounded-md font-semibold">
                  065 234 2460
                </span>
              </a>

              <a
                href={COMPANY_INFO.phones.officeTelLink}
                className="w-full min-h-[46px] py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-jozi-navy text-xs font-semibold flex items-center justify-between transition-colors border border-slate-200"
              >
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-jozi-cyan shrink-0" />
                  <span>Call Midrand Office</span>
                </div>
                <span className="text-[11px] text-slate-500 font-medium">
                  {COMPANY_INFO.phones.office}
                </span>
              </a>
            </div>
          </div>

          {/* Drawer Bottom Bar: Operating Hours & Social Icons */}
          <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between">
            <div className="flex flex-col text-[11px] text-slate-500">
              <span className="font-semibold text-slate-700">{COMPANY_INFO.hours}</span>
              <span>124 Richards Dr, Midrand</span>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={COMPANY_INFO.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white border border-slate-200 hover:bg-[#1877F2] hover:text-white text-slate-600 flex items-center justify-center transition-colors shadow-sm"
                aria-label="Facebook"
              >
                <FacebookIcon className="w-3.5 h-3.5 fill-current" />
              </a>
              <a
                href={COMPANY_INFO.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white border border-slate-200 hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:text-white text-slate-600 flex items-center justify-center transition-colors shadow-sm"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-3.5 h-3.5 fill-current" />
              </a>
              <a
                href={COMPANY_INFO.social.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200 text-[#25D366] hover:bg-[#25D366] hover:text-white flex items-center justify-center transition-colors shadow-sm"
                aria-label="WhatsApp"
              >
                <WhatsAppIcon className="w-3.5 h-3.5 fill-current" />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
