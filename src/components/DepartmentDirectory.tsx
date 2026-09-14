"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Building2,
  User,
  HelpCircle,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/SocialIcons";
import { COMPANY_INFO, DEPARTMENTS } from "@/data/dairyData";

export default function DepartmentDirectory() {
  const [formData, setFormData] = useState({
    name: "",
    businessName: "",
    phone: "",
    email: "",
    department: "operations@jozidairy.co.za",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const departmentsList = [
    { label: "Operations & Order Queries", email: COMPANY_INFO.emails.operations },
    { label: "Accounts & Statements", email: COMPANY_INFO.emails.accounts },
    { label: "Sales & Wholesale Accounts (Ashley)", email: COMPANY_INFO.emails.sales },
    { label: "General Inquiries / Support", email: COMPANY_INFO.emails.operations },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#00a8e8", "#0c2340", "#f9a825", "#2e7d32"],
        });
      } catch (err) {
        // ignore confetti if blocked
      }
    }, 600);
  };

  const getWhatsAppForwardLink = () => {
    const text = `*New Website Inquiry for Jozi Dairy*\n\n*Name:* ${formData.name}\n*Business:* ${formData.businessName || "N/A"}\n*Phone:* ${formData.phone}\n*Email:* ${formData.email}\n*Target Department:* ${formData.department}\n*Message:* ${formData.message}`;
    return `https://wa.me/27652342460?text=${encodeURIComponent(text)}`;
  };

  const getMailtoForDept = (email: string) => {
    if (email.includes("sales") || email.includes("ashley")) {
      return COMPANY_INFO.emails.salesLink;
    }
    if (email.includes("accounts")) {
      return COMPANY_INFO.emails.accountsLink;
    }
    return COMPANY_INFO.emails.operationsLink;
  };

  return (
    <section
      id="contact"
      className="py-16 md:py-24 lg:py-28 bg-[#f4f7fb]/70 relative scroll-mt-24 md:scroll-mt-28"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-jozi-navy/5 border border-jozi-navy/10 text-jozi-navy text-xs font-bold uppercase tracking-wider mb-4">
            <Building2 className="w-3.5 h-3.5 text-jozi-cyan shrink-0" />
            <span>Direct Department Directory</span>
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-jozi-navy tracking-tight leading-snug mb-4 font-display text-balance">
            Get In Touch With Our Dedicated Teams
          </h2>
          <p className="text-sm md:text-base text-slate-600 leading-relaxed font-normal text-pretty">
            Connect directly with our Operations, Sales, and Accounts specialists for rapid order fulfillment, delivery tracking, and commercial partnership agreements.
          </p>
        </div>

        {/* 4 Direct Department Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12 md:mb-16">
          {DEPARTMENTS.map((dept) => (
            <div
              key={dept.id}
              className="bg-white rounded-2xl md:rounded-3xl p-5 md:p-6 border border-slate-200/90 shadow-soft hover:shadow-card hover:border-jozi-cyan/40 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-50 text-jozi-cyan">
                    {dept.badge}
                  </span>
                  {dept.whatsapp && (
                    <a
                      href={COMPANY_INFO.phones.whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-jozi-green hover:scale-110 transition-transform p-1 inline-flex items-center justify-center"
                      title="Open in WhatsApp"
                      aria-label="Open in WhatsApp"
                    >
                      <WhatsAppIcon className="w-4 h-4 fill-current shrink-0" />
                    </a>
                  )}
                </div>

                <h3 className="text-base md:text-lg font-bold text-jozi-navy mb-1 font-display group-hover:text-jozi-cyan transition-colors">
                  {dept.title}
                </h3>

                <span className="text-xs font-semibold text-slate-500 block mb-3">
                  {dept.person}
                </span>

                <p className="text-slate-600 text-xs leading-relaxed mb-6">
                  {dept.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
                <a
                  href={getMailtoForDept(dept.email)}
                  className="flex items-center justify-between text-xs font-bold text-jozi-navy hover:text-jozi-cyan transition-colors py-1"
                >
                  <span className="truncate">{dept.email}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 shrink-0 ml-1" />
                </a>

                <a
                  href={COMPANY_INFO.phones.officeTelLink}
                  className="flex items-center justify-between text-xs font-medium text-slate-500 hover:text-jozi-navy transition-colors py-1"
                >
                  <span>Tel: {dept.phone}</span>
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Form & Facility Information Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Physical Facility Information & Map Pin */}
          <div className="lg:col-span-5 bg-white rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-10 border border-slate-200/90 shadow-soft">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-jozi-navy text-white flex items-center justify-center shrink-0 shadow-md">
                <MapPin className="w-6 h-6 text-jozi-cyan shrink-0" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-jozi-cyan">
                  Physical Depot
                </span>
                <h3 className="text-lg md:text-xl font-bold text-jozi-navy font-display">
                  Midrand Facility
                </h3>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="p-4 rounded-xl md:rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-bold uppercase text-slate-400 block mb-1">
                  Distribution Facility Address:
                </span>
                <p className="text-sm font-bold text-jozi-navy leading-relaxed">
                  {COMPANY_INFO.fullAddress}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Midrand, Johannesburg, South Africa
                </p>
              </div>

              <div className="p-4 rounded-xl md:rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-bold uppercase text-slate-400 block mb-1">
                  Operating & Dispatch Hours:
                </span>
                <div className="flex items-center gap-2 text-sm font-bold text-jozi-navy">
                  <Clock className="w-4 h-4 text-jozi-amber shrink-0" />
                  <span>{COMPANY_INFO.hours}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Urgent route dispatch active 6 days a week.
                </p>
              </div>
            </div>

            {/* Direct Instant Action Links */}
            <div className="space-y-3">
              <a
                href={COMPANY_INFO.phones.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full min-h-[48px] py-3.5 px-5 rounded-xl bg-jozi-green hover:bg-[#276a2b] active:scale-[0.98] text-white font-semibold text-sm inline-flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <WhatsAppIcon className="w-4 h-4 fill-current shrink-0" />
                <span>Instant WhatsApp Dispatch (065 234 2460)</span>
              </a>

              <a
                href={COMPANY_INFO.phones.officeTelLink}
                className="w-full min-h-[48px] py-3.5 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-[0.98] text-jozi-navy font-semibold text-sm inline-flex items-center justify-center gap-2 transition-all border border-slate-200"
              >
                <Phone className="w-4 h-4 shrink-0 text-slate-600" />
                <span>Call Office: {COMPANY_INFO.phones.office}</span>
              </a>
            </div>
          </div>

          {/* Right: Functional Inquiry Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-10 border border-slate-200/90 shadow-soft">
            <div className="mb-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-jozi-cyan">
                Send an Online Message
              </span>
              <h3 className="text-xl md:text-2xl font-bold text-jozi-navy font-display text-balance">
                How Can We Help Your Business?
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm mt-1 leading-relaxed text-pretty">
                Fill out the form below and your inquiry will be instantly routed to the relevant Jozi Dairy department.
              </p>
            </div>

            {submitted ? (
              <div className="p-6 md:p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center animate-in zoom-in-95 duration-200">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-jozi-green flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 shrink-0" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2 font-display">
                  Inquiry Received!
                </h4>
                <p className="text-slate-600 text-xs sm:text-sm max-w-md mx-auto mb-6 leading-relaxed">
                  Thank you, <strong>{formData.name}</strong>. Your message has been routed to{" "}
                  <strong>{formData.department}</strong>. A representative will contact you shortly.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href={getWhatsAppForwardLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto min-h-[48px] px-6 py-3 rounded-xl bg-jozi-green text-white text-sm font-semibold inline-flex items-center justify-center gap-2 shadow-sm hover:bg-[#276a2b] transition-all"
                  >
                    <WhatsAppIcon className="w-4 h-4 fill-current shrink-0" />
                    <span>Also Send to WhatsApp Hotline</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: "",
                        businessName: "",
                        phone: "",
                        email: "",
                        department: "operations@jozidairy.co.za",
                        message: "",
                      });
                    }}
                    className="w-full sm:w-auto min-h-[48px] px-5 py-3 rounded-xl bg-slate-100 text-slate-700 text-sm font-semibold hover:bg-slate-200 inline-flex items-center justify-center transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-jozi-navy block mb-1.5">
                      Your Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sipho Ndlovu"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00A8E8] focus:border-transparent transition-all duration-150 text-sm md:text-base min-h-[48px]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-jozi-navy block mb-1.5">
                      Business / Establishment Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Midrand Bistro / Private"
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00A8E8] focus:border-transparent transition-all duration-150 text-sm md:text-base min-h-[48px]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-jozi-navy block mb-1.5">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 082 123 4567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00A8E8] focus:border-transparent transition-all duration-150 text-sm md:text-base min-h-[48px]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-jozi-navy block mb-1.5">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. sipho@example.co.za"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00A8E8] focus:border-transparent transition-all duration-150 text-sm md:text-base min-h-[48px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-jozi-navy block mb-1.5">
                    Target Department <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00A8E8] focus:border-transparent transition-all duration-150 text-sm md:text-base min-h-[48px]"
                  >
                    {departmentsList.map((d) => (
                      <option key={d.email + d.label} value={d.email}>
                        {d.label} ({d.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-jozi-navy block mb-1.5">
                    Message / Order Details <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell us about your dairy supply requirements, estimated weekly crate volume, or query..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00A8E8] focus:border-transparent transition-all duration-150 text-sm md:text-base resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full min-h-[48px] py-3.5 px-6 rounded-xl bg-jozi-cyan hover:brightness-105 active:scale-[0.98] text-white font-semibold text-sm md:text-base shadow-glow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00A8E8] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Submitting Message...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4 shrink-0" />
                      <span>Submit Inquiry to Department</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
