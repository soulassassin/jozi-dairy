export interface ProductItem {
  id: string;
  name: string;
  category: "milk" | "yoghurt" | "cream" | "amasi" | "juice" | "blend";
  subtitle: string;
  description: string;
  provenance: string;
  sizes: string[];
  flavours?: string[];
  variations?: string[];
  image: string;
  highlightTag?: string;
  tagColor?: "cyan" | "amber" | "green" | "navy";
}

export const COMPANY_INFO = {
  name: "Jozi Dairy",
  legalName: "Jozi Dairy Distribution",
  city: "Midrand, Johannesburg",
  fullAddress: "The Home Gallery, 124 Richards Drive, Halfway House, Midrand, 1685",
  region: "Gauteng, South Africa",
  sourceOrigin: "Mooi River, KwaZulu-Natal (Durban route)",
  hours: "Mon - Fri: 8:00 - 17:00",
  phones: {
    office: "011 805 1355",
    officeTelLink: "tel:0118051355",
    whatsapp: "065 234 2460",
    whatsappLink: "https://wa.me/27652342460?text=Hello%20Jozi%20Dairy%2C%20I%20would%20like%20to%20inquire%20about%20your%20products.",
  },
  emails: {
    operations: "operations@jozidairy.co.za",
    operationsLink: "mailto:operations@jozidairy.co.za?subject=Order%20Inquiry",
    accounts: "accounts@jozidairy.co.za",
    accountsLink: "mailto:accounts@jozidairy.co.za?subject=Accounts%20Query",
    sales: "ashley@jozidairy.co.za",
    salesLink: "mailto:ashley@jozidairy.co.za?subject=Wholesale%20Quote%20Request",
  },
  social: {
    facebook: "https://fb.me/jozidairy",
    instagram: "https://www.instagram.com/jozi_dairy/",
    whatsapp: "https://wa.me/27652342460",
  },
  tagline: "Farm-Fresh Dairy Delivered Straight to Your Business & Home",
  heroSubcopy:
    "Jozi Dairy is a Dairy Distribution company located in Midrand, Johannesburg. We are a leading milk supplier offering you a breath of fresh nutritious dairy products of top quality.",
  whoWeAre:
    "Jozi Dairy is a Dairy Distribution company located in Midrand, Johannesburg. We are a leading milk supplier offering you a breath of fresh nutritious dairy products of top quality. One taste of our fresh and creamy dairy products, and you're hooked. From fresh cream to fresh juices, we've got all the wonderful milk stuff!",
  whoWeAreSecondary:
    "For all your Dairy needs. At Jozi Dairy we are committed to distribute the best quality dairy products to our consumers. We are not only distributing the best quality dairy products, we also pride ourselves in ensuring the best customer experience.",
  growthMotto: "Let's grow together",
  copyright: "© 2026 Jozi Dairy. All Rights Reserved. Designed by Synapses Networking.",
};

export const SERVICE_BADGES = [
  { id: "milk", label: "We do Fresh Milk", iconKey: "milk", count: "4 Options" },
  { id: "yoghurt", label: "We do Yogurt", iconKey: "yoghurt", count: "10+ Flavours" },
  { id: "cream", label: "We do Fresh Cream", iconKey: "cream", count: "1 Litre Pure" },
  { id: "amasi", label: "We do Amasi", iconKey: "amasi", count: "Traditional Thick" },
  { id: "juice", label: "We do Fruit Juice", iconKey: "juice", count: "100% Blend" },
  { id: "blend", label: "We do Dairy Blend", iconKey: "blend", count: "Bulk Value" },
];

