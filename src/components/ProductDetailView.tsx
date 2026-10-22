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
  ChevronRight,
  Package,
  HelpCircle,
  Clock,
  ArrowRight,
  Droplets,
  Share2,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import QuoteModal from "@/components/QuoteModal";
import { WhatsAppIcon } from "@/components/icons/SocialIcons";
import { DetailedProduct, COMPANY_INFO, PRODUCT_DETAILS } from "@/data/dairyData";

interface ProductDetailViewProps {
  product: DetailedProduct;
}

export default function ProductDetailView({ product }: ProductDetailViewProps) {
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [selectedPack, setSelectedPack] = useState<string>(
    product.packFormats[0]?.name || product.name
  );
  const [copiedLink, setCopiedLink] = useState(false);

  const handleShare = () => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const createWhatsAppOrderLink = (packName?: string) => {
    const text = encodeURIComponent(
      `Hello Jozi Dairy! I am inquiring from the website about ordering: *${product.name}* (${packName || selectedPack}). Please share current wholesale rate cards and delivery availability for my area.`
    );
    return `https://wa.me/27652342460?text=${text}`;
  };

  const otherProducts = Object.values(PRODUCT_DETAILS).filter(
    (p) => p.slug !== product.slug
  );

  return (
    <main className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Sticky Navigation */}
      <Navbar onOpenQuoteModal={() => setQuoteModalOpen(true)} />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 bg-jozi-navy text-white overflow-hidden">
        {/* Subtle Ambience */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-jozi-cyan/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-jozi-amber/10 rounded-full blur-3xl pointer-events-none" />

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
            <span className="text-jozi-cyan font-semibold">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Content (7 Cols) */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-jozi-cyan/15 border border-jozi-cyan/30 text-jozi-cyan text-xs font-bold uppercase tracking-wider mb-5">
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span>{product.badge}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl md:text-5xl font-extrabold tracking-tight text-white mb-4 leading-[1.15] font-display">
                {product.heroHeadline}
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-6 font-normal">
                {product.description}
              </p>

              {/* Provenance note */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-8 backdrop-blur-sm flex items-start gap-3">
                <Truck className="w-5 h-5 text-jozi-cyan shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  <span className="font-bold text-white block mb-0.5">Sourcing & Route Provenance</span>
                  {product.provenanceStory}
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <a
                  href={createWhatsAppOrderLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] active:scale-[0.98] text-white font-bold text-sm shadow-lg shadow-green-900/30 transition-all min-h-[48px]"
                >
                  <WhatsAppIcon className="w-4 h-4 fill-current shrink-0" />
                  <span>Order via WhatsApp Desk</span>
                </a>

                <button
                  type="button"
                  onClick={() => setQuoteModalOpen(true)}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-jozi-cyan to-[#0091ca] hover:brightness-105 active:scale-[0.98] text-white font-bold text-sm shadow-glow transition-all min-h-[48px] border border-white/20"
                >
                  <FileText className="w-4 h-4 shrink-0" />
                  <span>Request Wholesale Quote</span>
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex items-center gap-2 px-4 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white text-xs font-semibold border border-white/10 transition-colors min-h-[48px]"
                  title="Copy link to clipboard"
                >
                  <Share2 className="w-4 h-4" />
                  <span>{copiedLink ? "Link Copied!" : "Share"}</span>
                </button>
              </div>
            </div>

            {/* Right Photo Card (5 Cols) */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl bg-slate-900/40 backdrop-blur-md group">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  priority
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-jozi-navy/80 via-transparent to-transparent" />

                {/* Cold Chain Badge overlay */}
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase shadow-md bg-white/95 text-jozi-navy backdrop-blur-sm border border-slate-200">
                    <ThermometerSnowflake className="w-3.5 h-3.5 text-jozi-cyan shrink-0" />
                    <span>Cold-Chain 4°C</span>
                  </span>
                </div>

                {/* Sizing pill */}
                <div className="absolute bottom-4 left-4 right-4 bg-jozi-navy/90 backdrop-blur-md p-3 rounded-2xl border border-white/15">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Primary Formats</div>
                  <div className="text-xs font-bold text-white truncate">
                    {product.packFormats.map((f) => f.size).join(" • ")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights Strip */}
      <section className="bg-white border-b border-slate-200/80 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {product.highlights.map((h, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60">
                <CheckCircle2 className="w-4 h-4 text-jozi-green shrink-0 mt-0.5" />
                <span className="text-xs font-semibold text-slate-700 leading-snug">{h}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Available Packaging Formats */}
      <section className="py-16 md:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-jozi-navy/5 text-jozi-navy text-xs font-bold uppercase tracking-wider mb-3">
              <Package className="w-3.5 h-3.5 text-jozi-cyan" />
              <span>Commercial Packaging Specs</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-jozi-navy tracking-tight font-display">
              Available Wholesale & Retail Pack Formats
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Select a format below to see packaging specifications or order direct crates for next-day Gauteng route delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {product.packFormats.map((pack) => {
              const isSelected = selectedPack === pack.name;
              return (
                <div
                  key={pack.code}
                  onClick={() => setSelectedPack(pack.name)}
                  className={`bg-white rounded-2xl p-6 border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "border-jozi-cyan ring-2 ring-jozi-cyan/20 shadow-md"
                      : "border-slate-200/90 shadow-sm hover:border-slate-300"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {pack.code}
                      </span>
                      {isSelected && (
                        <span className="text-[10px] font-bold text-jozi-cyan uppercase tracking-wider">
                          Selected
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-jozi-navy mb-1">{pack.name}</h3>
                    <div className="text-sm font-semibold text-jozi-cyan mb-3">{pack.size}</div>

                    <div className="space-y-2 text-xs text-slate-600 mb-6">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Packaging</span>
                        <span>{pack.packaging}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Target Application</span>
                        <span>{pack.target}</span>
                      </div>
                    </div>
                  </div>

                  <a
                    href={createWhatsAppOrderLink(pack.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-[#25D366] hover:text-white text-jozi-navy text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <WhatsAppIcon className="w-3.5 h-3.5 fill-current shrink-0" />
                    <span>Inquire via WhatsApp</span>
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Flavours & Variations (If applicable) */}
      {product.flavours && product.flavours.length > 0 && (
        <section className="py-14 bg-white border-t border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-jozi-amber/15 text-jozi-navy text-xs font-bold uppercase tracking-wider mb-3">
                <Layers className="w-3.5 h-3.5 text-jozi-amber" />
                <span>Flavour Portfolio</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-jozi-navy tracking-tight font-display">
                Available In {product.flavours.length} Signature Flavours
              </h2>
              <p className="text-sm text-slate-600 mt-2">
                Order single-flavour crates or customized mixed-flavour cartons tailored for your retail shelves or event.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {product.flavours.map((flavour, idx) => (
                <div
                  key={idx}
                  className="px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-bold text-jozi-navy flex items-center gap-2 hover:border-jozi-cyan transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-jozi-amber" />
                  <span>{flavour}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Technical Specs & Foodservice Applications */}
      <section className="py-16 bg-jozi-tint border-t border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left: Quality & Technical Specs Table */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl p-7 border border-slate-200 shadow-sm">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-jozi-navy/5 text-jozi-navy text-xs font-bold uppercase tracking-wider mb-4">
                  <ShieldCheck className="w-3.5 h-3.5 text-jozi-cyan" />
                  <span>Compliance & Specs</span>
                </div>
                <h3 className="text-xl font-bold text-jozi-navy font-display mb-4">
                  Technical Specifications
                </h3>

                <div className="divide-y divide-slate-100 text-xs">
                  {product.specs.map((s, idx) => (
                    <div key={idx} className="py-3 flex justify-between gap-4">
                      <span className="font-semibold text-slate-500">{s.label}</span>
                      <span className="font-bold text-jozi-navy text-right">{s.value}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block mb-0.5">Cold-Chain Storage Notice</span>
                    {product.storageNotice}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Commercial Foodservice Sectors */}
            <div className="lg:col-span-7">
              <div className="mb-6">
                <div className="text-xs font-bold uppercase tracking-wider text-jozi-cyan mb-2">
                  Commercial Fit
                </div>
                <h3 className="text-2xl font-bold text-jozi-navy font-display">
                  Ideal Commercial Foodservice Applications
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {product.commercialUseCases.map((useCase, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="text-2xl mb-3">{useCase.icon}</div>
                      <div className="text-[11px] font-bold text-jozi-cyan uppercase tracking-wider mb-1">
                        {useCase.sector}
                      </div>
                      <h4 className="text-sm font-bold text-jozi-navy mb-2">{useCase.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">{useCase.benefit}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-jozi-navy/5 text-jozi-navy text-xs font-bold uppercase tracking-wider mb-3">
              <HelpCircle className="w-3.5 h-3.5 text-jozi-cyan" />
              <span>Ordering Guidance</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-jozi-navy tracking-tight font-display">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {product.faqs.map((faq, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <h4 className="text-sm sm:text-base font-bold text-jozi-navy mb-2">{faq.q}</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cross-Sell & Other Dairy Lines */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                More Dairy Lines
              </div>
              <h2 className="text-2xl font-bold text-jozi-navy font-display">
                Explore Other Jozi Dairy Products
              </h2>
            </div>
            <Link
              href="/#products"
              className="text-xs font-bold text-jozi-cyan hover:text-jozi-navy flex items-center gap-1 transition-colors"
            >
              <span>View Full Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Specialty Cheese Highlight Card */}
            <Link
              href="/cheese"
              className="bg-gradient-to-br from-jozi-navy to-[#122e54] text-white rounded-2xl p-5 shadow-md hover:shadow-xl transition-all flex flex-col justify-between group"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-jozi-amber/20 text-jozi-amber border border-jozi-amber/30 inline-block mb-3">
                  Artisanal Range
                </span>
                <h4 className="text-lg font-bold group-hover:text-jozi-amber transition-colors">
                  Wholesale Cheese Range
                </h4>
                <p className="text-xs text-slate-300 mt-2 line-clamp-3">
                  Mature Cheddar, traditional Sweetmilk Gouda wheels, high-heat Mozzarella & Greek Feta in brine.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold text-jozi-amber">
                <span>Explore Cheeses</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {otherProducts.slice(0, 3).map((item) => (
              <Link
                key={item.slug}
                href={`/products/${item.slug}`}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-28 w-full rounded-xl overflow-hidden mb-3 bg-slate-100">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <span className="text-[10px] font-bold text-jozi-cyan uppercase tracking-wider block mb-1">
                    {item.badge}
                  </span>
                  <h4 className="text-base font-bold text-jozi-navy group-hover:text-jozi-cyan transition-colors">
                    {item.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{item.subtitle}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-jozi-navy group-hover:text-jozi-cyan">
                  <span>View Details</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Floating WhatsApp Widget */}
      <FloatingWhatsApp />

      {/* Quote Calculator Modal */}
      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        initialProduct={product.name}
      />
    </main>
  );
}
