"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import {
  Phone,
  Mail,
  MessageCircle,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Building2,
  User,
  HelpCircle,
  ArrowUpRight,
} from "lucide-react";
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

  return (
    <section id="contact" className="py-20 lg:py-28 bg-[#f4f7fb]/70 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-jozi-navy/5 border border-jozi-navy/10 text-jozi-navy text-xs font-bold uppercase tracking-wider mb-4">
            <Building2 className="w-3.5 h-3.5 text-jozi-cyan" />
            Direct Department Directory
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-jozi-navy tracking-tight mb-4 font-display">
            Get In Touch With Our Dedicated Teams
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Connect directly with our Operations, Sales, and Accounts specialists for rapid order fulfillment, delivery tracking, and commercial partnership agreements.
          </p>
        </div>

        {/* 4 Direct Department Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {DEPARTMENTS.map((dept) => (
            <div
              key={dept.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-soft hover:shadow-card hover:border-jozi-cyan/40 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-50 text-jozi-cyan">
                    {dept.badge}
                  </span>
                  {dept.whatsapp && (
                    <a
                      href={`https://wa.me/27652342460`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-jozi-green hover:scale-110 transition-transform"
                      title="Open in WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4 fill-current" />
                    </a>
                  )}
                </div>

                <h3 className="text-lg font-black text-jozi-navy mb-1 font-display group-hover:text-jozi-cyan transition-colors">
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
                  href={`mailto:${dept.email}`}
                  className="flex items-center justify-between text-xs font-bold text-jozi-navy hover:text-jozi-cyan transition-colors"
                >
                  <span className="truncate">{dept.email}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                </a>

                <a
                  href={`tel:${dept.phone.replace(/\s+/g, "")}`}
                  className="flex items-center justify-between text-xs font-medium text-slate-500 hover:text-jozi-navy transition-colors"
                >
                  <span>Tel: {dept.phone}</span>
                  <Phone className="w-3 h-3 text-slate-400" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Form & Facility Information Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Physical Facility Information & Map Pin */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-soft">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-jozi-navy text-white flex items-center justify-center shadow-md">
                <MapPin className="w-6 h-6 text-jozi-cyan" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-jozi-cyan">
                  Physical Depot
                </span>
                <h3 className="text-xl font-black text-jozi-navy font-display">
                  Midrand Facility
                </h3>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
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

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-bold uppercase text-slate-400 block mb-1">
                  Operating & Dispatch Hours:
                </span>
                <div className="flex items-center gap-2 text-sm font-bold text-jozi-navy">
                  <Clock className="w-4 h-4 text-jozi-amber" />
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
                className="w-full py-3 px-4 rounded-2xl bg-jozi-green hover:bg-jozi-green-fresh text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Instant WhatsApp Dispatch (065 234 2460)</span>
              </a>

              <a
                href={COMPANY_INFO.phones.officeTelLink}
                className="w-full py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-jozi-navy font-bold text-xs flex items-center justify-center gap-2 transition-all"
              >
                <Phone className="w-4 h-4" />
                <span>Call Office: {COMPANY_INFO.phones.office}</span>
              </a>
            </div>
          </div>

          {/* Right: Functional Inquiry Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-soft">
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-jozi-cyan">
                Send an Online Message
              </span>
              <h3 className="text-2xl font-black text-jozi-navy font-display">
                How Can We Help Your Business?
              </h3>
              <p className="text-slate-500 text-xs mt-1">
                Fill out the form below and your inquiry will be instantly routed to the relevant Jozi Dairy department.
              </p>
            </div>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center animate-in zoom-in-95 duration-200">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-jozi-green flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-black text-slate-900 mb-2 font-display">
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
                    className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-jozi-green text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>Also Send to WhatsApp Hotline</span>
                  </a>

                  <button
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
                    className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-jozi-navy block mb-1.5">
                      Your Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sipho Ndlovu"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-jozi-navy focus:outline-none focus:ring-2 focus:ring-jozi-cyan focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-jozi-navy block mb-1.5">
                      Business / Establishment Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Midrand Bistro / Private"
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-jozi-navy focus:outline-none focus:ring-2 focus:ring-jozi-cyan focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-jozi-navy block mb-1.5">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 082 123 4567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-jozi-navy focus:outline-none focus:ring-2 focus:ring-jozi-cyan focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-jozi-navy block mb-1.5">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. sipho@example.co.za"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-jozi-navy focus:outline-none focus:ring-2 focus:ring-jozi-cyan focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-jozi-navy block mb-1.5">
                    Target Department <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-jozi-navy focus:outline-none focus:ring-2 focus:ring-jozi-cyan focus:bg-white transition-all"
                  >
                    {departmentsList.map((d) => (
                      <option key={d.email + d.label} value={d.email}>
                        {d.label} ({d.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-jozi-navy block mb-1.5">
                    Message / Order Details <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell us about your dairy supply requirements, estimated weekly crate volume, or query..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-jozi-navy focus:outline-none focus:ring-2 focus:ring-jozi-cyan focus:bg-white transition-all resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-jozi-cyan hover:bg-jozi-cyan-light text-white font-bold text-sm shadow-glow hover:shadow-glow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Submitting Message...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
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
