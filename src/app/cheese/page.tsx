"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  Award,
  Truck,
  ShieldCheck,
  CheckCircle2,
  FileText,
  ThermometerSnowflake,
  Layers,
  Utensils,
  ChevronRight,
  Flame,
  ArrowRight,
  Filter,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import QuoteModal from "@/components/QuoteModal";
import { WhatsAppIcon } from "@/components/icons/SocialIcons";
import { CHEESE_VARIETIES, DetailedCheese, COMPANY_INFO } from "@/data/dairyData";

export default function CheesePage() {
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [selectedProductForQuote, setSelectedProductForQuote] = useState<string | undefined>(
    "Mature & Mild Cheddar"
  );

  const handleOpenQuoteModal = (productName?: string) => {
    setSelectedProductForQuote(productName || "Mature & Mild Cheddar");
    setQuoteModalOpen(true);
  };

  const filteredCheeses =
    selectedFilter === "all"
      ? CHEESE_VARIETIES
      : CHEESE_VARIETIES.filter((c) => c.id === selectedFilter);

  const createWhatsAppInquiry = (cheeseName: string) => {
    const text = encodeURIComponent(
      `Hello Jozi Dairy! I am viewing your Cheese Range on the website and would like to request wholesale pricing and availability for ${cheeseName}.`
    );
    return `https://wa.me/27652342460?text=${text}`;
  };

  return (
    <main className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Sticky Navigation */}
      <Navbar onOpenQuoteModal={() => handleOpenQuoteModal()} />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-jozi-navy text-white overflow-hidden">
        {/* Hero Background with High-End Photography */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/cheese-hero-banner.jpg"
            alt="Artisanal and Wholesale Cheese Display"
            fill
            priority
            className="object-cover object-center opacity-30 mix-blend-luminosity scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-jozi-navy via-jozi-navy/85 to-jozi-navy/70" />
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-jozi-amber/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-jozi-cyan/15 rounded-full blur-3xl pointer-events-none" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-jozi-cyan transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <Link href="/#products" className="hover:text-jozi-cyan transition-colors">
              Products
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-jozi-amber font-semibold">Wholesale Cheese Selection</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-jozi-amber/20 border border-jozi-amber/40 text-jozi-amber-light text-xs font-bold uppercase tracking-wider mb-5 backdrop-blur-md">
              <Award className="w-4 h-4 text-jozi-amber shrink-0" />
              <span>Premium South African Dairy Selection</span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-[1.1] font-display">
              Artisanal & Commercial{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-jozi-amber via-[#ffd54f] to-jozi-cyan">
                Wholesale Cheeses
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-slate-200 leading-relaxed mb-8 font-normal">
              Crafted from pasture-fed milk sourced directly from Mooi River and KwaZulu-Natal dairy farms. From mature
              sharp Cheddar and traditional Sweetmilk Gouda to low-moisture pizza Mozzarella and authentic Greek Feta in
              brine — cold-chain delivered daily across Gauteng.
            </p>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <a
                href={COMPANY_INFO.phones.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] active:scale-[0.98] text-white font-bold text-sm shadow-lg shadow-green-900/30 transition-all min-h-[48px]"
              >
                <WhatsAppIcon className="w-4 h-4 fill-current shrink-0" />
                <span>Request Cheese Rate Card</span>
              </a>

              <button
                type="button"
                onClick={() => handleOpenQuoteModal("Mature & Mild Cheddar")}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-jozi-cyan to-[#0091ca] hover:brightness-105 active:scale-[0.98] text-white font-bold text-sm shadow-glow transition-all min-h-[48px] border border-white/20"
              >
                <FileText className="w-4 h-4 shrink-0" />
                <span>Calculate Wholesale Quote</span>
              </button>
            </div>
          </div>

          {/* Key Advantages Strip */}
          <div className="mt-14 pt-8 border-t border-white/10 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-jozi-amber/15 border border-jozi-amber/30 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-jozi-amber" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-white uppercase tracking-wider">100% Pasture Milk</div>
                <div className="text-[11px] text-slate-400">Zero synthetic curd substitutes</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-jozi-cyan/15 border border-jozi-cyan/30 flex items-center justify-center shrink-0">
                <ThermometerSnowflake className="w-5 h-5 text-jozi-cyan" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-white uppercase tracking-wider">Cold-Chain Guaranteed</div>
                <div className="text-[11px] text-slate-400">Maintained strictly at 2°C – 4°C</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-jozi-green/20 border border-jozi-green/40 flex items-center justify-center shrink-0">
                <Layers className="w-5 h-5 text-jozi-green-light" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-white uppercase tracking-wider">Versatile Packaging</div>
                <div className="text-[11px] text-slate-400">Blocks, Loaves, Grated & Tubs</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5 text-slate-200" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-white uppercase tracking-wider">Daily Gauteng Routes</div>
                <div className="text-[11px] text-slate-400">Direct dispatch from Midrand Hub</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Cheese Showcase Section */}
      <section id="varieties" className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Heading & Filter Buttons */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-jozi-navy/5 text-jozi-navy text-xs font-bold uppercase tracking-wider mb-3">
                <Filter className="w-3.5 h-3.5 text-jozi-cyan" />
                <span>Product Varieties</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-jozi-navy tracking-tight font-display">
                Explore Our Core Cheese Range
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-xl">
                Select a category below to explore specific aging profiles, culinary melt ratings, pack sizes, and commercial ordering codes.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSelectedFilter("all")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedFilter === "all"
                    ? "bg-jozi-navy text-white shadow-md shadow-jozi-navy/20"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                All Cheeses ({CHEESE_VARIETIES.length})
              </button>
              {CHEESE_VARIETIES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedFilter(c.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedFilter === c.id
                      ? "bg-jozi-navy text-white shadow-md shadow-jozi-navy/20"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {c.name.split("&")[0].trim()}
                </button>
              ))}
            </div>
          </div>

          {/* Cheese Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
            {filteredCheeses.map((cheese) => (
              <div
                key={cheese.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-soft hover:shadow-card transition-all duration-300 flex flex-col overflow-hidden group"
              >
                {/* Image Container with Badge */}
                <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-100">
                  <Image
                    src={cheese.image}
                    alt={cheese.name}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-jozi-navy/60 via-transparent to-transparent" />
                  
                  {/* Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase shadow-md bg-white/95 text-jozi-navy backdrop-blur-sm border border-slate-200">
                      <Award className="w-3.5 h-3.5 text-jozi-amber shrink-0" />
                      {cheese.badge}
                    </span>
                  </div>

                  {/* Melt Rating pill */}
                  <div className="absolute bottom-4 left-4 z-10">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold text-white bg-jozi-navy/85 backdrop-blur-sm border border-white/20">
                      <Flame className="w-3.5 h-3.5 text-jozi-amber" />
                      <span>{cheese.specs.meltingQuality.split(",")[0]}</span>
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Header */}
                    <div className="mb-4">
                      <h3 className="text-2xl font-bold text-jozi-navy font-display">{cheese.name}</h3>
                      <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">{cheese.subheading}</p>
                    </div>

                    <p className="text-sm text-slate-600 leading-relaxed mb-6">{cheese.description}</p>

                    {/* Tasting Notes */}
                    <div className="mb-6">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                        Tasting Profile
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {cheese.tastingNotes.map((note, idx) => (
                          <span
                            key={idx}
                            className="text-xs font-medium px-3 py-1 rounded-full bg-jozi-navy/5 text-jozi-navy border border-jozi-navy/10"
                          >
                            ✓ {note}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Key Technical Specs Table */}
                    <div className="grid grid-cols-2 gap-2.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 mb-6 text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Fat in Dry Matter</span>
                        <span className="font-semibold text-slate-700">{cheese.specs.fatContent}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Aging / Maturation</span>
                        <span className="font-semibold text-slate-700">{cheese.specs.aging}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Texture</span>
                        <span className="font-semibold text-slate-700">{cheese.specs.texture}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Shelf Life</span>
                        <span className="font-semibold text-slate-700">{cheese.specs.shelfLife}</span>
                      </div>
                    </div>

                    {/* Commercial Pack Sizes */}
                    <div className="mb-6">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                        Available Commercial Formats
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {cheese.packSizes.map((pack, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:border-jozi-cyan/50 transition-colors flex items-center justify-between"
                          >
                            <div>
                              <div className="text-xs font-bold text-jozi-navy">{pack.size}</div>
                              <div className="text-[10px] text-slate-500">{pack.target}</div>
                            </div>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                              {pack.code}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Ideal Applications */}
                    <div className="mb-6">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                        Culinary Applications
                      </div>
                      <ul className="space-y-1.5 text-xs text-slate-600">
                        {cheese.culinaryApplications.map((app, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-jozi-green shrink-0 mt-0.5" />
                            <span>{app}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-3">
                    <a
                      href={createWhatsAppInquiry(cheese.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98] min-h-[44px]"
                    >
                      <WhatsAppIcon className="w-4 h-4 fill-current shrink-0" />
                      <span>Order on WhatsApp</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => handleOpenQuoteModal(cheese.name)}
                      className="w-full sm:w-auto py-3 px-4 rounded-xl bg-jozi-navy hover:bg-jozi-navy-light text-white text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] min-h-[44px]"
                    >
                      <FileText className="w-4 h-4 text-jozi-cyan shrink-0" />
                      <span>Add to Quote</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commercial Applications Industry Bento */}
      <section className="py-16 md:py-24 bg-jozi-tint border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-jozi-cyan/10 border border-jozi-cyan/20 text-jozi-cyan-light text-xs font-bold uppercase tracking-wider mb-4">
              <Utensils className="w-4 h-4 text-jozi-cyan" />
              <span>Tailored Foodservice Supply</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-jozi-navy tracking-tight font-display">
              Built for High-Volume Gauteng Foodservice
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-3">
              We understand the critical balance between ingredient performance, cost per portion, and reliable morning delivery schedules.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Sector 1: Pizzerias */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-5 font-bold">
                🍕
              </div>
              <h3 className="text-lg font-bold text-jozi-navy mb-2">Pizzerias & Trattorias</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Our low-moisture Culinary Mozzarella guarantees high-heat blister control and stretch without oily puddling or watery pizza bases.
              </p>
              <div className="text-[11px] font-semibold text-jozi-cyan">
                Recommended: 2kg Shredded Mozzarella & Master 10kg Cartons
              </div>
            </div>

            {/* Sector 2: Burger Bars & Cafes */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-5 font-bold">
                🍔
              </div>
              <h3 className="text-lg font-bold text-jozi-navy mb-2">Burger Bars & Delis</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Sharp Yellow Mature Cheddar blocks and pre-sliced catering formats that melt into patties seamlessly without losing integrity.
              </p>
              <div className="text-[11px] font-semibold text-jozi-cyan">
                Recommended: 2.5kg Mature Cheddar Block & 2kg Shred
              </div>
            </div>

            {/* Sector 3: Hotels & Breakfast Buffets */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center mb-5 font-bold">
                🥐
              </div>
              <h3 className="text-lg font-bold text-jozi-navy mb-2">Hotels & Catering</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Mild Sweetmilk Gouda wheels for morning buffet boards, continental cold cuts, and high-turnover banquet catering.
              </p>
              <div className="text-[11px] font-semibold text-jozi-cyan">
                Recommended: 2.2kg Waxed Round Gouda Wheel
              </div>
            </div>

            {/* Sector 4: Salad Bars & Greek Kitchens */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center mb-5 font-bold">
                🥗
              </div>
              <h3 className="text-lg font-bold text-jozi-navy mb-2">Salad Bars & Bakeries</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Natural salt-brined Feta blocks that retain crumbly firmness in dressing and deliver authentic Mediterranean tang in pastries.
              </p>
              <div className="text-[11px] font-semibold text-jozi-cyan">
                Recommended: 2kg Catering Bucket in Natural Brine
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cold Chain Logistics & Sourcing Assurance */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-jozi-navy via-jozi-navy-light to-jozi-navy rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-card">
            <div className="absolute right-0 top-0 w-80 h-80 bg-jozi-cyan/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-jozi-cyan text-xs font-bold uppercase tracking-wider mb-4 border border-white/10">
                  <ShieldCheck className="w-4 h-4 text-jozi-cyan" />
                  <span>Quality Assurance Standard</span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight font-display mb-4">
                  Guaranteed Cold-Chain Logistics Across Gauteng
                </h2>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                  From refrigerated trunking out of Mooi River and KZN to our climate-controlled Midrand distribution
                  centre and final-mile refrigerated vehicles: your cheese arrives in prime cellar-fresh condition at 2°C – 4°C.
                </p>

                <div className="mt-6 flex flex-wrap gap-4 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-jozi-cyan shrink-0" />
                    <span>HACCP & Health Inspected Facility</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-jozi-cyan shrink-0" />
                    <span>Standing Weekly Delivery Windows</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-jozi-cyan shrink-0" />
                    <span>Batch Quality & Expiry Date Logging</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
                <a
                  href={COMPANY_INFO.phones.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-6 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs md:text-sm font-bold flex items-center justify-center gap-2.5 shadow-md transition-all active:scale-[0.98]"
                >
                  <WhatsAppIcon className="w-4 h-4 fill-current shrink-0" />
                  <span>Chat to Ashley (Sales Rep)</span>
                </a>

                <button
                  type="button"
                  onClick={() => handleOpenQuoteModal("Mature & Mild Cheddar")}
                  className="w-full py-3.5 px-6 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs md:text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  <FileText className="w-4 h-4 text-jozi-cyan shrink-0" />
                  <span>Request Full Price List</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Floating WhatsApp Widget */}
      <FloatingWhatsApp />

      {/* Quotation Calculator Modal */}
      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        initialProduct={selectedProductForQuote}
      />
    </main>
  );
}
