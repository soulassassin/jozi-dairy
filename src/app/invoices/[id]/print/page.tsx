"use client";

import React, { use } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Printer,
  Download,
  ArrowLeft,
  CheckCircle2,
  Building2,
  Phone,
  Mail,
  FileText,
  ShieldCheck,
} from "lucide-react";
import { getSampleInvoice, formatZarCurrency } from "@/lib/invoiceService";

interface PrintInvoicePageProps {
  params: Promise<{ id: string }>;
}

export default function PrintInvoicePage({ params }: PrintInvoicePageProps) {
  const unwrappedParams = use(params);
  const invoiceId = decodeURIComponent(unwrappedParams.id || "JD-2026-0148");
  const invoice = getSampleInvoice(invoiceId);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 print:p-0 print:bg-white text-slate-800">
      {/* Top Action Bar (Hidden during print) */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between print:hidden">
        <Link
          href="/#contact"
          className="inline-flex items-center gap-2 text-sm font-bold text-jozi-navy hover:text-jozi-cyan transition-colors"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" />
          <span>Return to Jozi Dairy</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-jozi-cyan hover:brightness-105 active:scale-[0.98] text-white text-sm font-semibold shadow-glow focus:outline-none focus:ring-2 focus:ring-[#00A8E8] transition-all min-h-[48px]"
          >
            <Printer className="w-4 h-4 shrink-0" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* Official SARS Tax Invoice Container (A4 Printable Canvas) */}
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8 sm:p-12 print:shadow-none print:p-6 print:rounded-none border border-slate-200/90 print:border-none">
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row items-start justify-between gap-6 pb-8 border-b-2 border-slate-200">
          <div>
            <div className="relative h-14 w-48 mb-3">
              <Image
                src="/assets/logo.png"
                alt="Jozi Dairy"
                fill
                priority
                className="object-contain object-left"
              />
            </div>
            <h1 className="text-xl font-bold text-jozi-navy tracking-tight">
              {invoice.supplier.name}
            </h1>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Company Reg: {invoice.supplier.companyRegistration}
              <br />
              <strong className="text-slate-800">SARS VAT Registration No: {invoice.supplier.vatNumber}</strong>
              <br />
              {invoice.supplier.physicalAddress}
              <br />
              Tel: {invoice.supplier.phone} • Email: {invoice.supplier.email}
            </p>
          </div>

          <div className="sm:text-right flex flex-col sm:items-end">
            <span className="inline-block px-4 py-1.5 rounded-full bg-jozi-navy text-white text-sm font-extrabold uppercase tracking-widest mb-3">
              TAX INVOICE
            </span>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Issued in terms of Section 20 of the South African VAT Act No. 89 of 1991
            </p>

            <div className="mt-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-left sm:text-right space-y-1 w-full sm:w-auto">
              <div className="flex justify-between sm:justify-end gap-4 text-xs">
                <span className="text-slate-500 font-semibold">Invoice Number:</span>
                <span className="font-mono font-bold text-jozi-navy">{invoice.invoiceNumber}</span>
              </div>
              <div className="flex justify-between sm:justify-end gap-4 text-xs">
                <span className="text-slate-500 font-semibold">Tax Date:</span>
                <span className="font-semibold text-slate-800">{invoice.issueDate}</span>
              </div>
              <div className="flex justify-between sm:justify-end gap-4 text-xs">
                <span className="text-slate-500 font-semibold">Payment Due:</span>
                <span className="font-semibold text-red-600">{invoice.dueDate}</span>
              </div>
              {invoice.purchaseOrderNumber && (
                <div className="flex justify-between sm:justify-end gap-4 text-xs">
                  <span className="text-slate-500 font-semibold">Client PO Number:</span>
                  <span className="font-mono font-bold text-slate-700">{invoice.purchaseOrderNumber}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Client & Recipient Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 border-b border-slate-200 text-xs">
          <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80">
            <span className="text-[11px] font-bold uppercase tracking-wider text-jozi-cyan block mb-2">
              Billed To (Client / Recipient):
            </span>
            <h3 className="text-sm font-bold text-jozi-navy">{invoice.client.name}</h3>
            {invoice.client.tradingName && (
              <p className="text-xs font-semibold text-slate-600">t/a {invoice.client.tradingName}</p>
            )}
            <p className="mt-2 text-slate-600 leading-relaxed">
              <strong>SARS VAT Number:</strong> {invoice.client.vatNumber || "N/A (Under R5,000 threshold)"}
              <br />
              <strong>Account Ref:</strong> {invoice.client.accountNumber}
              <br />
              <strong>Contact:</strong> {invoice.client.contactPerson} ({invoice.client.phone})
              <br />
              <strong>Email:</strong> {invoice.client.email}
              <br />
              <strong>Billing Address:</strong> {invoice.client.billingAddress}
            </p>
          </div>

          <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80">
            <span className="text-[11px] font-bold uppercase tracking-wider text-jozi-green block mb-2">
              Cold-Chain Delivery Destination:
            </span>
            <p className="text-slate-700 font-medium leading-relaxed">
              <strong>Drop Point:</strong> {invoice.client.deliveryAddress}
              <br />
              <strong>Dispatch Hub:</strong> Jozi Dairy Midrand Depot (Richards Drive)
              <br />
              <strong>Delivery Note:</strong> {invoice.deliveryNoteNumber}
              <br />
              <strong>Transit Status:</strong> Sealed Refrigerated Freight (Logged at 4°C)
              <br />
              <strong>Payment Terms:</strong> {invoice.paymentTerms}
            </p>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="py-6 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-200 text-slate-500 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-2">SKU</th>
                <th className="py-3 px-2">Description</th>
                <th className="py-3 px-2 text-center">Qty</th>
                <th className="py-3 px-2 text-right">Unit Excl</th>
                <th className="py-3 px-2 text-center">VAT %</th>
                <th className="py-3 px-2 text-right">Total Excl</th>
                <th className="py-3 px-2 text-right">VAT (ZAR)</th>
                <th className="py-3 px-2 text-right">Total Incl</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {invoice.items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80">
                  <td className="py-3.5 px-2 font-mono font-semibold text-slate-500">{item.sku}</td>
                  <td className="py-3.5 px-2">
                    <span className="font-bold text-jozi-navy block">{item.description}</span>
                    {item.isZeroRatedVat && (
                      <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block mt-0.5">
                        SARS Zero-Rated (0% VAT - Fresh Milk)
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-2 text-center font-bold">{item.quantity}</td>
                  <td className="py-3.5 px-2 text-right font-mono">{formatZarCurrency(item.unitPriceExcl)}</td>
                  <td className="py-3.5 px-2 text-center font-bold">
                    {item.isZeroRatedVat ? (
                      <span className="text-emerald-700">0%</span>
                    ) : (
                      <span className="text-slate-700">15%</span>
                    )}
                  </td>
                  <td className="py-3.5 px-2 text-right font-mono font-semibold">{formatZarCurrency(item.lineTotalExcl)}</td>
                  <td className="py-3.5 px-2 text-right font-mono text-slate-500">
                    {item.vatAmount > 0 ? formatZarCurrency(item.vatAmount) : "R 0.00"}
                  </td>
                  <td className="py-3.5 px-2 text-right font-mono font-bold text-jozi-navy">
                    {formatZarCurrency(item.lineTotalIncl)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Calculation Summary & Banking Details Split */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-6 border-t-2 border-slate-200">
          {/* Banking Details Box */}
          <div className="md:col-span-6 bg-slate-50 p-5 rounded-2xl border border-slate-200/90 text-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-jozi-navy block mb-2">
              Direct EFT Banking Details:
            </span>
            <div className="space-y-1.5 text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500">Bank:</span>
                <span className="font-bold">{invoice.supplier.bankDetails.bankName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Account Name:</span>
                <span className="font-bold">{invoice.supplier.bankDetails.accountName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Account Number:</span>
                <span className="font-mono font-bold text-jozi-navy text-sm">
                  {invoice.supplier.bankDetails.accountNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Branch Code:</span>
                <span className="font-mono font-bold">{invoice.supplier.bankDetails.branchCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Account Type:</span>
                <span className="font-semibold">{invoice.supplier.bankDetails.accountType}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200">
                <span className="text-slate-500 font-bold">Mandatory Payment Reference:</span>
                <span className="font-mono font-black text-jozi-cyan bg-white px-2 py-0.5 rounded border border-jozi-cyan/30">
                  {invoice.supplier.bankDetails.reference}
                </span>
              </div>
            </div>
            <p className="mt-3 text-[11px] text-slate-500 leading-relaxed">
              Please email proof of payment to{" "}
              <a href="mailto:accounts@jozidairy.co.za" className="text-jozi-cyan font-bold underline">
                accounts@jozidairy.co.za
              </a>
              .
            </p>
          </div>

          {/* SARS Calculation Box */}
          <div className="md:col-span-6 flex flex-col justify-between text-xs">
            <div className="space-y-2 pb-4 border-b border-slate-200">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal (Excl. VAT):</span>
                <span className="font-mono font-bold">{formatZarCurrency(invoice.subtotalExcl)}</span>
              </div>
              <div className="flex justify-between text-emerald-700">
                <span>Zero-Rated Supplies (0% VAT):</span>
                <span className="font-mono font-semibold">{formatZarCurrency(invoice.zeroRatedTotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Standard-Rated Supplies (Excl. VAT):</span>
                <span className="font-mono font-semibold">{formatZarCurrency(invoice.standardRatedSubtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-800 font-bold">
                <span>VAT Total (15% on standard items):</span>
                <span className="font-mono font-bold text-jozi-navy">{formatZarCurrency(invoice.vatTotal)}</span>
              </div>
            </div>

            <div className="pt-3">
              <div className="flex justify-between items-center p-4 rounded-xl bg-jozi-navy text-white shadow-sm">
                <span className="text-sm font-bold uppercase tracking-wider">Total Amount Due:</span>
                <span className="font-mono text-xl sm:text-2xl font-black text-jozi-cyan">
                  {formatZarCurrency(invoice.totalAmountDue)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Guarantee & Compliance Statement */}
        <div className="mt-8 pt-6 border-t border-slate-200 text-center text-slate-400 text-[11px] space-y-1">
          <p className="font-medium text-slate-500">
            {invoice.notes}
          </p>
          <p>
            Jozi Dairy Distribution (Pty) Ltd • Richards Drive, Halfway House, Midrand • Tel: 011 805 1355 • WhatsApp: 065 234 2460
          </p>
        </div>
      </div>
    </div>
  );
}
