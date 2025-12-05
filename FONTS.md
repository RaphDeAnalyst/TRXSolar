This is a comprehensive typography style guide tailored for a Solar Retail Website.

This report is structured as an internal design system document (like those used at Meta or Google) to ensure scalability, accessibility, and high conversion.

📑 Executive Summary: The "Solar Retail" Aesthetic
For a solar retail site, the typography must solve three specific psychological challenges:

Trust: "Is this company legitimate?" (Requires clean, stable, authoritative fonts).

Innovation: "Is this technology modern?" (Requires geometric, engineered fonts).

Clarity: "What are the specs/price?" (Requires legible, tabular data fonts).

🎨 Typography Design System: "Helios Retail"
1. The Font Stack
We will use a Tri-Type System. This is an advanced technique where three distinct typefaces serve three distinct functional roles (Brand, UI, and Data).

Role	Font Family	Justification (The "Why")
Headline / Brand	Montserrat	A geometric sans-serif that balances modernism with approachability. It feels "engineered" yet friendly. Its wide stance commands attention on hero banners.
Body / UI	Inter	The industry standard for UI (used by Figma, Notion, etc.). It has a tall x-height, making it incredibly readable on mobile screens.
Technical / Data	Space Mono	A monospaced font for technical specs (watts, voltage) and pricing. It subconsciously signals "precision engineering" and "transparency."

(All fonts are available via Google Fonts, ensuring 100% web compatibility and fast load times.)

2. Type Scale & Hierarchy (Mobile-First)
We use a Major Third (1.250) modular scale to ensure pleasing proportions. All sizes are in rem (root em) for accessibility, assuming a base root of 16px.

A. Headers (Font: Montserrat)
Usage: Landing page heroes, section titles, product names.

Tag	Desktop Size	Mobile Size	Weight	Tracking	Line Height	Usage
H1	3.0rem (48px)	2.25rem (36px)	Bold (700)	-0.02em	1.1	Main Hero Headline ("Power Your Home")
H2	2.25rem (36px)	1.75rem (28px)	SemiBold (600)	-0.01em	1.2	Section Headers ("Our Best Sellers")
H3	1.5rem (24px)	1.25rem (20px)	Medium (500)	0	1.3	Product Titles ("400W Monocrystalline Panel")
H4	1.125rem (18px)	1.0rem (16px)	Bold (700)	0	1.4	Card Headers / Features

B. Body & UI (Font: Inter)
Usage: Descriptions, reviews, blog posts, navigation.

Element	Size	Weight	Line Height	Usage
Body (Large)	1.125rem (18px)	Regular (400)	1.6	Intro paragraphs, lead text (builds trust).
Body (Base)	1.0rem (16px)	Regular (400)	1.5	Standard product descriptions, reviews.
Caption	0.875rem (14px)	Medium (500)	1.4	Form labels, hints, timestamps.
Legal/Small	0.75rem (12px)	Regular (400)	1.4	Disclaimers ("*Requires inverter").

C. Technical & Price Data (Font: Space Mono)
Usage: Prices, specifications, part numbers. This is your "Retail Power" font.

Element	Size	Weight	Formatting	Usage
Price (Hero)	1.5rem (24px)	Bold (700)	Color: Green/Brand	The main price on a product page.
Price (Card)	1.125rem (18px)	Bold (700)	Default Color	Price in a product grid.
Spec Label	0.75rem (12px)	Regular (400)	Uppercase	"VOLTAGE", "WATTAGE", "SKU"
Spec Value	0.875rem (14px)	Regular (400)	Normal	"48V", "400W", "X-200"

3. Specialized Usage Guidelines (The "Pro" Details)
A senior engineer creates rules, not just lists. These are the CSS rules you need to implement for a polished look.

📐 Tabular Lining Figures (Crucial for Retail)
For any list of prices or specs, numbers must align vertically. You must enable "tabular nums" in CSS so that the number "1" takes up the same width as the number "8".

CSS Rule: font-variant-numeric: tabular-nums;

Apply to: Prices, Shopping Cart Totals, Comparison Tables.

🏷️ Tags & Labels
Solar retail requires tags like "Best Seller" or "In Stock."

Font: Inter

Style: Uppercase, Bold (700)

Tracking: Add letter spacing to increase legibility at small sizes.

CSS Rule: letter-spacing: 0.08em; text-transform: uppercase; font-size: 0.75rem;

🖱️ Buttons (CTAs)
Your primary conversion point.

Font: Montserrat (Matches the brand headers)

Weight: SemiBold (600) or Bold (700)

Case: Sentence Case ("Add to cart") is friendlier; ALL CAPS ("ADD TO CART") is more aggressive. For solar (a high-consideration purchase), Sentence Case is often better for reducing friction.

4. Implementation Strategy (Frontend Engineering)
To ensure this loads fast (critical for mobile SEO), add this directly to your index.html or CSS import.

Google Fonts Import URL:

HTML

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Montserrat:wght@500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
Tailwind CSS Config Example: If you are using Tailwind, configure your tailwind.config.js like this to enforce the system:

JavaScript

module.exports = {
  theme: {
    fontFamily: {
      sans: ['Inter', 'sans-serif'],      // Default UI font
      display: ['Montserrat', 'sans-serif'], // Headers
      mono: ['Space Mono', 'monospace'],  // Specs & Data
    },
    // ...
  }
}
This setup ensures that even a junior developer on your team will automatically use the correct font simply by using standard classes like font-display for headers or font-mono for prices.