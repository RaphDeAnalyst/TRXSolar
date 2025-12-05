# DESIGN SYSTEM: SOLAR RETAIL (HELIOS)

## 1. CORE DIRECTIVES
- **Mobile-First:** All styling defaults to mobile; use `md:` and `lg:` breakpoints for desktop.
- **Framework:** Tailwind CSS.
- **Unit System:** Use `rem` for font sizes, `px` (via Tailwind classes) for layout.

## 2. TYPOGRAPHY TOKENS

### Font Families
- **Brand/Headings:** `Montserrat` (Sans-serif, Geometric). Key trait: Trust & Engineering.
- **Body/UI:** `Inter` (Sans-serif, Humanist). Key trait: Readability & Standard.
- **Data/Technical:** `Space Mono` (Monospace). Key trait: Precision & Specs.

### Font Imports (Add to HTML/CSS)
`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Montserrat:wght@500;600;700&family=Space+Mono:wght@400;700&display=swap');`

### Type Scale (Tailwind Implementation)

| Element | Mobile Class (Default) | Desktop Class (`md:`) | Font Family | Weight | Letter Spacing |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **H1 (Hero)** | `text-4xl` | `text-5xl` | `font-display` | `font-bold` | `tracking-tight` |
| **H2 (Section)** | `text-3xl` | `text-4xl` | `font-display` | `font-semibold` | `tracking-tight` |
| **H3 (Product)** | `text-xl` | `text-2xl` | `font-display` | `font-medium` | `tracking-normal` |
| **Body (Lead)** | `text-lg` | `text-lg` | `font-sans` | `font-regular` | `leading-relaxed` |
| **Body (Base)** | `text-base` | `text-base` | `font-sans` | `font-regular` | `leading-normal` |
| **Price (Hero)** | `text-2xl` | `text-3xl` | `font-mono` | `font-bold` | `tabular-nums` |
| **Label/Tag** | `text-xs` | `text-xs` | `font-sans` | `font-bold` | `tracking-widest uppercase` |

## 3. COMPONENT RULES (FOR CLAUDE CODE)

**A. Price Displays**
- ALWAYS use `font-mono` for pricing numbers.
- ALWAYS use `tabular-nums` (CSS) to ensure vertical alignment in lists.
- Color: Use Primary Green for the price value to signal "Savings/Go".

**B. Product Specs (Voltage, Wattage)**
- Use `font-mono` for the value (e.g., "400W").
- Use `font-sans` text-xs uppercase for the label (e.g., "OUTPUT").

**C. Buttons (CTAs)**
- Font: `font-display` (Montserrat).
- Weight: `font-semibold`.
- Case: Sentence case ("Get a quote"), NOT all-caps.
- Padding: Generous (Touch target > 48px).

**D. Trust Signals**
- Near every "Add to Cart" or "Quote" button, place a small text (text-xs text-gray-500) indicating warranty or security (e.g., "25-Year Warranty").

## 4. TAILWIND CONFIG EXTENSION
Add this to `tailwind.config.js`:

```js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Montserrat', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
    },
  },
}