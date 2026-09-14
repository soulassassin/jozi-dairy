import { InvoiceTaxItem, SarsTaxInvoiceData } from "./invoiceTypes";
import { COMPANY_INFO } from "@/data/dairyData";

export const VAT_RATE = 0.15; // 15% South African Standard VAT

export function calculateInvoiceTotals(
  items: Array<{
    id: string;
    sku: string;
    description: string;
    quantity: number;
    unitPriceExcl: number;
    isZeroRatedVat: boolean;
  }>
): {
  processedItems: InvoiceTaxItem[];
  subtotalExcl: number;
  zeroRatedTotal: number;
  standardRatedSubtotal: number;
  vatTotal: number;
  totalAmountDue: number;
} {
  let subtotalExcl = 0;
  let zeroRatedTotal = 0;
  let standardRatedSubtotal = 0;
  let vatTotal = 0;

  const processedItems: InvoiceTaxItem[] = items.map((item) => {
    const lineExcl = Number((item.quantity * item.unitPriceExcl).toFixed(2));
    subtotalExcl += lineExcl;

    if (item.isZeroRatedVat) {
      zeroRatedTotal += lineExcl;
      return {
        ...item,
        vatRate: 0,
        vatAmount: 0,
        lineTotalExcl: lineExcl,
        lineTotalIncl: lineExcl,
      };
    } else {
      standardRatedSubtotal += lineExcl;
      const lineVat = Number((lineExcl * VAT_RATE).toFixed(2));
      vatTotal += lineVat;
      return {
        ...item,
        vatRate: VAT_RATE,
        vatAmount: lineVat,
        lineTotalExcl: lineExcl,
        lineTotalIncl: Number((lineExcl + lineVat).toFixed(2)),
      };
    }
  });

  subtotalExcl = Number(subtotalExcl.toFixed(2));
  zeroRatedTotal = Number(zeroRatedTotal.toFixed(2));
  standardRatedSubtotal = Number(standardRatedSubtotal.toFixed(2));
  vatTotal = Number(vatTotal.toFixed(2));
  const totalAmountDue = Number((subtotalExcl + vatTotal).toFixed(2));

  return {
    processedItems,
    subtotalExcl,
    zeroRatedTotal,
    standardRatedSubtotal,
    vatTotal,
    totalAmountDue,
  };
}

export function formatZarCurrency(amount: number): string {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 2,
  }).format(amount);
}

export function getSampleInvoice(invoiceId: string = "JD-2026-0148"): SarsTaxInvoiceData {
  const rawItems = [
    {
      id: "item-1",
      sku: "JD-MILK-FC-2L",
      description: "Full Cream Fresh Milk 2 Litre Bottle (Mooi River Sourced)",
      quantity: 54, // 6 standard crates (9 units per crate)
      unitPriceExcl: 28.50,
      isZeroRatedVat: true, // 0% Zero-rated under SARS VAT Act Schedule 2 Part B
    },
    {
      id: "item-2",
      sku: "JD-MILK-LF-2L",
      description: "Low Fat Fresh Milk 2 Litre Bottle (Mooi River Sourced)",
      quantity: 27, // 3 standard crates
      unitPriceExcl: 28.50,
      isZeroRatedVat: true, // 0% Zero-rated
    },
    {
      id: "item-3",
      sku: "JD-YOG-1KG-STR",
      description: "Smooth Creamy Yoghurt 1kg Tub - Strawberry",
      quantity: 12,
      unitPriceExcl: 34.00,
      isZeroRatedVat: false, // 15% Standard VAT
    },
    {
      id: "item-4",
      sku: "JD-CRM-1L",
      description: "Fresh Whipping Cream 1 Litre Pure Dairy",
      quantity: 10,
      unitPriceExcl: 68.00,
      isZeroRatedVat: false, // 15% Standard VAT
    },
    {
      id: "item-5",
      sku: "JD-JCE-1.5L-ORG",
      description: "Spring Meadow 100% Juice Blend 1.5L - Orange",
      quantity: 18,
      unitPriceExcl: 24.50,
      isZeroRatedVat: false, // 15% Standard VAT
    },
  ];

  const totals = calculateInvoiceTotals(rawItems);

  return {
    invoiceNumber: invoiceId,
    issueDate: "2026-09-14",
    dueDate: "2026-09-21",
    purchaseOrderNumber: "PO-MDR-8892",
    deliveryNoteNumber: "DN-44910",

    supplier: {
      name: "Jozi Dairy Distribution (Pty) Ltd",
      tradingName: "Jozi Dairy",
      vatNumber: "4820291847", // SARS 10-digit VAT
      companyRegistration: "2021/489123/07",
      physicalAddress: COMPANY_INFO.fullAddress,
      postalAddress: "PO Box 4120, Halfway House, Midrand, 1685",
      phone: COMPANY_INFO.phones.office,
      email: COMPANY_INFO.emails.accounts,
      bankDetails: {
        bankName: "First National Bank (FNB)",
        accountName: "Jozi Dairy Distribution",
        accountNumber: "62890145231",
        branchCode: "250655",
        accountType: "Commercial Cheque Account",
        reference: invoiceId,
      },
    },

    client: {
      accountNumber: "JD-C-1048",
      name: "Midrand Artisan Hospitality Group (Pty) Ltd",
      tradingName: "The Midrand Roastery & Cafe",
      vatNumber: "4920194812",
      registrationNumber: "2019/332145/07",
      contactPerson: "Marco Van Zyl",
      phone: "083 456 7890",
      email: "orders@midrandroastery.co.za",
      billingAddress: "Shop 14, Waterfall Corner, Cnr Woodmead & Maxwell Dr, Midrand, 1682",
      deliveryAddress: "Rear Service Dock B, The Midrand Roastery, Waterfall Corner, Midrand",
    },

    items: totals.processedItems,

    subtotalExcl: totals.subtotalExcl,
    zeroRatedTotal: totals.zeroRatedTotal,
    standardRatedSubtotal: totals.standardRatedSubtotal,
    vatTotal: totals.vatTotal,
    totalAmountDue: totals.totalAmountDue,
    amountPaid: 0.00,
    balanceDue: totals.totalAmountDue,

    paymentTerms: "Net 7 Days from Invoice Date (EFT)",
    notes: "Cold-chain distribution verified at 4°C upon delivery hand-off. Please quote invoice number as payment reference on all electronic fund transfers.",
  };
}
