const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function main() {
  const publicDir = path.join(__dirname, '..', 'public');
  const ogDir = path.join(publicDir, 'og');
  if (!fs.existsSync(ogDir)) {
    fs.mkdirSync(ogDir, { recursive: true });
  }

  const logoPngPath = path.join(publicDir, 'assets', 'logo.png');
  const logoBuffer = fs.readFileSync(logoPngPath);

  // 1. Generate Favicon Suite
  console.log('Generating favicon suite...');
  // 16x16
  await sharp(logoBuffer)
    .resize(16, 16, { fit: 'contain', background: { r: 12, g: 35, b: 64, alpha: 0 } })
    .png()
    .toFile(path.join(publicDir, 'favicon-16x16.png'));

  // 32x32
  await sharp(logoBuffer)
    .resize(32, 32, { fit: 'contain', background: { r: 12, g: 35, b: 64, alpha: 0 } })
    .png()
    .toFile(path.join(publicDir, 'favicon-32x32.png'));

  // 180x180 apple touch icon (with dark navy rounded background)
  const appleIconSvg = `
  <svg width="180" height="180" viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg">
    <rect width="180" height="180" rx="36" fill="#0C2340"/>
  </svg>`;
  const logoForApple = await sharp(logoBuffer)
    .resize(140, 95, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  await sharp(Buffer.from(appleIconSvg))
    .composite([{ input: logoForApple, gravity: 'center' }])
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));

  // favicon.ico
  await sharp(logoBuffer)
    .resize(48, 48, { fit: 'contain', background: { r: 12, g: 35, b: 64, alpha: 0 } })
    .png()
    .toFile(path.join(publicDir, 'favicon.ico'));

  // site.webmanifest
  const manifest = {
    name: "Jozi Dairy Distribution",
    short_name: "Jozi Dairy",
    description: "Farm-Fresh Dairy Delivered Straight to Your Business & Home in Gauteng",
    start_url: "/",
    display: "standalone",
    background_color: "#FFFFFF",
    theme_color: "#0C2340",
    icons: [
      {
        src: "/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png"
      },
      {
        src: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png"
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png"
      }
    ]
  };
  fs.writeFileSync(path.join(publicDir, 'site.webmanifest'), JSON.stringify(manifest, null, 2));

  // 2. Generate 1200x630 OG Preview Cards
  console.log('Generating 1200x630 OG Preview Cards...');

  const resizedLogo = await sharp(logoBuffer)
    .resize(360, 240, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  const ogCards = [
    {
      filename: 'home-preview.jpg',
      badge: 'MIDRAND HUB • GAUTENG DISTRIBUTION',
      title: 'Wholesale Dairy Distribution',
      subtitle: 'Daily delivery of fresh milk, cultured amasi, gourmet yoghurt & 100% juices across Gauteng.',
      accent: '#00A8E8'
    },
    {
      filename: 'milk-preview.jpg',
      badge: 'MOOI RIVER PASTURES • COLD-CHAIN CERTIFIED',
      title: 'Commercial Fresh Milk Supplier',
      subtitle: '2L bottles & 1L sachets. Pasteurized full cream & low fat milk for retailers, cafes & bakeries.',
      accent: '#00B4D8'
    },
    {
      filename: 'amasi-preview.jpg',
      badge: 'TRADITIONAL CULTURED DAIRY • FULL CREAM',
      title: 'Bulk Amasi & Buttermilk Supplier',
      subtitle: 'Authentic full cream thick amasi (1kg, 2kg) & fresh buttermilk. Commercial institution supply.',
      accent: '#F9A825'
    },
    {
      filename: 'yoghurt-preview.jpg',
      badge: 'ARTISANAL TASTE • 10+ FLAVOURS',
      title: 'Gourmet Yoghurt & Fresh Cream',
      subtitle: 'Double cream, smooth & drinking yoghurt up to 5kg tubs, plus 1L fresh whipping cream.',
      accent: '#E11D48'
    },
    {
      filename: 'services-preview.jpg',
      badge: 'REFRIGERATED COLD-CHAIN LOGISTICS',
      title: 'Delivery Routes & Distribution',
      subtitle: 'Daily 4°C monitored delivery serving Midrand, Sandton, Centurion, Pretoria & East Rand.',
      accent: '#2E7D32'
    },
    {
      filename: 'contact-preview.jpg',
      badge: 'COMMERCIAL ORDERS & DIRECT TRADE',
      title: 'Contact Jozi Dairy Depot',
      subtitle: 'WhatsApp 065 234 2460 • Office 011 805 1355 • The Home Gallery, 124 Richards Dr, Midrand.',
      accent: '#00A8E8'
    }
  ];

  function escapeXml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  for (const card of ogCards) {
    const svgBackground = `
    <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="cyanGlow" cx="85%" cy="20%" r="50%">
          <stop offset="0%" stop-color="${card.accent}" stop-opacity="0.25"/>
          <stop offset="100%" stop-color="#0C2340" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="navyGlow" cx="20%" cy="80%" r="60%">
          <stop offset="0%" stop-color="#071526" stop-opacity="0.8"/>
          <stop offset="100%" stop-color="#0C2340" stop-opacity="0"/>
        </radialGradient>
      </defs>

      <!-- Deep Navy Foundation -->
      <rect width="1200" height="630" fill="#0C2340"/>
      <!-- Ambience lighting -->
      <rect width="1200" height="630" fill="url(#cyanGlow)"/>
      <rect width="1200" height="630" fill="url(#navyGlow)"/>

      <!-- Subtle Grid Dots -->
      <pattern id="dotPattern" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1.5" fill="#FFFFFF" fill-opacity="0.08"/>
      </pattern>
      <rect width="1200" height="630" fill="url(#dotPattern)"/>

      <!-- Accent Top Border -->
      <rect x="0" y="0" width="1200" height="8" fill="${card.accent}"/>

      <!-- Pill Badge -->
      <rect x="80" y="70" width="460" height="36" rx="18" fill="${card.accent}" fill-opacity="0.15" stroke="${card.accent}" stroke-opacity="0.4" stroke-width="1"/>
      <text x="100" y="94" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="800" fill="${card.accent}" letter-spacing="1.5">${escapeXml(card.badge)}</text>

      <!-- Main Headline -->
      <text x="80" y="380" font-family="system-ui, -apple-system, sans-serif" font-size="52" font-weight="900" fill="#FFFFFF" letter-spacing="-0.5">
        ${escapeXml(card.title)}
      </text>

      <!-- Subtitle Description -->
      <text x="80" y="440" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="500" fill="#CBD5E1">
        ${escapeXml(card.subtitle)}
      </text>

      <!-- Bottom Info Bar -->
      <line x1="80" y1="500" x2="1120" y2="500" stroke="#FFFFFF" stroke-opacity="0.12" stroke-width="1.5"/>
      
      <!-- Key Chips -->
      <g transform="translate(80, 535)">
        <text x="0" y="24" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="700" fill="#25D366">WhatsApp: 065 234 2460</text>
        <text x="320" y="24" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="600" fill="#94A3B8">Tel: 011 805 1355</text>
        <text x="560" y="24" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="600" fill="#94A3B8">Midrand, Gauteng</text>
        <text x="820" y="24" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="700" fill="#00A8E8">www.jozidairy.co.za</text>
      </g>
    </svg>`;

    const cardPath = path.join(ogDir, card.filename);
    await sharp(Buffer.from(svgBackground))
      .composite([{ input: resizedLogo, top: 90, left: 80 }])
      .jpeg({ quality: 90 })
      .toFile(cardPath);

    const stats = fs.statSync(cardPath);
    console.log(`Generated ${card.filename}: ${(stats.size / 1024).toFixed(1)} KB`);
  }

  console.log('SEO assets generated successfully!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