export const PRODUCTS: ProductItem[] = [
  {
    id: "fresh-milk",
    name: "Fresh Milk",
    category: "milk",
    subtitle: "Farm-fresh pasteurized milk from Mooi River, KZN",
    description:
      "We purchase milk from our main Dairy Supplier based in Durban Mooiriver, which we then supply to you in convenient retail and bulk catering sizes with cold-chain guaranteed delivery.",
    provenance: "Sourced from Mooi River, KwaZulu-Natal",
    sizes: [
      "Full Cream: 2 Litre Bottle",
      "Full Cream: 1 Litre Sachet",
      "Low Fat: 2 Litre Bottle",
      "Low Fat: 1 Litre Sachet",
    ],
    image: "/assets/products/fresh-milk.jpeg",
    highlightTag: "Mooi River Sourced",
    tagColor: "cyan",
  },
  {
    id: "yoghurt",
    name: "Yoghurt",
    category: "yoghurt",
    subtitle: "Rich, creamy yet deliciously smooth yoghurt in 10 flavours",
    description:
      "Our rich and creamy yet deliciously smooth yogurt comes in a wide variety of decadent flavours and portion sizes, from individual snack cups to bulk 5kg buckets and refreshing drinking yoghurts.",
    provenance: "Fresh pasteurized dairy base with active cultures",
    sizes: ["175g Cup", "500g / 500ml", "1kg Tub", "5kg Catering Bucket"],
    variations: [
      "6-Pack Yoghurt Cups",
      "Drinking Yoghurt (250ml On-the-Go)",
      "Drinking Yoghurt (2 Litre Family)",
    ],
    flavours: [
      "Plain",
      "Double Cream Plain",
      "Double Thick",
      "Strawberry",
      "Apple and Cinnamon",
      "Madagascan Vanilla",
      "Granadilla",
      "Peach Apricot & Custard",
      "Choc Chip",
      "Fruits of the Valley",
    ],
    image: "/assets/products/yoghurt.jpeg",
    highlightTag: "10 Decadent Flavours",
    tagColor: "amber",
  },
  {
    id: "fresh-cream",
    name: "Fresh Cream",
    category: "cream",
    subtitle: "Rich, velvety fresh cream for catering, bakeries & hospitality",
    description:
      "Only the most smooth and delicious fresh cream. Taste the rich dairy perfection, carefully refrigerated to bring out unbeatable whipping volume and luxurious silky texture.",
    provenance: "100% pure cow's milk cream",
    sizes: ["1 Litre Carton / Bottle"],
    image: "/assets/products/fresh-cream.jpeg",
    highlightTag: "Pure Velvet Texture",
    tagColor: "cyan",
  },
  {
    id: "amasi-buttermilk",
    name: "Cultured Milk (Amasi & Buttermilk)",
    category: "amasi",
    subtitle: "Traditional thick-set Amasi made from full cream milk",
    description:
      "Cultured Milk Products such as Amasi and Buttermilk are made from full cream milk and have a smooth, deliciously tangy and thick creamy texture cherished across South Africa.",
    provenance: "Traditionally cultured full cream milk",
    sizes: ["Amasi: 1kg", "Amasi: 2kg", "Buttermilk: 500ml"],
    image: "/assets/products/amasi.jpg",
    highlightTag: "Traditional Thick Texture",
    tagColor: "green",
  },
  {
    id: "spring-meadow-juice",
    name: "Spring Meadow Dairy 100% Juice Blend",
    category: "juice",
    subtitle: "100% pure fresh fruit juice blends",
    description:
      "Spring Meadow Dairy 100% Juice Blend. We have the freshest 100% fruit Juice blends packed with natural fruit goodness, crisp refreshment, and vitamin-rich nutrition.",
    provenance: "Spring Meadow Dairy Farm, KZN",
    sizes: ["1.5 Litre Bottle"],
    flavours: ["Orange", "Mango", "Tropical", "Pomegranate", "Peach"],
    image: "/assets/products/fresh-juice.jpeg",
    highlightTag: "100% Fruit Juice Blend",
    tagColor: "amber",
  },
  {
    id: "dairy-blend",
    name: "Dairy Blend",
    category: "blend",
    subtitle: "High-yield, cost-effective beverage blends for bulk supply",
    description:
      "Cost-effective, high-yield beverage blends engineered for school nutrition, corporate canteens, catering events, and high-volume foodservice providers.",
    provenance: "Foodservice Grade Blend",
    sizes: ["Bulk Supply / Custom Order Sizing"],
    image: "/assets/products/dairy-blend.jpg",
    highlightTag: "High-Yield Bulk Supply",
    tagColor: "navy",
  },
];

export const DEPARTMENTS = [
  {
    id: "operations",
    title: "Operations & Orders",
    person: "Operations Desk",
    email: "operations@jozidairy.co.za",
    phone: "011 805 1355",
    whatsapp: "065 234 2460",
    description: "Daily route dispatch, recurring standing orders, delivery schedules, and order adjustments.",
    badge: "Active Route Dispatch",
  },
  {
    id: "sales",
    title: "Sales & Wholesale Accounts",
    person: "Ashley (Sales Executive)",
    email: "ashley@jozidairy.co.za",
    phone: "011 805 1355",
    whatsapp: "065 234 2460",
    description: "New commercial client onboarding, retail stocking contracts, catering rate cards, and bulk pricing.",
    badge: "Commercial Pricing",
  },
  {
    id: "accounts",
    title: "Accounts & Invoicing",
    person: "Finance Department",
    email: "accounts@jozidairy.co.za",
    phone: "011 805 1355",
    description: "Monthly statements, invoice reconciliation, proof of payments, and trade credit applications.",
    badge: "Statements & Credit",
  },
  {
    id: "hotline",
    title: "Instant WhatsApp Desk",
    person: "Direct Mobile Support",
    phone: "065 234 2460",
    whatsapp: "065 234 2460",
    email: "operations@jozidairy.co.za",
    description: "Urgent top-up orders, driver ETA tracking, and immediate quotation assistance.",
    badge: "Fast 5-Min Response",
  },
];
