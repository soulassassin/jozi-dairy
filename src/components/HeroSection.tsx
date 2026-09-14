"use client";

import React from "react";
import MilkCarton3D from "./MilkCarton3D";
import { MessageCircle, ArrowRight, ShieldCheck, Snowflake, Truck, MapPin, Milk } from "lucide-react";
import { COMPANY_INFO } from "@/data/dairyData";

interface HeroSectionProps {
  onOpenQuoteModal: () => void;
}

export default function HeroSection({ onOpenQuoteModal }: HeroSectionProps) {
  return (
    <section
      id="home"
      className="relative min-h-[92vh] pt-28 sm:pt-36 pb-16 lg:pb-24 flex items-center bg-gradient-to-b from-[#f4f7fb] via-white to-white overflow-hidden bg-dot-pattern scroll-mt-24 md:scroll-mt-28"
    >
      {/* Subtle Background Glow Orbs */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-jozi-cyan/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-jozi-navy/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Value Proposition & Direct Conversion */}
          <div className="lg:col-span-7 flex flex-col items-start z-10">
            {/* Eyebrow Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-jozi-cyan/10 border border-jozi-cyan/30 text-jozi-navy text-xs sm:text-sm font-bold shadow-sm mb-6">
              <Milk className="w-4 h-4 text-jozi-cyan shrink-0" />
              <span className="text-jozi-navy">Fresh Dairy Distribution</span>
              <span className="text-jozi-cyan font-extrabold">•</span>
              <span className="text-slate-600 font-semibold">Midrand, Gauteng</span>
            </div>

            {/* Headline with text-balance */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-jozi-navy mb-6 font-display text-balance">
              Farm-Fresh Dairy Delivered Straight to Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-jozi-cyan to-jozi-navy">
                Business & Home
              </span>
            </h1>

            {/* Sub-copy with text-pretty */}
            <p className="text-base md:text-lg text-slate-600 leading-relaxed max-w-2xl mb-8 text-pretty">
              {COMPANY_INFO.heroSubcopy}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto mb-10">
              <a
                href={COMPANY_INFO.phones.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-jozi-cyan hover:brightness-105 active:scale-[0.98] text-white font-bold text-sm md:text-base shadow-glow hover:shadow-glow-lg transition-all duration-200 ring-2 ring-offset-2 ring-jozi-cyan focus:outline-none min-h-[48px]"
              >
                <MessageCircle className="w-5 h-5 fill-current shrink-0" />
                <span>Order via WhatsApp</span>
              </a>

              <a
                href="#products"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border-2 border-jozi-navy text-jozi-navy hover:bg-jozi-navy hover:text-white font-bold text-sm md:text-base transition-colors duration-200 active:scale-[0.98] min-h-[48px]"
              >
                <span>Explore Product Catalog</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </a>
            </div>

            {/* Key Trust Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 w-full pt-6 border-t border-slate-200">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-100 shadow-sm">
                <div className="p-2 rounded-lg bg-blue-50 text-jozi-cyan">
                  <Snowflake className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-jozi-navy">Cold-Chain Guaranteed</h4>
                  <p className="text-[11px] text-slate-500 font-medium">Maintained at 4°C</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-100 shadow-sm">
                <div className="p-2 rounded-lg bg-slate-100 text-jozi-navy">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-jozi-navy">Fast Route Logistics</h4>
                  <p className="text-[11px] text-slate-500 font-medium">Gauteng wide routes</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-100 shadow-sm">
                <div className="p-2 rounded-lg bg-emerald-50 text-jozi-green">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-jozi-navy">Direct from Mooi River</h4>
                  <p className="text-[11px] text-slate-500 font-medium">KZN pasture sourced</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Interactive Milk Carton Experience */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            <div className="w-full relative bg-gradient-to-b from-white/70 to-slate-50/70 rounded-3xl p-2 sm:p-4 border border-slate-200/80 shadow-card backdrop-blur-sm">
              {/* 3D Milk Carton Canvas */}
              <MilkCarton3D />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
