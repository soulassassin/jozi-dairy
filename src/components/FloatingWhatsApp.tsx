"use client";

import React, { useState } from "react";
import { Phone, X } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/SocialIcons";
import { COMPANY_INFO } from "@/data/dairyData";

export default function FloatingWhatsApp() {
  const [isOpen, setIsOpen] = useState(false);

  const quickPrompts = [
    "Hi Jozi Dairy, I want to place a milk order today.",
    "Hi, please send me your wholesale pricing catalogue.",
    "Hello, checking delivery availability for Midrand / surrounding area.",
  ];

  const getUrlForPrompt = (prompt: string) => {
    return `https://wa.me/27652342460?text=${encodeURIComponent(prompt)}`;
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Expanded Quick Message Card */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-88 bg-white rounded-3xl shadow-2xl border border-slate-200/90 p-5 animate-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-sm">
                <WhatsAppIcon className="w-4 h-4 fill-current shrink-0" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-jozi-navy">Jozi Dairy Support</h4>
                <span className="text-[10px] text-green-600 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                  Online • Mon - Fri 8:00 - 17:00
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-[#00A8E8]"
              aria-label="Close Chat Window"
            >
              <X className="w-4 h-4 shrink-0" />
            </button>
          </div>

          <p className="text-xs text-slate-600 mb-3 leading-relaxed">
            Welcome to Jozi Dairy Midrand. How can we help your business today?
          </p>

          <div className="space-y-1.5 mb-4">
            {quickPrompts.map((p, i) => (
              <a
                key={i}
                href={getUrlForPrompt(p)}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 text-[11px] font-semibold text-slate-700 hover:text-emerald-800 transition-colors border border-slate-100 hover:border-emerald-200"
              >
                &ldquo;{p}&rdquo;
              </a>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
            <a
              href={COMPANY_INFO.phones.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-h-[44px] py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5 shadow-sm transition-all"
            >
              <WhatsAppIcon className="w-4 h-4 fill-current shrink-0" />
              <span>Open Chat</span>
            </a>

            <a
              href={COMPANY_INFO.phones.officeTelLink}
              className="min-h-[44px] py-2.5 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-jozi-navy text-xs font-semibold inline-flex items-center gap-1.5 transition-colors border border-slate-200"
              title="Call Office: 011 805 1355"
            >
              <Phone className="w-3.5 h-3.5 shrink-0 text-slate-600" />
              <span>Call</span>
            </a>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="group relative inline-flex items-center justify-center gap-2.5 p-3.5 sm:px-5 sm:py-3.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] active:scale-[0.98] text-white shadow-xl hover:shadow-2xl transition-all duration-300 min-h-[48px] min-w-[48px] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#25D366]"
          aria-label="Toggle WhatsApp Customer Desk"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
          </span>

          <WhatsAppIcon className="w-5 h-5 fill-current shrink-0" />
          <span className="text-xs font-bold tracking-wide hidden sm:inline">
            WhatsApp Desk
          </span>

          {isOpen ? (
            <X className="w-4 h-4 shrink-0 ml-0.5" />
          ) : (
            <span className="text-[11px] bg-white/20 px-2 py-0.5 rounded-full font-bold hidden md:inline">
              065 234 2460
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
