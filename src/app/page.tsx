"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import WhoWeAreBento from "@/components/WhoWeAreBento";
import ProductCatalog from "@/components/ProductCatalog";
import ProvenanceSection from "@/components/ProvenanceSection";
import DepartmentDirectory from "@/components/DepartmentDirectory";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import QuoteModal from "@/components/QuoteModal";
import { generateHomeFAQSchema } from "@/lib/seo/schema";

export default function HomePage() {
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [selectedProductForQuote, setSelectedProductForQuote] = useState<string | undefined>(
    undefined
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const handleOpenQuoteModal = (productName?: string) => {
    setSelectedProductForQuote(productName);
    setQuoteModalOpen(true);
  };

  const handleSelectCategoryFromBento = (catId: string) => {
    setSelectedCategory(catId);
  };

  return (
    <main className="min-h-screen flex flex-col bg-white">
      {/* Schema.org General FAQPage Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateHomeFAQSchema()).replace(/</g, "\\u003c"),
        }}
      />

      {/* Top Utility & Sticky Navigation */}
      <Navbar onOpenQuoteModal={() => handleOpenQuoteModal()} />

      {/* Hero Section with Interactive 3D Milk Carton */}
      <HeroSection onOpenQuoteModal={() => handleOpenQuoteModal()} />

      {/* Bento "Who We Are" Section with Interactive Service Badges */}
      <WhoWeAreBento onSelectCategory={handleSelectCategoryFromBento} />

      {/* Modernized Product Catalog */}
      <ProductCatalog
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onOpenQuoteModal={handleOpenQuoteModal}
      />

      {/* Provenance & Cold Chain Logistics Infographic */}
      <ProvenanceSection />

      {/* Direct Department Directory & Functional Inquiry Form */}
      <DepartmentDirectory />

      {/* Modern Navy Footer */}
      <Footer />

      {/* Sticky Mobile Floating WhatsApp Widget */}
      <FloatingWhatsApp />

      {/* Interactive Quotation Calculator Modal */}
      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        initialProduct={selectedProductForQuote}
      />
    </main>
  );
}
