"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  ExternalLink,
  ChevronRight,
  Heart,
} from "lucide-react";
import { COMPANY_INFO, SERVICE_BADGES } from "@/data/dairyData";

export default function Footer() {
  return (
    <footer className="bg-jozi-navy text-white relative overflow-hidden border-t border-white/10">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-jozi-cyan/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-16">
          {/* Column 1: Brand & Story (Col span 4) */}
          <div className="lg:col-span-4">
            <Link href="#home" className="inline-block mb-6">
              <div className="relative h-14 w-44">
                {/* Crisp inverted vector logo for dark navy backdrop */}
                <Image
                  src="/assets/logo-white.svg"
                  alt="Jozi Dairy White Logo"
                  fill
                  className="object-contain object-left"
                />
              </div>
            </Link>

            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              For all your Dairy needs. At Jozi Dairy we are committed to distribute the best quality dairy products to our consumers. We are not only distributing the best quality dairy products, we also pride ourselves in ensuring the best customer experience.
            </p>

            <div className="flex items-center gap-3">
              <a
                href={COMPANY_INFO.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-jozi-cyan text-white flex items-center justify-center text-xs font-bold transition-colors"
                aria-label="Facebook"
              >
                FB
              </a>
              <a
                href={COMPANY_INFO.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-jozi-cyan text-white flex items-center justify-center text-xs font-bold transition-colors"
                aria-label="Instagram"
              >
                IG
              </a>
              <a
                href={COMPANY_INFO.social.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-green-500/20 hover:bg-green-500 text-green-400 hover:text-white flex items-center justify-center text-xs font-bold transition-colors"
                aria-label="WhatsApp"
              >
                WA
              </a>
            </div>
          </div>

          {/* Column 2: Quick Navigation (Col span 2) */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-bold uppercase tracking-wider text-jozi-cyan mb-5">
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm text-slate-300">
              <li>
                <a href="#home" className="hover:text-jozi-cyan transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  <span>Home</span>
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-jozi-cyan transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  <span>About Us</span>
                </a>
              </li>
              <li>
                <a href="#products" className="hover:text-jozi-cyan transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  <span>Services & Products</span>
                </a>
              </li>
              <li>
                <a href="#provenance" className="hover:text-jozi-cyan transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  <span>Mooi River Supply</span>
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-jozi-cyan transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  <span>Contact Us</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Department Inquiries (Col span 3) */}
          <div className="lg:col-span-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-jozi-cyan mb-5">
              Department Queries
            </h4>
            <ul className="space-y-3.5 text-xs text-slate-300">
              <li>
                <span className="text-slate-400 block mb-0.5">WhatsApp Hotline:</span>
                <a
                  href={COMPANY_INFO.phones.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-green-400 hover:text-green-300 flex items-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-current" />
                  <span>065 234 2460</span>
                </a>
              </li>
              <li>
                <span className="text-slate-400 block mb-0.5">Operations / Orders:</span>
                <a
                  href={`mailto:${COMPANY_INFO.emails.operations}`}
                  className="font-semibold text-white hover:text-jozi-cyan transition-colors"
                >
                  {COMPANY_INFO.emails.operations}
                </a>
              </li>
              <li>
                <span className="text-slate-400 block mb-0.5">Sales & Commercial:</span>
                <a
                  href={`mailto:${COMPANY_INFO.emails.sales}`}
                  className="font-semibold text-white hover:text-jozi-cyan transition-colors"
                >
                  {COMPANY_INFO.emails.sales}
                </a>
              </li>
              <li>
                <span className="text-slate-400 block mb-0.5">Accounts Queries:</span>
                <a
                  href={`mailto:${COMPANY_INFO.emails.accounts}`}
                  className="font-semibold text-white hover:text-jozi-cyan transition-colors"
                >
                  {COMPANY_INFO.emails.accounts}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Facility & Hours (Col span 3) */}
          <div className="lg:col-span-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-jozi-cyan mb-5">
              Midrand Hub
            </h4>
            <div className="space-y-3.5 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-jozi-cyan shrink-0 mt-0.5" />
                <span>
                  The Home Gallery, 124 Richards Drive, Halfway House, Midrand, 1685, South Africa
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-jozi-cyan shrink-0" />
                <a href={COMPANY_INFO.phones.officeTelLink} className="hover:text-jozi-cyan">
                  Office: {COMPANY_INFO.phones.office}
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-jozi-amber shrink-0" />
                <span>{COMPANY_INFO.hours}</span>
              </div>

              <div className="pt-2">
                <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-[11px] font-bold text-slate-300">
                  Daily Cold-Chain Route Dispatch
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Strip */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 Jozi Dairy. All Rights Reserved. Designed by{" "}
            <a
              href="https://synapsesnetworking.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-jozi-cyan underline font-semibold"
            >
              Synapses Networking
            </a>
          </p>

          <div className="flex items-center gap-6">
            <span>Fresh Milk Distribution</span>
            <span>•</span>
            <span>Mooi River Sourced</span>
            <span>•</span>
            <span>Midrand, Gauteng</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
