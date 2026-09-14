"use client";

import React from "react";
import Image from "next/image";
import {
  Sparkles,
  TrendingUp,
  Award,
  Truck,
  HeartHandshake,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { COMPANY_INFO, SERVICE_BADGES } from "@/data/dairyData";

interface WhoWeAreBentoProps {
  onSelectCategory: (categoryId: string) => void;
}

export default function WhoWeAreBento({ onSelectCategory }: WhoWeAreBentoProps) {
  const handleBadgeClick = (badgeId: string) => {
    onSelectCategory(badgeId);
    const catalogElement = document.getElementById("products");
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="about" className="py-20 lg:py-28 bg-[#f4f7fb]/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-jozi-navy/5 border border-jozi-navy/10 text-jozi-navy text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-jozi-cyan" />
            Who We Are
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-jozi-navy tracking-tight mb-4 font-display">
            A Breath of Fresh Nutritious Dairy Products
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Serving Johannesburg and Gauteng commercial canteens, retailers, restaurants, and families with uncompromising dairy excellence.
          </p>
        </div>

        {/* Interactive Dynamic Service Badges Strip */}
        <div className="mb-14">
          <div className="text-center mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Explore Our Core Dairy Lines (Click to View in Catalog)
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {SERVICE_BADGES.map((badge) => (
              <button
                key={badge.id}
                onClick={() => handleBadgeClick(badge.id)}
                className="group flex items-center gap-2.5 px-5 py-3 rounded-full bg-white border border-slate-200 hover:border-jozi-cyan hover:bg-jozi-cyan hover:text-white text-jozi-navy shadow-sm transition-all hover:shadow-glow hover:-translate-y-0.5 text-sm font-bold"
              >
                <span className="text-base group-hover:scale-110 transition-transform">
                  {badge.icon}
                </span>
                <span>{badge.label}</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 group-hover:bg-white/20 text-slate-500 group-hover:text-white transition-colors">
                  {badge.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 gap-6">
          {/* Main Story Bento Card (Col span 7) */}
          <div className="md:col-span-3 lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-soft flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-jozi-cyan/5 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="relative w-16 h-16 rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden flex items-center justify-center p-2">
                  <Image
                    src="/assets/logo.svg"
                    alt="Jozi Dairy Emblem"
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-jozi-cyan">
                    Midrand, Johannesburg
                  </span>
                  <h3 className="text-2xl font-black text-jozi-navy font-display">
                    About Jozi Dairy
                  </h3>
                </div>
              </div>

              {/* Exact Verbatim Text 1 */}
              <p className="text-slate-700 text-base sm:text-lg leading-relaxed mb-6 font-medium">
                &ldquo;{COMPANY_INFO.whoWeAre}&rdquo;
              </p>

              {/* Exact Verbatim Text 2 */}
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-8">
                {COMPANY_INFO.whoWeAreSecondary}
              </p>
            </div>

            <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-jozi-green text-sm font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Certified Cold-Chain Distribution</span>
              </div>
              <a
                href="#contact"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-jozi-cyan hover:text-jozi-navy transition-colors"
              >
                <span>Partner with us today</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* "Let's Grow Together" Bento Card (Col span 5) */}
          <div className="md:col-span-3 lg:col-span-5 bg-gradient-to-br from-jozi-navy to-jozi-navy-light text-white rounded-3xl p-8 sm:p-10 shadow-card flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-jozi-cyan/20 rounded-full blur-xl pointer-events-none" />

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-jozi-cyan text-xs font-bold mb-6 backdrop-blur-md">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Our Commercial Commitment</span>
              </div>

              {/* Exact Live Motto */}
              <h3 className="text-3xl sm:text-4xl font-black tracking-tight mb-4 font-display">
                {COMPANY_INFO.growthMotto}
              </h3>

              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Whether you run an independent coffee shop, supermarket chain, industrial canteen, catering company, or hotel kitchen, our dedicated delivery routes keep your inventory fresh every morning.
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm text-slate-200">
                  <div className="w-2 h-2 rounded-full bg-jozi-cyan"></div>
                  <span>Consistent 6-day weekly delivery schedule</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-200">
                  <div className="w-2 h-2 rounded-full bg-jozi-cyan"></div>
                  <span>Direct trade wholesale rate structures</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-200">
                  <div className="w-2 h-2 rounded-full bg-jozi-cyan"></div>
                  <span>Dedicated account manager & urgent top-ups</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400">Head Office Telephone</span>
                <p className="text-base font-bold text-white">{COMPANY_INFO.phones.office}</p>
              </div>
              <a
                href={COMPANY_INFO.phones.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full bg-jozi-cyan hover:bg-jozi-cyan-light text-white text-xs font-bold transition-all shadow-glow"
              >
                Inquire Rates
              </a>
            </div>
          </div>

          {/* Differentiator Card 1: Mooi River Provenance */}
          <div className="md:col-span-1 lg:col-span-4 bg-white rounded-3xl p-7 border border-slate-200/80 shadow-soft flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-jozi-amber flex items-center justify-center mb-5">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-jozi-navy mb-2">Mooi River Origin</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Raw milk purchased from our primary dairy supplier in Mooi River, Durban/KZN pastures, renowned for superior grass-fed creaminess and butterfat consistency.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500">
              <span>Pure South African Milk</span>
              <span className="text-jozi-amber">Grass-fed Quality</span>
            </div>
          </div>

          {/* Differentiator Card 2: Temperature-Controlled Fleet */}
          <div className="md:col-span-1 lg:col-span-4 bg-white rounded-3xl p-7 border border-slate-200/80 shadow-soft flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-jozi-cyan flex items-center justify-center mb-5">
                <Truck className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-jozi-navy mb-2">Dedicated Gauteng Fleet</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Refrigerated distribution vehicles operating daily out of our central Midrand hub to ensure unbroken temperature control at 4°C until final hand-off.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500">
              <span>Unbroken Cold Chain</span>
              <span className="text-jozi-cyan">Strictly 4°C</span>
            </div>
          </div>

          {/* Differentiator Card 3: Customer Centricity */}
          <div className="md:col-span-1 lg:col-span-4 bg-white rounded-3xl p-7 border border-slate-200/80 shadow-soft flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-jozi-green flex items-center justify-center mb-5">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-jozi-navy mb-2">Best Customer Experience</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                &ldquo;We are not only distributing the best quality dairy products, we also pride ourselves in ensuring the best customer experience.&rdquo;
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500">
              <span>Responsive Dispatch</span>
              <span className="text-jozi-green">Personal Service</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
