"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import { X, Check, Calculator, MessageCircle, Mail, Sparkles, Building2, Package } from "lucide-react";
import { COMPANY_INFO, PRODUCTS } from "@/data/dairyData";

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProduct?: string;
}

export default function QuoteModal({ isOpen, onClose, initialProduct }: QuoteModalProps) {
  const [selectedProducts, setSelectedProducts] = useState<string[]>(
    initialProduct ? [initialProduct] : ["Fresh Milk"]
  );
  const [businessType, setBusinessType] = useState("Coffee Shop / Cafe");
  const [volume, setVolume] = useState("10 - 30 Crates / Week");
  const [frequency, setFrequency] = useState("3x per Week (Mon, Wed, Fri)");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [suburb, setSuburb] = useState("Midrand / Surrounds");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const toggleProduct = (prodName: string) => {
    if (selectedProducts.includes(prodName)) {
      if (selectedProducts.length > 1) {
        setSelectedProducts(selectedProducts.filter((p) => p !== prodName));
      }
    } else {
      setSelectedProducts([...selectedProducts, prodName]);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.55 },
        colors: ["#00a8e8", "#0c2340", "#f9a825", "#2e7d32"],
      });
    } catch (err) {}
  };

  const generateWhatsAppQuote = () => {
    const text = `*New Wholesale / Retail Quote Request - Jozi Dairy*\n\n` +
      `*Client:* ${contactName || "Inquirer"}\n` +
      `*Phone:* ${phone}\n` +
      `*Email:* ${email}\n` +
      `*Business Type:* ${businessType}\n` +
      `*Location/Suburb:* ${suburb}\n` +
      `*Products Required:* ${selectedProducts.join(", ")}\n` +
      `*Estimated Volume:* ${volume}\n` +
      `*Delivery Frequency:* ${frequency}\n\n` +
      `Please provide formal quotation and delivery route availability.`;

    return `https://wa.me/27652342460?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-jozi-navy/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8 animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6 pr-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-jozi-cyan/10 text-jozi-navy text-xs font-bold mb-2">
            <Calculator className="w-3.5 h-3.5 text-jozi-cyan" />
            Instant Rate Calculator & Quote Request
          </div>
          <h3 className="text-2xl font-black text-jozi-navy font-display">
            Get a Customized Supply Quote
          </h3>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Tailored pricing for hospitality, retail supermarkets, cafeterias, and high-volume catering across Gauteng.
          </p>
        </div>

        {submitted ? (
          <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-jozi-green flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-black text-slate-900 mb-2 font-display">
              Quotation Request Logged!
            </h4>
            <p className="text-slate-600 text-sm max-w-md mx-auto mb-6 leading-relaxed">
              Thank you, <strong>{contactName}</strong>. Ashley (Sales) and our Operations team have received your parameters for{" "}
              <strong>{selectedProducts.join(", ")}</strong>.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={generateWhatsAppQuote()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-jozi-green text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Transmit Immediately via WhatsApp</span>
              </a>

              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="w-full sm:w-auto px-5 py-3 rounded-full bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleFormSubmit} className="space-y-5">
            {/* Step 1: Select Products */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                1. Select Products Required:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {PRODUCTS.map((p) => {
                  const isSelected = selectedProducts.includes(p.name);
                  return (
                    <button
                      type="button"
                      key={p.id}
                      onClick={() => toggleProduct(p.name)}
                      className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between ${
                        isSelected
                          ? "bg-jozi-navy text-white border-jozi-navy shadow-sm"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <span className="truncate">{p.name}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-jozi-cyan shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Volume & Frequency */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  2. Estimated Weekly Volume:
                </label>
                <select
                  value={volume}
                  onChange={(e) => setVolume(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-jozi-navy focus:outline-none focus:ring-2 focus:ring-jozi-cyan"
                >
                  <option value="1 - 10 Crates / Week">1 - 10 Crates / Week (Small business / Home)</option>
                  <option value="10 - 30 Crates / Week">10 - 30 Crates / Week (Cafe / Restaurant)</option>
                  <option value="30 - 100 Crates / Week">30 - 100 Crates / Week (Catering / Canteen)</option>
                  <option value="100+ Crates (Wholesale Bulk)">100+ Crates (Supermarket / Wholesale)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  3. Preferred Delivery Cadence:
                </label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-jozi-navy focus:outline-none focus:ring-2 focus:ring-jozi-cyan"
                >
                  <option value="Daily (Mon - Sat)">Daily Morning Dispatch (Mon - Sat)</option>
                  <option value="3x per Week (Mon, Wed, Fri)">3x per Week (Mon, Wed, Fri)</option>
                  <option value="2x per Week (Tue, Thu)">2x per Week (Tue, Thu)</option>
                  <option value="Weekly Bulk Drop">Weekly Bulk Drop</option>
                  <option value="Once-Off Event Order">Once-Off Event Order</option>
                </select>
              </div>
            </div>

            {/* Step 3: Contact Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 border-t border-slate-100">
              <div>
                <label className="text-xs font-bold text-jozi-navy block mb-1">
                  Contact Name / Company <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maria - Midrand Cafe"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-jozi-navy focus:ring-2 focus:ring-jozi-cyan focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-jozi-navy block mb-1">
                  WhatsApp / Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 082 123 4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-jozi-navy focus:ring-2 focus:ring-jozi-cyan focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-jozi-navy block mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. maria@cafe.co.za"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-jozi-navy focus:ring-2 focus:ring-jozi-cyan focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-jozi-navy block mb-1">
                  Delivery Suburb / Area <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Halfway House, Midrand"
                  value={suburb}
                  onChange={(e) => setSuburb(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-jozi-navy focus:ring-2 focus:ring-jozi-cyan focus:outline-none"
                />
              </div>
            </div>

            {/* Submission buttons */}
            <div className="pt-3 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="submit"
                className="w-full sm:flex-1 py-3 rounded-xl bg-jozi-cyan hover:bg-jozi-cyan-light text-white font-bold text-xs shadow-glow transition-all"
              >
                Submit Quote Request to Sales
              </button>

              <a
                href={generateWhatsAppQuote()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-jozi-green hover:bg-jozi-green-fresh text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Send on WhatsApp</span>
              </a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
