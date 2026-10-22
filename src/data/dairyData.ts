export interface ProductItem {
  id: string;
  name: string;
  category: "milk" | "yoghurt" | "cream" | "amasi" | "juice" | "blend" | "cheese";
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
  { id: "cheese", label: "We do Wholesale Cheese", iconKey: "cheese", count: "Cheddar, Gouda & Mozzarella" },
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
    tagColor: "navy",
  },
  {
    id: "cheddar-cheese",
    name: "Mature & Mild Cheddar",
    category: "cheese",
    subtitle: "Full-bodied South African yellow & white cheddar blocks and catering shreds",
    description:
      "Crafted from 100% pasteurized pasture milk. Rich, creamy, and distinctively savoury with superb melting performance for burgers, gourmet toasties, and catering platters.",
    provenance: "Pasture-reared dairy milk • Sourced via KwaZulu-Natal dairy farms",
    sizes: [
      "2.5kg Catering Block",
      "1kg Wholesale Block",
      "2kg Pre-Shredded / Grated Catering Pouch",
      "500g Consumer Retail Pack",
    ],
    variations: [
      "Mature Yellow Cheddar (Aged 6–9 Months)",
      "Mild White Cheddar",
      "Catering Grated Cheddar",
    ],
    image: "/assets/products/cheddar-cheese.jpg",
    highlightTag: "Aged & Rich Flavor",
    tagColor: "amber",
  },
  {
    id: "gouda-cheese",
    name: "Sweetmilk Gouda",
    category: "cheese",
    subtitle: "Traditional smooth and creamy Dutch-style Gouda wheels and blocks",
    description:
      "A classic South African favourite. Mild, buttery, and effortlessly meltable with a delicate nutty undertone. Essential for breakfast buffets, deli sandwiches, and lunch canteens.",
    provenance: "Full-cream pasture milk • Traditional round wheel and catering block cuts",
    sizes: [
      "2.2kg Whole Wax Wheel",
      "2.5kg Catering Loaf Block",
      "1kg Vacuum Block",
      "500g Deli Cut Wedge",
    ],
    variations: ["Sweetmilk Gouda (Mild)", "Cumin Seed Gouda (Spiced)", "Pre-Sliced 1kg Sandwich Packs"],
    image: "/assets/products/gouda-cheese.jpg",
    highlightTag: "Creamy Sweetmilk",
    tagColor: "amber",
  },
  {
    id: "mozzarella-cheese",
    name: "Culinary Mozzarella",
    category: "cheese",
    subtitle: "High-yield low-moisture mozzarella for pizzerias, trattorias & baked dishes",
    description:
      "Engineered specifically for South African hospitality and pizza ovens. Delivers golden bubbling blister control, outstanding stretch, and zero oil separation under high heat.",
    provenance: "Fresh cow's milk base • Low moisture part-skim for commercial ovens",
    sizes: [
      "2.5kg Pizza Loaf Block",
      "2kg Shredded Pizza Blend Pouch",
      "10kg Master Catering Carton",
    ],
    variations: ["100% Pure Mozzarella Shred", "70/30 Mozzarella-Cheddar Bake Blend"],
    image: "/assets/products/mozzarella-cheese.jpg",
    highlightTag: "High-Heat Stretch",
    tagColor: "cyan",
  },
  {
    id: "feta-cheese",
    name: "Traditional Greek Feta",
    category: "cheese",
    subtitle: "Authentic crumbly, tangy feta in brine for salads, pitas & pastries",
    description:
      "Tangy, saline, and delightfully crumbly feta cheese soaked in fresh natural brine. Retains firmness and clean acidity in high-volume salad preparations and Greek culinary bakes.",
    provenance: "Pasteurized full cream cow's milk • Salt-brined traditional preservation",
    sizes: [
      "2kg Catering Tub in Brine",
      "1kg Vacuum Bulk Slab",
      "400g Retail Deli Tub with Herbs",
    ],
    variations: ["Traditional Plain in Brine", "Black Pepper & Olive Herb Infused"],
    image: "/assets/products/feta-cheese.jpg",
    highlightTag: "Traditional in Brine",
    tagColor: "green",
  },
  {
    id: "dairy-blend",
    name: "Dairy Blend",
    category: "blend",
    subtitle: "High-yield, cost-effective beverage blends for bulk supply",
    description:
      "Cost-effective, high-yield beverage blends engineered for school nutrition, corporate canteens, catering events, and high-volume foodservice providers.",
    provenance: "Foodservice Grade Blend",
    sizes: ["5 Litre Catering Jug", "2 Litre Commercial Bottle", "Custom Bulk Order Supply"],
    image: "/assets/products/dairy-blend.jpg",
    highlightTag: "High-Yield Bulk Supply",
    tagColor: "navy",
  },
];

export interface DetailedCheese {
  id: string;
  name: string;
  subheading: string;
  badge: string;
  badgeColor: "amber" | "cyan" | "green" | "navy";
  description: string;
  tastingNotes: string[];
  specs: {
    fatContent: string;
    aging: string;
    texture: string;
    meltingQuality: string;
    shelfLife: string;
    temperature: string;
  };
  packSizes: {
    size: string;
    target: string;
    code: string;
  }[];
  culinaryApplications: string[];
  image: string;
  pairsWith: string;
}

