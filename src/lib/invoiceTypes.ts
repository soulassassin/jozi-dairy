export interface InvoiceTaxItem {
  id: string;
  sku: string;
  description: string;
  quantity: number;
  unitPriceExcl: number;
  isZeroRatedVat: boolean; // True for fresh unflavoured cow milk (0% VAT per SARS), false for juices/flavours (15% VAT)
  vatRate: number; // 0 or 0.15
  vatAmount: number;
  lineTotalExcl: number;
  lineTotalIncl: number;
}

export interface SarsTaxInvoiceData {
  invoiceNumber: string; // e.g. JD-2026-0042
  issueDate: string; // YYYY-MM-DD
  dueDate: string; // YYYY-MM-DD
  purchaseOrderNumber?: string;
  deliveryNoteNumber?: string;

  // Supplier Information (Jozi Dairy)
  supplier: {
    name: string;
    tradingName: string;
    vatNumber: string;
    companyRegistration: string;
    physicalAddress: string;
    postalAddress: string;
    phone: string;
    email: string;
    bankDetails: {
      bankName: string;
      accountName: string;
      accountNumber: string;
      branchCode: string;
      accountType: string;
      reference: string;
    };
  };

  // Recipient / Client Information
  client: {
    accountNumber: string;
    name: string;
    tradingName?: string;
    vatNumber?: string;
    registrationNumber?: string;
    contactPerson: string;
    phone: string;
    email: string;
    billingAddress: string;
    deliveryAddress: string;
  };

  items: InvoiceTaxItem[];

  // Tax calculations
  subtotalExcl: number;
  zeroRatedTotal: number;
  standardRatedSubtotal: number;
  vatTotal: number; // 15% on standardRatedSubtotal
  totalAmountDue: number;
  amountPaid: number;
  balanceDue: number;

  paymentTerms: string;
  notes?: string;
}
