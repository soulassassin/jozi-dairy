"use client";

import React from "react";
import {
  MapPin,
  Truck,
  Snowflake,
  ShieldCheck,
  Award,
  Clock,
  Compass,
  CheckCircle2,
} from "lucide-react";
import { COMPANY_INFO } from "@/data/dairyData";

export default function ProvenanceSection() {
  const routeMilestones = [
    {
      step: "01",
      title: "Mooi River Pastures (KZN)",
      role: "Source Dairy Farms",
      desc: "Fresh, unadulterated milk collected from trusted pastures nestled in the KwaZulu-Natal Midlands near Mooi River.",
      icon: "🐄",
      badge: "Grass-Fed Excellence",
    },
    {
      step: "02",
      title: "Immediate Cold Filtration & Bottling",
      role: "Spring Meadow Dairy",
      desc: "Pasteurized, homogenized, and flash-chilled to 4°C immediately after milking to lock in natural vitamins and creamy butterfat.",
      icon: "❄️",
      badge: "Pure Cold-Chain",
    },
    {
      step: "03",
      title: "N3 Express Refrigerated Line-Haul",
      role: "Direct Transit to Gauteng",
      desc: "Dedicated temperature-monitored refrigerated freight trailers transport daily batches direct to Johannesburg.",
      icon: "🚚",
      badge: "Under 6 Hours",
    },
    {
      step: "04",
      title: "Midrand Distribution Hub",
      role: "Jozi Dairy Central Depot",
      desc: "Located at The Home Gallery, 124 Richards Drive, Halfway House, Midrand. The central nerve center for order picking and Gauteng fleet routing.",
      icon: "📍",
      badge: "Central Midrand",
    },
    {
      step: "05",
      title: "Doorstep Delivery to Your Facility",
      role: "Commercial & Retail Hand-off",
      desc: "Delivered straight into your cold storage units before your morning opening hours, 6 days a week.",
      icon: "🏬",
      badge: "Direct Hand-Off",
    },
  ];

  return (
    <section id="provenance" className="py-20 lg:py-28 bg-jozi-navy text-white relative overflow-hidden bg-dot-pattern-dark">
      {/* Background Lighting Gradients */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-jozi-cyan/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-jozi-green/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-jozi-cyan text-xs font-bold uppercase tracking-wider mb-4">
            <Compass className="w-3.5 h-3.5" />
            Provenance & Route Logistics
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4 font-display">
            Direct from Mooi River, KZN to Midrand
          </h2>
          <p className="text-slate-300 text-base sm:text-lg">
            We bridge the best dairy pastures in South Africa directly to Gauteng commercial kitchens, canteens, and retailers without third-party delays.
          </p>
        </div>

        {/* Interactive Route Infographic Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 lg:gap-6 mb-16">
          {routeMilestones.map((item, idx) => (
            <div
              key={item.step}
              className="group bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/10 hover:border-jozi-cyan/50 transition-all duration-300 flex flex-col justify-between relative"
            >
              {/* Connector line on desktop */}
              {idx < routeMilestones.length - 1 && (
                <div className="hidden md:block absolute -right-3 top-12 w-6 h-0.5 bg-jozi-cyan/40 z-10" />
              )}

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-xs font-mono font-black text-jozi-cyan px-2 py-0.5 rounded-full bg-jozi-cyan/10 border border-jozi-cyan/20">
                    {item.step}
                  </span>
                </div>

                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  {item.role}
                </span>

                <h3 className="text-base font-bold text-white mb-2 font-display group-hover:text-jozi-cyan transition-colors">
                  {item.title}
                </h3>

                <p className="text-slate-300 text-xs leading-relaxed mb-4">
                  {item.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-white/10">
                <span className="inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-jozi-cyan/20 text-jozi-cyan">
                  {item.badge}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Quality Guarantees Banner */}
        <div className="bg-gradient-to-r from-jozi-navy-light to-jozi-navy rounded-3xl p-8 sm:p-10 border border-jozi-cyan/30 shadow-card flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-jozi-cyan/10 border border-jozi-cyan/30 text-jozi-cyan flex items-center justify-center shrink-0 shadow-glow">
              <Snowflake className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-jozi-cyan">
                The Jozi Dairy Guarantee
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white font-display">
                Unbroken Cold Chain Integrity
              </h3>
              <p className="text-slate-300 text-sm max-w-xl mt-1">
                Every crate leaving our Midrand facility is logged at 4°C. We ensure fresh taste, longer shelf life, and total safety for your patrons.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto justify-start lg:justify-end">
            <a
              href={COMPANY_INFO.phones.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-full bg-jozi-cyan hover:bg-jozi-cyan-light text-white font-bold text-xs shadow-glow transition-all"
            >
              Order from Midrand Hub
            </a>
            <a
              href="#contact"
              className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all border border-white/15"
            >
              Contact Route Dispatch
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
