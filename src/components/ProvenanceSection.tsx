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
  Trees,
  Building2,
  Store,
  ArrowRight,
} from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/SocialIcons";
import { COMPANY_INFO } from "@/data/dairyData";

export default function ProvenanceSection() {
  const routeMilestones = [
    {
      step: "01",
      title: "Mooi River Pastures (KZN)",
      role: "Source Dairy Farms",
      desc: "Fresh, unadulterated milk collected from trusted pastures nestled in the KwaZulu-Natal Midlands near Mooi River.",
      icon: Trees,
      badge: "Grass-Fed Excellence",
    },
    {
      step: "02",
      title: "Immediate Cold Filtration & Bottling",
      role: "Spring Meadow Dairy",
      desc: "Pasteurized, homogenized, and flash-chilled to 4°C immediately after milking to lock in natural vitamins and creamy butterfat.",
      icon: Snowflake,
      badge: "Pure Cold-Chain",
    },
    {
      step: "03",
      title: "N3 Express Refrigerated Line-Haul",
      role: "Direct Transit to Gauteng",
      desc: "Dedicated temperature-monitored refrigerated freight trailers transport daily batches direct to Johannesburg.",
      icon: Truck,
      badge: "Under 6 Hours",
    },
    {
      step: "04",
      title: "Midrand Distribution Hub",
      role: "Jozi Dairy Central Depot",
      desc: "Located at The Home Gallery, 124 Richards Drive, Halfway House, Midrand. The central nerve center for order picking and Gauteng fleet routing.",
      icon: Building2,
      badge: "Central Midrand",
    },
    {
      step: "05",
      title: "Doorstep Delivery to Your Facility",
      role: "Commercial & Retail Hand-off",
      desc: "Delivered straight into your cold storage units before your morning opening hours, 6 days a week.",
      icon: Store,
      badge: "Direct Hand-Off",
    },
  ];

  return (
    <section
      id="provenance"
      className="py-16 md:py-24 lg:py-28 bg-jozi-navy text-white relative overflow-hidden bg-dot-pattern-dark scroll-mt-24 md:scroll-mt-28"
    >
      {/* Background Lighting Gradients */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-jozi-cyan/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-jozi-green/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-jozi-cyan text-xs font-bold uppercase tracking-wider mb-4">
            <Compass className="w-4 h-4 shrink-0 text-jozi-cyan" />
            <span>Provenance & Route Logistics</span>
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight leading-snug text-white mb-4 font-display text-balance">
            Direct from Mooi River, KZN to Midrand
          </h2>
          <p className="text-sm md:text-base text-slate-300 leading-relaxed font-normal text-pretty">
            We bridge the best dairy pastures in South Africa directly to Gauteng commercial kitchens, canteens, and retailers without third-party delays.
          </p>
        </div>

        {/* Interactive Route Infographic Timeline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 mb-12 md:mb-16">
          {routeMilestones.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.step}
                className="group bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-2xl md:rounded-3xl p-5 md:p-6 border border-white/10 hover:border-jozi-cyan/50 transition-all duration-300 flex flex-col justify-between relative"
              >
                {/* Connector line on large desktop */}
                {idx < routeMilestones.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-12 w-6 h-0.5 bg-jozi-cyan/40 z-10" />
                )}

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-jozi-cyan/15 border border-jozi-cyan/30 text-jozi-cyan flex items-center justify-center shrink-0">
                      <IconComponent className="w-5 h-5 shrink-0" />
                    </div>
                    <span className="text-xs font-mono font-black text-jozi-cyan px-2.5 py-0.5 rounded-full bg-jozi-cyan/10 border border-jozi-cyan/20">
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
                  <span className="inline-block text-[10px] font-bold uppercase px-2.5 py-1 rounded bg-jozi-cyan/20 text-jozi-cyan">
                    {item.badge}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quality Guarantees Banner */}
        <div className="bg-gradient-to-r from-jozi-navy-light to-jozi-navy rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-10 border border-jozi-cyan/30 shadow-card flex flex-col lg:flex-row items-center justify-between gap-6 md:gap-8">
          <div className="flex items-start sm:items-center gap-4 sm:gap-5 w-full lg:w-auto">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-jozi-cyan/10 border border-jozi-cyan/30 text-jozi-cyan flex items-center justify-center shrink-0 shadow-glow">
              <Snowflake className="w-7 h-7 sm:w-8 sm:h-8 shrink-0" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-jozi-cyan">
                The Jozi Dairy Guarantee
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white font-display text-balance">
                Unbroken Cold Chain Integrity
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm max-w-xl mt-1 leading-relaxed text-pretty">
                Every crate leaving our Midrand facility is logged at 4°C. We ensure fresh taste, longer shelf life, and total safety for your patrons.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full lg:w-auto justify-start lg:justify-end">
            <a
              href={COMPANY_INFO.phones.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-jozi-cyan hover:brightness-105 active:scale-[0.98] text-white font-semibold text-sm shadow-glow hover:shadow-glow-lg transition-all duration-200 min-h-[48px] ring-2 ring-offset-2 ring-jozi-cyan focus:outline-none"
            >
              <WhatsAppIcon className="w-4 h-4 fill-current shrink-0" />
              <span>Order from Midrand Hub</span>
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border-2 border-white/25 text-white hover:bg-white hover:text-jozi-navy font-semibold text-sm transition-colors duration-200 active:scale-[0.98] min-h-[48px] focus:outline-none focus:ring-2 focus:ring-white"
            >
              <span>Contact Route Dispatch</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