export const CHEESE_VARIETIES: DetailedCheese[] = [
  {
    id: "mature-cheddar",
    name: "Mature & Mild Cheddar",
    subheading: "Rich, full-bodied yellow and white cheddar blocks, loaves, and catering shreds",
    badge: "Wholesale Top Seller",
    badgeColor: "amber",
    description:
      "Our Cheddar is produced from prime pasture milk sourced from our Mooi River / KZN agricultural network. Carefully aged to develop deep savoury complexity while preserving the perfect sliceability required by busy commercial kitchens.",
    tastingNotes: ["Sharp savoury depth", "Creamy buttery finish", "Clean lactic finish without bitterness"],
    specs: {
      fatContent: "33% – 36% Butterfat",
      aging: "6 to 9 months temperature-controlled cellar aging",
      texture: "Firm, clean-slicing, non-crumbly",
      meltingQuality: "Superior smooth melt, low oil separation",
      shelfLife: "9 months unopened at 4°C",
      temperature: "Refrigerated transport guaranteed at 2°C – 4°C",
    },
    packSizes: [
      { size: "2.5kg Block", target: "Catering, Butcheries & Delis", code: "CHD-BLK-2.5" },
      { size: "2kg Grated Shred", target: "Burger Bars, Pizzerias & Canteens", code: "CHD-GRT-2.0" },
      { size: "1kg Block", target: "Hospitality & Small Commercial", code: "CHD-BLK-1.0" },
      { size: "500g Retail Pack", target: "Supermarkets & Retailers", code: "CHD-RET-500" },
    ],
    culinaryApplications: [
      "Artisan smash burgers and toasted sandwiches",
      "Gratins, macaroni bakes and cheese sauces",
      "Executive boardroom charcuterie and cheese platters",
      "Pre-shredded quick top-ups for commercial canteens",
    ],
    image: "/assets/products/cheddar-cheese.jpg",
    pairsWith: "Fresh farmhouse bread, pickled onions, cold-pressed fruit juices, and savoury preserves.",
  },
  {
    id: "sweetmilk-gouda",
    name: "Sweetmilk Gouda (Boerenkaas Style)",
    subheading: "Smooth, mild and pleasantly buttery traditional round wheels and catering loaves",
    badge: "Traditional South African Classic",
    badgeColor: "amber",
    description:
      "A staple across South African tables and hospitality menus. Jozi Dairy's Sweetmilk Gouda exhibits a gentle buttery sweetness, pliable semi-hard curd structure, and unmatched versatility across breakfast spreads and deli counters.",
    tastingNotes: ["Mild buttery creaminess", "Subtle hazelnut notes", "Soft elastic bite"],
    specs: {
      fatContent: "31% – 34% Butterfat",
      aging: "Mild (4 to 8 weeks) & Mature options",
      texture: "Smooth, semi-hard, pliable curd with sparse eyes",
      meltingQuality: "Velvety, creamy melting profile",
      shelfLife: "6 months unopened at 4°C",
      temperature: "Refrigerated cold-chain at 2°C – 4°C",
    },
    packSizes: [
      { size: "2.2kg Waxed Round Wheel", target: "Deli Displays & Cheese Counters", code: "GDA-WHL-2.2" },
      { size: "2.5kg Catering Loaf", target: "Hotel Breakfasts & Sandwich Prep", code: "GDA-BLK-2.5" },
      { size: "1kg Vacuum Brick", target: "Wholesale Grocery & Commercial", code: "GDA-BLK-1.0" },
      { size: "500g Cut Wedge", target: "Retail Shelves & Convenience", code: "GDA-WDG-500" },
    ],
    culinaryApplications: [
      "Continental hotel breakfast buffets and morning displays",
      "Everyday sandwich production and deli baguette rolls",
      "Cheese boards paired with crackers and figs",
      "Children's school meal programs and institution catering",
    ],
    image: "/assets/products/gouda-cheese.jpg",
    pairsWith: "Seed crackers, fresh grapes, salted butter, and fresh seasonal fruit.",
  },
  {
    id: "culinary-mozzarella",
    name: "Culinary Low-Moisture Mozzarella",
    subheading: "Engineered for high-heat pizza ovens, trattorias, pasta bakes, and calzones",
    badge: "Pizzeria & Hospitality Grade",
    badgeColor: "cyan",
    description:
      "Formulated specifically for the demanding requirements of commercial pizza and Italian catering. Low moisture content prevents soggy pizza crusts, while optimal protein-to-fat balance creates that irresistible golden stringy pull.",
    tastingNotes: ["Fresh milky aroma", "Clean delicate tang", "Neutral savoury backdrop for sauces"],
    specs: {
      fatContent: "28% – 30% Butterfat (dry matter: 45%)",
      aging: "Fresh cultured and brine-hardened",
      texture: "Firm block or pre-tumbled shred (free-flowing)",
      meltingQuality: "Exceptional elasticity & stretch up to 450°C",
      shelfLife: "4 months vacuum packed at 4°C",
      temperature: "Continuous cold-chain at 0°C – 4°C",
    },
    packSizes: [
      { size: "2kg Shredded Pouch", target: "Pizzerias, Trattorias & Fast Food", code: "MOZ-SHR-2.0" },
      { size: "2.5kg Loaf Block", target: "Commercial Kitchen Shredding", code: "MOZ-BLK-2.5" },
      { size: "10kg Master Box (5x2kg)", target: "High-Volume Foodservice Contracts", code: "MOZ-MST-10" },
    ],
    culinaryApplications: [
      "Woodfired and conveyor belt commercial pizza ovens",
      "Lasagnas, pasta bakes, and parmigiana toppings",
      "Cheesy garlic breads, calzones, and focaccias",
      "Deep-fried mozzarella sticks and finger foods",
    ],
    image: "/assets/products/mozzarella-cheese.jpg",
    pairsWith: "San Marzano tomato sugo, fresh basil, oregano, and woodfired sourdough.",
  },
  {
    id: "traditional-feta",
    name: "Traditional Greek-Style Feta in Brine",
    subheading: "Brined, crumbly, tangy white cheese blocks and tubs for salads, wraps & bakes",
    badge: "Authentic Brine Recipe",
    badgeColor: "green",
    description:
      "Immersed in pristine natural sea-salt brine to maintain its fresh creamy tang and distinct crumbly texture. Never chalky or dry — delivering the authentic Mediterranean zest essential for salads, Mediterranean wraps, and spanakopita pastries.",
    tastingNotes: ["Sharp salty tang", "Creamy crumbly mouthfeel", "Refreshing citrus finish"],
    specs: {
      fatContent: "24% – 26% Butterfat",
      aging: "Brine-matured for 30 days minimum",
      texture: "Crumbly, firm, moist curd",
      meltingQuality: "Softens under heat without liquefying",
      shelfLife: "12 months in brine at 4°C",
      temperature: "Refrigerated transport at 2°C – 4°C",
    },
    packSizes: [
      { size: "2kg Catering Bucket in Brine", target: "Restaurants, Caterers & Salad Bars", code: "FET-BCK-2.0" },
      { size: "1kg Vacuum Slab", target: "Deli Pre-portioning & Bakeries", code: "FET-SLB-1.0" },
      { size: "400g Retail Tub in Brine", target: "Supermarkets & Farmstalls", code: "FET-TUB-400" },
    ],
    culinaryApplications: [
      "Greek village salads with Kalamata olives and red onion",
      "Spanakopita, savoury feta pies, and spinach rolls",
      "Gourmet burgers with feta, peppadew, and rocket",
      "Whipped feta dips and mezze platters with olive oil",
    ],
    image: "/assets/products/feta-cheese.jpg",
    pairsWith: "Extra virgin olive oil, dried oregano, sun-ripened tomatoes, and flatbreads.",
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

export interface DetailedProduct {
  slug: string;
  id: string;
  name: string;
  category: "milk" | "yoghurt" | "cream" | "amasi" | "juice" | "blend";
  subtitle: string;
  heroHeadline: string;
  tagline: string;
  badge: string;
  badgeColor: "cyan" | "amber" | "green" | "navy";
  description: string;
  provenanceStory: string;
  image: string;
  highlights: string[];
  specs: { label: string; value: string }[];
  packFormats: {
    name: string;
    size: string;
    packaging: string;
    target: string;
    code: string;
  }[];
  flavours?: string[];
  variations?: string[];
  commercialUseCases: {
    sector: string;
    title: string;
    benefit: string;
    icon: string;
  }[];
  storageNotice: string;
  faqs: { q: string; a: string }[];
}

export const PRODUCT_DETAILS: Record<string, DetailedProduct> = {
  "fresh-milk": {
    slug: "fresh-milk",
    id: "fresh-milk",
    name: "Fresh Milk",
    category: "milk",
    subtitle: "Farm-fresh pasteurized milk from Mooi River, KwaZulu-Natal",
    heroHeadline: "Pure, Pasture-Fed Fresh Milk Delivered Daily Across Gauteng",
    tagline: "Cold-chain guaranteed from lush KwaZulu-Natal grasslands to your doorstep in Midrand and surrounding areas.",
    badge: "Mooi River Sourced",
    badgeColor: "cyan",
    description:
      "We purchase milk from our primary dairy partner based in Durban Mooi River, which we then supply in convenient retail bottles and commercial bulk catering formats. Every litre undergoes stringent quality and cold-chain compliance to ensure natural freshness, high micro-foam frothing performance for baristas, and rich dairy flavour for households and bakeries.",
    provenanceStory:
      "Sourced from free-range pasture dairy herds grazing in Mooi River, KwaZulu-Natal. Transported under continuous temperature-monitored refrigerated conditions via the Durban corridor to our Midrand hub, ensuring peak farm freshness with minimum holding time.",
    image: "/assets/products/fresh-milk.jpeg",
    highlights: [
      "100% Pure Cow's Milk with no added milk powders or reconstitutes",
      "Superior micro-foam stretch for specialty coffee shops and baristas",
      "Daily refrigerated delivery routes across Johannesburg & Pretoria",
      "Available in both rigid recyclable bottles and cost-effective pouch sachets",
    ],
    specs: [
      { label: "Fat Content (Full Cream)", value: "3.4% – 3.8% Butterfat" },
      { label: "Fat Content (Low Fat)", value: "1.5% – 2.0% Butterfat" },
      { label: "Pasteurization", value: "HTST (72°C for 15s) with rapid chilling" },
      { label: "Cold-Chain Standard", value: "Strictly maintained between 2°C and 4°C" },
      { label: "Shelf Life", value: "10 to 12 days unbroken cold chain" },
      { label: "Packaging Material", value: "Food-grade recyclable HDPE bottle & barrier film sachets" },
    ],
    packFormats: [
      {
        name: "Full Cream 2L Bottle",
        size: "2.0 Litres",
        packaging: "Screw-cap HDPE Bottle (Crates of 6)",
        target: "Retailers, Cafes, Corporate & Homes",
        code: "MLK-FC-2L",
      },
      {
        name: "Full Cream 1L Sachet",
        size: "1.0 Litre",
        packaging: "Sealed Poly Pouch (Crates of 10)",
        target: "Cost-Effective Retail, Canteens, Staff Feeding",
        code: "MLK-FC-1L-SCH",
      },
      {
        name: "Low Fat 2L Bottle",
        size: "2.0 Litres",
        packaging: "Screw-cap HDPE Bottle (Crates of 6)",
        target: "Health-conscious retail, Fitness canteens",
        code: "MLK-LF-2L",
      },
      {
        name: "Low Fat 1L Sachet",
        size: "1.0 Litre",
        packaging: "Sealed Poly Pouch (Crates of 10)",
        target: "Institutions, Schools, Budget Retail",
        code: "MLK-LF-1L-SCH",
      },
    ],
    variations: [
      "Full Cream Fresh Milk (2L Bottles & 1L Sachets)",
      "Low Fat Fresh Milk (2L Bottles & 1L Sachets)",
      "Commercial Bulk Crate Allocations (Standing Route Deliveries)",
    ],
    commercialUseCases: [
      {
        sector: "Coffee Shops & Cafes",
        title: "Barista Latte Art & Steaming",
        benefit: "Optimal protein and butterfat balance creates silky, long-lasting micro-foam with glossy finish.",
        icon: "☕",
      },
      {
        sector: "Bakeries & Commercial Kitchens",
        title: "Baking, Pastry & Culinary Batches",
        benefit: "Rich natural creaminess enhances brioche doughs, custards, sauces, and savoury batters.",
        icon: "🥐",
      },
      {
        sector: "Supermarkets & Spaza Shops",
        title: "High-Turnover Retail Shelves",
        benefit: "Fast-moving everyday staple packaged with attractive branding and barcode readiness.",
        icon: "🛒",
      },
      {
        sector: "Corporate & School Feeding",
        title: "High-Volume Routine Supply",
        benefit: "Scheduled morning deliveries direct to cafeteria receiving bays with batch temperature logs.",
        icon: "🏢",
      },
    ],
    storageNotice: "Keep refrigerated strictly between 2°C and 4°C at all times. Consume within 3 days after opening.",
    faqs: [
      {
        q: "Where does your fresh milk originate?",
        a: "Our milk comes from certified pasture dairy farms in Mooi River, KwaZulu-Natal, known for lush green grazing conditions.",
      },
      {
        q: "What is the minimum commercial order volume?",
        a: "We accommodate both small cafe standing orders (from a few crates per drop) up to full pallet allocations for supermarket chains and institutional caterers.",
      },
      {
        q: "Can we set up recurring standing delivery days?",
        a: "Yes! Most of our commercial clients operate on standing schedules (e.g., Monday, Wednesday, Friday mornings) with automated dispatch.",
      },
    ],
  },

  yoghurt: {
    slug: "yoghurt",
    id: "yoghurt",
    name: "Yoghurt & Drinking Yoghurt",
    category: "yoghurt",
    subtitle: "Rich, creamy, delightfully smooth yoghurt in 10+ decadent flavours",
    heroHeadline: "Gourmet Flavoured Yoghurts, Double Cream & Smooth Drinking Yoghurts",
    tagline: "From snackable 175g portions to 5kg commercial catering buckets and refreshing on-the-go drinking bottles.",
    badge: "10+ Decadent Flavours",
    badgeColor: "amber",
    description:
      "Our yoghurt is slowly cultured from fresh pasteurized cow's milk with active probiotic cultures, yielding a luxuriously thick, velvety texture without excessive starch fillers. Available in smooth and fruit-infused varieties ranging from Plain and Double Cream to Strawberry, Apple & Cinnamon, Granadilla, and Choc Chip.",
    provenanceStory:
      "Prepared from farm-fresh dairy milk and infused with premium fruit preparations. Cultured under strict automated incubation controls to preserve live active lactic flora and delicate natural flavours.",
    image: "/assets/products/yoghurt.jpeg",
    highlights: [
      "10+ versatile flavours covering fruit, dessert, and pure double cream styles",
      "Complete sizing spectrum: 175g snack cups, 500g/1kg retail tubs, and 5kg bulk catering buckets",
      "Drinking Yoghurt available in portable 250ml bottles and family 2L bottles",
      "Rich in active probiotic cultures, calcium, and natural dairy protein",
    ],
    specs: [
      { label: "Culture Strain", value: "Active Lactobacillus bulgaricus & Streptococcus thermophilus" },
      { label: "Texture Profile", value: "Smooth, velvety thick-set curd or free-flowing drinking blend" },
      { label: "Fruit Preparations", value: "Real fruit concentrates and natural flavour infusions" },
      { label: "Storage Standard", value: "Chilled continuously at 2°C – 4°C" },
      { label: "Shelf Life", value: "30 days unopened from date of manufacture" },
      { label: "Allergen Notice", value: "Contains Cow's Milk (Dairy). Gluten-free options available" },
    ],
    packFormats: [
      {
        name: "5kg Catering Bucket",
        size: "5.0 kg",
        packaging: "Heavy-duty Foodservice Bucket with Handle",
        target: "Hotels, Breakfast Buffets, Bakeries, Canteens",
        code: "YOG-BKT-5KG",
      },
      {
        name: "1kg Family Tub",
        size: "1.0 kg",
        packaging: "Tamper-evident Round Tub",
        target: "Supermarkets, Delis, Family Consumers",
        code: "YOG-TUB-1KG",
      },
      {
        name: "175g Snack Cups (Single / 6-Pack)",
        size: "175 grams",
        packaging: "Foil-sealed Portion Cup",
        target: "Grab-and-Go Kiosks, School Lunches, Hospitals",
        code: "YOG-CUP-175G",
      },
      {
        name: "Drinking Yoghurt 2L",
        size: "2.0 Litres",
        packaging: "Easy-pour Screw Cap Bottle",
        target: "Family Retail, Canteens, Sports Clubs",
        code: "YOG-DRK-2L",
      },
      {
        name: "Drinking Yoghurt 250ml",
        size: "250 ml",
        packaging: "On-the-go Bottle",
        target: "Convenience Stores, Forecourt Garages, Schools",
        code: "YOG-DRK-250ML",
      },
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
    variations: [
      "175g Individual & 6-Pack Yoghurt Cups",
      "500g & 1kg Family Portion Tubs",
      "5kg Commercial Catering Buckets",
      "Drinking Yoghurt (250ml On-The-Go & 2L Family Bottles)",
    ],
    commercialUseCases: [
      {
        sector: "Hotels & Breakfast Buffets",
        title: "Continental Breakfast Bars",
        benefit: "5kg bulk buckets make parfait bowls, muesli cups, and fruit displays effortless and cost-effective.",
        icon: "🏨",
      },
      {
        sector: "Schools & Hospitals",
        title: "Nutritional Meal Programs",
        benefit: "Individual 175g cups provide pre-portioned, hygienic, calcium-rich dairy snacks with zero mess.",
        icon: "🏫",
      },
      {
        sector: "Forecourts & Convenience Retail",
        title: "Ready-to-Drink Grab & Go",
        benefit: "High-margin 250ml drinking yoghurts are popular breakfast beverage choices for commuters.",
        icon: "🥤",
      },
      {
        sector: "Bakeries & Smoothie Bars",
        title: "Smoothie Bases & Dessert Fillings",
        benefit: "Thick double-cream plain yoghurt provides rich, tangy body for fresh fruit smoothies and cheesecakes.",
        icon: "🍓",
      },
    ],
    storageNotice: "Refrigerate at 2°C – 4°C. Stir gently before serving. Do not freeze.",
    faqs: [
      {
        q: "Can we order assorted flavour packs for retail stores?",
        a: "Yes! We provide mixed-flavour cartons for 175g cups and 250ml drinking bottles to optimize variety on your shelves.",
      },
      {
        q: "What flavours are available in the 5kg catering buckets?",
        a: "Our 5kg buckets are commonly ordered in Plain, Double Cream Plain, Strawberry, and Vanilla, with custom flavours available on advance volume bookings.",
      },
    ],
  },

  "fresh-cream": {
    slug: "fresh-cream",
    id: "fresh-cream",
    name: "Fresh Cream",
    category: "cream",
    subtitle: "Rich, velvety fresh whipping and culinary cream for hospitality & bakeries",
    heroHeadline: "Pure, Unadulterated Whipping Cream for Gourmet Kitchens & Delis",
    tagline: "100% pure cow's milk cream carefully refrigerated to deliver peak whipping volume and silky gloss.",
    badge: "Pure Velvet Texture",
    badgeColor: "cyan",
    description:
      "Our Fresh Cream is separated from pure fresh cow's milk with zero artificial thickeners, gelatins, or vegetable oil extenders. Revered by Gauteng pastry chefs, artisan bakeries, and fine-dining restaurants for its high butterfat stability, luxuriant mouthfeel, and consistent whipping volume that holds sharp peaks for cakes and desserts.",
    provenanceStory:
      "Separated straight from fresh Mooi River dairy milk under delicate mechanical skimming. Rapidly chilled to 2°C to protect delicate fat globules, ensuring that professional chefs achieve maximum aeration and heat resistance.",
    image: "/assets/products/fresh-cream.jpeg",
    highlights: [
      "Minimum 35% butterfat content for supreme whipping volume and stable stiffness",
      "Silky heat tolerance: will not curdle or separate in high-heat pasta reductions and sauces",
      "Clean, naturally sweet dairy profile free from artificial stabilisers or gums",
      "Available in 1 Litre cartons and bulk commercial cartons for wholesale kitchens",
    ],
    specs: [
      { label: "Butterfat Content", value: "35% – 38% pure dairy milkfat" },
      { label: "Whipping Expansion", value: "Expands up to 2.2x liquid volume under whisking" },
      { label: "Additives", value: "0% artificial gums, gelatins, or vegetable fats" },
      { label: "Heat Resistance", value: "Exceptional reduction stability for hot sauces and ganache" },
      { label: "Storage Temperature", value: "Strictly 2°C – 4°C (Do NOT freeze)" },
      { label: "Shelf Life", value: "14 days refrigerated under unbroken cold-chain" },
    ],
    packFormats: [
      {
        name: "1 Litre Pure Cream Carton",
        size: "1.0 Litre",
        packaging: "Gable Top / Screw-cap Liquid Carton",
        target: "Bakeries, Coffee Shops, Restaurants, Retail",
        code: "CRM-1L",
      },
      {
        name: "Master Catering Case (6 x 1L)",
        size: "6.0 Litres",
        packaging: "Sturdy Corrugated Wholesale Carton",
        target: "Pastry Kitchens, Hotel Banqueting, Commercial Caterers",
        code: "CRM-CS-6L",
      },
    ],
    variations: [
      "1 Litre Pure Whipping Cream Carton",
      "Wholesale 6x1L Kitchen Master Cases",
      "Bulk Catering Cream Deliveries",
    ],
    commercialUseCases: [
      {
        sector: "Pastry Kitchens & Bakeries",
        title: "Cakes, Mousses & Chantilly",
        benefit: "Holds stiff decorative piping on specialty celebration cakes without weeping or collapsing.",
        icon: "🎂",
      },
      {
        sector: "Italian & Continental Dining",
        title: "Alfredo, Risotto & Soup Reductions",
        benefit: "Blends seamlessly into simmering reductions without oiling-off, creating rich glossy pasta sauces.",
        icon: "🍲",
      },
      {
        sector: "Artisan Coffee Bars",
        title: "Con Panna & Gourmet Hot Chocolates",
        benefit: "Lends velvet richness to specialty winter coffee drinks and decadent hot chocolates.",
        icon: "☕",
      },
      {
        sector: "Dessert Parlours & Ice Cream Crafters",
        title: "Custard Bases & Gelato",
        benefit: "High milkfat solids guarantee luxurious mouthfeel and creamy ice crystallization resistance.",
        icon: "🍨",
      },
    ],
    storageNotice: "Always keep refrigerated at 2°C – 4°C. Chill whisks and bowls before whipping for optimal stiffness.",
    faqs: [
      {
        q: "Does this cream whip easily by hand and machine?",
        a: "Yes. Due to its pure 35%+ butterfat content, it whips rapidly into stable, glossy peaks within 2 to 3 minutes.",
      },
      {
        q: "Is your fresh cream suitable for hot sauce cooking?",
        a: "Absolutely. Unlike extended shelf-life creams with thickeners, our pure cream reduces cleanly into silky pasta and curry sauces.",
      },
    ],
  },

  amasi: {
    slug: "amasi",
    id: "amasi-buttermilk",
    name: "Cultured Milk (Amasi & Buttermilk)",
    category: "amasi",
    subtitle: "Traditional thick-set Amasi & smooth Buttermilk made from full cream milk",
    heroHeadline: "Authentic, Rich & Tangy Cultured Amasi Made the Traditional Way",
    tagline: "South Africa's beloved cultured dairy staple, fermented to full-cream thick perfection.",
    badge: "Traditional Thick Texture",
    badgeColor: "green",
    description:
      "Jozi Dairy's Cultured Milk products — Amasi and Buttermilk — are crafted strictly from full cream cow's milk fermented with time-honoured culture strains. The result is a smooth, wonderfully tangy, and luxuriously thick spoonable curd that honours traditional South African heritage while fulfilling commercial foodservice requirements.",
    provenanceStory:
      "Crafted with care using heritage mesophilic fermentation cultures. The milk is slowly soured at monitored temperatures until the curds achieve that authentic, rich consistency cherished across households and catering venues nationwide.",
    image: "/assets/products/amasi.jpg",
    highlights: [
      "Authentic thick, spoonable curd texture with distinct natural tangy flavour",
      "100% Full Cream Milk base providing rich satiety and high protein value",
      "Traditional staple for pap, dumplings, bread dipping, and traditional ceremonies",
      "Cultured Buttermilk available in 500ml formats for bakers and tenderizing marinades",
    ],
    specs: [
      { label: "Dairy Base", value: "100% pasteurized full cream cow's milk" },
      { label: "Culture Type", value: "Traditional mesophilic lactic acid starter culture" },
      { label: "Acidity (pH)", value: "Controlled 4.2 – 4.5 for crisp, clean tang" },
      { label: "Consistency", value: "Thick, cohesive curd with smooth pourability" },
      { label: "Shelf Life", value: "21 days refrigerated at 2°C – 4°C" },
      { label: "Nutritional Value", value: "High bio-available calcium, protein, and friendly probiotics" },
    ],
    packFormats: [
      {
        name: "Amasi 2kg Family Bottle",
        size: "2.0 kg",
        packaging: "Sturdy Plastic Jug with Ergonomic Handle",
        target: "Supermarkets, Spazas, Family Consumers, Ceremonies",
        code: "AMS-2KG",
      },
      {
        name: "Amasi 1kg Bottle",
        size: "1.0 kg",
        packaging: "Compact Bottle with Foil Seal Cap",
        target: "Everyday Retail, Convenience Stores, Individual Meal Packs",
        code: "AMS-1KG",
      },
      {
        name: "Cultured Buttermilk 500ml",
        size: "500 ml",
        packaging: "Screw-cap Bottle",
        target: "Bakeries, Fried Chicken Marinades, Delis",
        code: "BTM-500ML",
      },
    ],
    variations: [
      "Traditional Thick Amasi (1kg & 2kg Bottles)",
      "Cultured Buttermilk (500ml Bottles)",
      "Event & Ceremony Bulk Crates (Weddings, Celebrations, Canteens)",
    ],
    commercialUseCases: [
      {
        sector: "Traditional South African Catering",
        title: "Pap & Amasi, Dumplings & Bakes",
        benefit: "Hearty, authentic staple served at corporate cultural luncheons, family celebrations, and mining canteens.",
        icon: "🍲",
      },
      {
        sector: "Artisan Fried Chicken & Grills",
        title: "Buttermilk Marinades & Brining",
        benefit: "Natural lactic acid breaks down meat fibres, resulting in tender, succulent southern-style fried chicken.",
        icon: "🍗",
      },
      {
        sector: "Commercial Bakeries",
        title: "Scones, Soda Breads & Rusks",
        benefit: "Acidity reacts with baking soda to create exceptionally light, fluffy crumb textures in scones and rusks.",
        icon: "🥖",
      },
      {
        sector: "Retail & Wholesalers",
        title: "High-Volume Spaza & Supermarket Sales",
        benefit: "One of the highest-velocity dairy items in Gauteng with dependable year-round sales velocity.",
        icon: "🏪",
      },
    ],
    storageNotice: "Keep refrigerated at 2°C – 4°C. Shake gently or stir before pouring.",
    faqs: [
      {
        q: "Is Jozi Dairy Amasi thick or watery?",
        a: "Our Amasi is celebrated specifically for being genuinely thick and creamy — never thin or watery.",
      },
      {
        q: "Can we order large crates for upcoming events and functions?",
        a: "Yes! We regularly supply wedding caterers, community celebrations, and large events with chilled pallet crates dispatched on the morning of the event.",
      },
    ],
  },

  juice: {
    slug: "juice",
    id: "spring-meadow-juice",
    name: "Spring Meadow Dairy 100% Juice Blend",
    category: "juice",
    subtitle: "100% pure fresh fruit juice blends packed with crisp, natural fruit goodness",
    heroHeadline: "Refreshing 100% Fruit Juice Blends from Spring Meadow Dairy Farm",
    tagline: "Packed with natural fruit vitamins and crisp refreshment in convenient 1.5 Litre bottles.",
    badge: "100% Fruit Juice Blend",
    badgeColor: "amber",
    description:
      "Spring Meadow Dairy 100% Juice Blend delivers crisp, vibrant refreshment made from pure fruit juice concentrates with no added cane sugar. Available in five crowd-favourite flavours: Orange, Mango, Tropical, Pomegranate, and Peach. Perfect for breakfast trays, conference water and juice carafes, school canteens, and family tables.",
    provenanceStory:
      "Crafted by our trusted dairy partner Spring Meadow Dairy in the scenic KwaZulu-Natal midlands. Blended under strict hygienic standards to preserve the vivid fruit flavours, aroma, and rich Vitamin C content.",
    image: "/assets/products/fresh-juice.jpeg",
    highlights: [
      "100% Pure Fruit Juice Blend — no artificial sweeteners or cane sugar additives",
      "Five refreshing flavours: Orange, Mango, Tropical, Pomegranate, and Peach",
      "Generous 1.5 Litre bottle format offering superior value per pour",
      "High natural Vitamin C content for daily immune support",
    ],
    specs: [
      { label: "Juice Purity", value: "100% Reconstituted Fruit Juice Blend" },
      { label: "Flavours Available", value: "Orange, Mango, Tropical Blend, Pomegranate, Peach" },
      { label: "Added Cane Sugar", value: "0% (Natural fruit sugars only)" },
      { label: "Shelf Life", value: "21 days refrigerated at 2°C – 4°C" },
      { label: "Packaging Format", value: "1.5 Litre PET Bottle with Tamper-evident Seal" },
      { label: "Vitamin Enrichment", value: "Naturally rich in Vitamin C" },
    ],
    packFormats: [
      {
        name: "1.5L Individual Bottle",
        size: "1.5 Litres",
        packaging: "Clear PET Bottle with Grip Ribs",
        target: "Retail, Convenience, Grab-and-Go",
        code: "JCE-1.5L-IND",
      },
      {
        name: "Shrink-Wrap Case (6 x 1.5L)",
        size: "9.0 Litres Total",
        packaging: "Heavy Duty Clear Shrink Wrap",
        target: "Caterers, Canteens, Conference Venues",
        code: "JCE-CS-6PK",
      },
    ],
    flavours: ["Orange", "Mango", "Tropical Blend", "Pomegranate", "Peach"],
    variations: [
      "1.5 Litre Single Bottles (All 5 Flavours)",
      "6-Bottle Shrink-Wrap Wholesale Cases",
      "Mixed Flavour Assortment Pallets",
    ],
    commercialUseCases: [
      {
        sector: "Hotel Breakfasts & Conferences",
        title: "Morning Beverage Carafes",
        benefit: "100% blend provides premium quality fruit juice for breakfast stations without premium cocktail pricing.",
        icon: "🏨",
      },
      {
        sector: "School Canteens & Tuckshops",
        title: "Healthier Beverage Alternatives",
        benefit: "Zero added sugar formulation aligns with school nutrition guidelines while offering rich, sweet fruit taste.",
        icon: "🏫",
      },
      {
        sector: "Event & Function Catering",
        title: "Welcome Drinks & Mocktails",
        benefit: "Vibrant fruit colours and clean taste make ideal bases for non-alcoholic punches and tropical mocktails.",
        icon: "🍹",
      },
      {
        sector: "Retail & Forecourt Shelves",
        title: "Family Refreshment Deals",
        benefit: "1.5L size hits the retail sweet-spot for family weekend shopping baskets and braai gatherings.",
        icon: "🛒",
      },
    ],
    storageNotice: "Keep refrigerated at 2°C – 4°C. Shake well before pouring. Serve chilled.",
    faqs: [
      {
        q: "Are there added preservatives or colourings?",
        a: "Our juices are pasteurized for fresh chilled preservation and rely on the natural colour and taste of real fruit.",
      },
      {
        q: "Can we mix and match flavours in a single order?",
        a: "Yes! You can specify any ratio of Orange, Mango, Tropical, Pomegranate, and Peach in your wholesale crate orders.",
      },
    ],
  },

  "dairy-blend": {
    slug: "dairy-blend",
    id: "dairy-blend",
    name: "Dairy Blend",
    category: "blend",
    subtitle: "High-yield, cost-effective beverage blends engineered for bulk supply",
    heroHeadline: "Cost-Effective, High-Yield Dairy Beverage Blend for Institutions & Canteens",
    tagline: "Engineered specifically for school feeding schemes, corporate canteens, and bulk catering.",
    badge: "High-Yield Bulk Supply",
    badgeColor: "navy",
    description:
      "Our Dairy Blend is formulated for high-volume foodservice environments where budget efficiency and reliable nutritional yield are paramount. Providing the taste, creamy mouthfeel, and cooking versatility of dairy at an accessible cost structure, this product is the go-to solution for large institutional caterers, municipal feeding schemes, and industrial canteens.",
    provenanceStory:
      "Formulated and pasteurized under strict quality guidelines to provide a dependable, highly versatile dairy beverage that meets commercial health, safety, and nutritional criteria.",
    image: "/assets/products/dairy-blend.jpg",
    highlights: [
      "Maximum cost efficiency for high-volume daily feeding requirements",
      "Smooth, creamy consistency suitable for beverages, porridges, and bulk baking",
      "Extended stability and reliable uniform texture across large mixing batches",
      "Customizable order sizing from 2L bottles up to 5L jugs and wholesale bulk supply",
    ],
    specs: [
      { label: "Product Class", value: "Foodservice Grade Dairy Blend Beverage" },
      { label: "Formulation", value: "Enriched milk solids, vegetable fat, pasteurized water" },
      { label: "Thermal Stability", value: "Stable for warm tea/coffee service and warm cooking" },
      { label: "Cold-Chain Standard", value: "Refrigerate at 2°C – 4°C" },
      { label: "Shelf Life", value: "14 days refrigerated" },
      { label: "Target Sector", value: "Industrial, Educational & Institutional Foodservice" },
    ],
    packFormats: [
      {
        name: "5 Litre Catering Jug",
        size: "5.0 Litres",
        packaging: "Heavy Duty Plastic Jerry Can with Cap",
        target: "Corporate Canteens, Hostels, Hospitals",
        code: "DBL-JUG-5L",
      },
      {
        name: "2 Litre Commercial Bottle",
        size: "2.0 Litres",
        packaging: "Screw-cap Bottle",
        target: "Staff Canteens, Small Institutions, Budget Retail",
        code: "DBL-BTL-2L",
      },
      {
        name: "Custom Bulk Order Supply",
        size: "Custom Sizing",
        packaging: "Foodservice Containers",
        target: "Government Feeding Schemes, Mining Compounds",
        code: "DBL-BLK-CST",
      },
    ],
    variations: [
      "2 Litre Commercial Bottles",
      "5 Litre Bulk Catering Jugs",
      "Scheduled Daily / Weekly Tanker & Container Deliveries",
    ],
    commercialUseCases: [
      {
        sector: "School Nutrition & Feeding Programs",
        title: "Daily Student Nutrition",
        benefit: "Stretches institutional budget allocations while delivering satisfying taste and energy for growing learners.",
        icon: "🏫",
      },
      {
        sector: "Mining & Industrial Canteens",
        title: "Shift Worker Tea & Breakfast Stations",
        benefit: "Provides consistent whitening power and rich body in hot tea, coffee, and porridge stations.",
        icon: "🏭",
      },
      {
        sector: "High-Volume Event Caterers",
        title: "Large-Scale Cooking & Sauces",
        benefit: "Low-cost alternative for large-batch baking, creamy soups, and traditional side dishes.",
        icon: "🎪",
      },
      {
        sector: "Municipal & NGO Feeding Schemes",
        title: "Community Outreach Support",
        benefit: "Cost-predictable supply contract with direct delivery to municipal drop-off points.",
        icon: "🤝",
      },
    ],
    storageNotice: "Keep chilled between 2°C and 4°C. Shake or stir well before dispensing.",
    faqs: [
      {
        q: "How does Dairy Blend compare to Fresh Milk?",
        a: "Dairy Blend is specially designed for budget-sensitive bulk cooking and beverage applications, providing the mouthfeel and appearance of milk at a significantly lower cost.",
      },
      {
        q: "What is the lead time for 5L catering containers?",
        a: "We maintain active stock at our Midrand hub; standard Gauteng orders are fulfilled on our regular next-day routes.",
      },
    ],
  },
};

