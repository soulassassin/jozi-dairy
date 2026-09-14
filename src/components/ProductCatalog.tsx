"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import {
  Search,
  Filter,
  Check,
  Sparkles,
  MapPin,
  Layers,
  ChevronDown,
  Info,
  X,
} from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/SocialIcons";
import { PRODUCTS, ProductItem, COMPANY_INFO } from "@/data/dairyData";

interface ProductCatalogProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onOpenQuoteModal: (productName?: string) => void;
}

export default function ProductCatalog({
  selectedCategory,
  onSelectCategory,
  onOpenQuoteModal,
}: ProductCatalogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFlavoursModal, setActiveFlavoursModal] = useState<ProductItem | null>(null);

  const categories = [
    { id: "all", label: "All Products" },
    { id: "milk", label: "Fresh Milk" },
    { id: "yoghurt", label: "Yoghurt" },
    { id: "cream", label: "Fresh Cream" },
    { id: "amasi", label: "Amasi & Buttermilk" },
    { id: "juice", label: "100% Juice Blend" },
    { id: "blend", label: "Dairy Blend" },
  ];

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((item) => {
      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCategory;

      const matchesSearch =
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.sizes.some((s) => s.toLowerCase().includes(q)) ||
        (item.flavours && item.flavours.some((f) => f.toLowerCase().includes(q))) ||
        (item.variations && item.variations.some((v) => v.toLowerCase().includes(q)));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const getWhatsAppProductUrl = (productName: string) => {
    const text = `Hello Jozi Dairy, I would like to inquire about ordering / pricing for: *${productName}*. Please provide wholesale / retail supply availability.`;
    return `https://wa.me/27652342460?text=${encodeURIComponent(text)}`;
  };

  return (
    <section
      id="products"
      className="py-16 md:py-24 lg:py-28 bg-white relative scroll-mt-24 md:scroll-mt-28"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-jozi-cyan/10 border border-jozi-cyan/25 text-jozi-navy text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-jozi-cyan shrink-0" />
            <span>Complete Product Catalog</span>
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight leading-snug text-jozi-navy mb-4 font-display text-balance">
            Premium Dairy, Cultured Milk & 100% Juices
          </h2>
          <p className="text-sm md:text-base text-slate-600 leading-relaxed font-normal text-pretty">
            Sourced direct from Mooi River, KZN and distributed across Gauteng. Available for commercial wholesale, retail stockists, hospitality kitchens, and home supply.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-100">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-5 py-3 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all min-h-[44px] sm:min-h-[48px] focus-visible:ring-2 focus-visible:ring-jozi-cyan focus:outline-none ${
                  selectedCategory === cat.id
                    ? "bg-jozi-navy text-white shadow-md shadow-jozi-navy/20 scale-105"
                    : "bg-slate-100 text-slate-600 hover:text-jozi-navy hover:bg-slate-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 shrink-0 pointer-events-none" />
            <input
              type="text"
              placeholder="Search flavours, sizes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00A8E8] focus:border-transparent transition-all duration-150 text-sm md:text-base min-h-[48px]"
            />
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-2xl md:rounded-3xl border border-slate-200/90 shadow-soft hover:shadow-card hover:border-jozi-cyan/40 transition-all duration-300 flex flex-col justify-between overflow-hidden relative"
            >
              {/* Product Card Top: Image Container */}
              <div className="relative h-64 sm:h-72 w-full bg-gradient-to-br from-slate-100 to-[#f4f7fb] overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />

                {/* Highlight Badge */}
                {product.highlightTag && (
                  <div className="absolute top-4 left-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase shadow-sm ${
                        product.tagColor === "amber"
                          ? "bg-jozi-amber text-slate-900"
                          : product.tagColor === "green"
                          ? "bg-jozi-green text-white"
                          : product.tagColor === "navy"
                          ? "bg-jozi-navy text-white"
                          : "bg-jozi-cyan text-white"
                      }`}
                    >
                      {product.highlightTag}
                    </span>
                  </div>
                )}

                {/* Provenance Pill Tag */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200/60 text-[11px] font-bold text-jozi-navy shadow-sm">
                  <MapPin className="w-3.5 h-3.5 text-jozi-cyan shrink-0" />
                  <span className="truncate">{product.provenance}</span>
                </div>
              </div>

              {/* Product Card Content */}
              <div className="p-5 sm:p-7 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-jozi-navy mb-1.5 font-display group-hover:text-jozi-cyan transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold mb-3 leading-relaxed">
                    {product.subtitle}
                  </p>

                  <p className="text-slate-600 text-sm leading-relaxed mb-5">
                    {product.description}
                  </p>

                  {/* Available Sizes Section */}
                  <div className="mb-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                      Available Pack Sizes:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {product.sizes.map((sz) => (
                        <span
                          key={sz}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200/60"
                        >
                          {sz}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Variations (e.g. 6-pack or drinking yoghurt) */}
                  {product.variations && (
                    <div className="mb-4">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                        Format Variations:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {product.variations.map((vr) => (
                          <span
                            key={vr}
                            className="px-2.5 py-1 rounded-lg bg-blue-50 text-jozi-navy text-xs font-bold border border-blue-100"
                          >
                            {vr}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Flavours Pill Button if present */}
                  {product.flavours && (
                    <div className="mb-5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Flavours ({product.flavours.length}):
                        </span>
                        <button
                          type="button"
                          onClick={() => setActiveFlavoursModal(product)}
                          className="text-xs font-bold text-jozi-cyan hover:underline inline-flex items-center gap-1"
                        >
                          <span>View all</span>
                          <Info className="w-3.5 h-3.5 shrink-0" />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {product.flavours.slice(0, 4).map((fl) => (
                          <span
                            key={fl}
                            className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 text-xs font-medium border border-amber-200/60"
                          >
                            {fl}
                          </span>
                        ))}
                        {product.flavours.length > 4 && (
                          <button
                            type="button"
                            onClick={() => setActiveFlavoursModal(product)}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold hover:bg-slate-200 transition-colors"
                          >
                            +{product.flavours.length - 4} more
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Action Buttons */}
                <div className="pt-4 border-t border-slate-100 flex items-center gap-2.5 mt-auto">
                  <a
                    href={getWhatsAppProductUrl(product.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-jozi-green/10 hover:bg-jozi-green hover:text-white text-jozi-green font-semibold text-xs md:text-sm transition-all border border-jozi-green/20 min-h-[48px] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-jozi-green focus:outline-none"
                  >
                    <WhatsAppIcon className="w-4 h-4 fill-current shrink-0" />
                    <span>Order on WhatsApp</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => onOpenQuoteModal(product.name)}
                    className="py-3 px-4 rounded-xl bg-jozi-navy hover:bg-jozi-navy-light active:scale-[0.98] text-white font-semibold text-xs md:text-sm transition-all shadow-sm min-h-[48px] focus-visible:ring-2 focus-visible:ring-jozi-navy focus:outline-none"
                  >
                    Get Quote
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state if search finds nothing */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16 bg-slate-50 rounded-3xl border border-dashed border-slate-300">
            <p className="text-slate-500 font-medium mb-4">
              No products found matching &ldquo;{searchQuery}&rdquo;.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                onSelectCategory("all");
              }}
              className="inline-flex items-center justify-center min-h-[48px] px-6 py-3 rounded-xl bg-jozi-navy text-white text-sm font-semibold hover:bg-jozi-navy-light transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Flavours Modal Detail */}
      {activeFlavoursModal && (
        <div className="fixed inset-0 z-50 bg-jozi-navy/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200 relative">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-jozi-cyan">
                  {activeFlavoursModal.name}
                </span>
                <h4 className="text-xl font-bold text-jozi-navy font-display">Full Flavour Portfolio</h4>
              </div>
              <button
                type="button"
                onClick={() => setActiveFlavoursModal(null)}
                className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 font-bold flex items-center justify-center transition-colors min-h-[44px] min-w-[44px] focus:outline-none focus:ring-2 focus:ring-jozi-cyan"
                aria-label="Close Flavours Modal"
              >
                <X className="w-5 h-5 shrink-0" />
              </button>
            </div>

            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              All flavours are produced with premium fruit purées and authentic extracts, maintaining rich consistency and shelf stability under 4°C refrigeration.
            </p>

            <div className="grid grid-cols-2 gap-2.5 mb-6 max-h-64 overflow-y-auto pr-1">
              {activeFlavoursModal.flavours?.map((f, i) => (
                <div
                  key={f}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold text-jozi-navy"
                >
                  <span className="w-5 h-5 rounded-full bg-jozi-amber/20 text-jozi-amber flex items-center justify-center text-[10px] shrink-0">
                    {i + 1}
                  </span>
                  <span className="truncate">{f}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveFlavoursModal(null)}
                className="min-h-[48px] px-5 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors inline-flex items-center justify-center"
              >
                Close
              </button>
              <a
                href={getWhatsAppProductUrl(activeFlavoursModal.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[48px] px-6 py-3 rounded-xl bg-jozi-green hover:bg-[#276a2b] text-white text-sm font-semibold inline-flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <WhatsAppIcon className="w-4 h-4 fill-current shrink-0" />
                <span>Inquire on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
