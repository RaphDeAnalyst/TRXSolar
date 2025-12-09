# Final Hero Section Implementation Prompt for Claude Code

Please implement the complete, responsive **Hero Section Component** using **Tailwind CSS** (assuming React or your chosen framework).

You must treat this entire instruction block as the definitive specification, referencing the separate design files (`design_system.md`) for typography tokens.

## 1. Primary Directives

* **File Context:** You MUST strictly follow the typography and component rules defined in **`design_system.md`**.
* **Structure:** Create the hero section as a single, mobile-first component.
* **Responsiveness:** Implement the **vertical stacking** layout on mobile (`< md:`) and the **horizontal 50/50 split** layout on tablet/desktop (`>= md:`).

---

## 2. Fixed Header Implementation (Brand Anchor)

The header bar must be permanently visible and highly contrasting.

* **Positioning:** Create a **fixed header bar** at the top (`position: fixed; top: 0; left: 0;`).
* **Background:** Use a **solid, opaque dark background** (e.g., `bg-gray-900`) for maximum contrast.
* **Logo/Store Name:** The store name, **"VCSolar,"** must be placed on the left, styled using a highly visible color (e.g., teal), and function as the link back to the homepage.
* **Navigation:** Include the standard hamburger menu icon (for mobile) on the right side.

---

## 3. Hero Content Implementation (High-Contrast Stacks)

Implement the two sections, ensuring maximum legibility.

### A. Shared Styling Rules
* **Overlay:** Apply a **dark, opaque color overlay** (e.g., dark navy, `bg-gray-900` with **80% opacity**) over both background image containers.
* **Typography:** All text within the hero blocks must use **`text-white`** and the font families defined in `design_system.md`.

### B. Section 1: Solar Panels (Top Section)
* **Heading (H1):** Text: **"High-Efficiency Solar Panels."** Use **`font-display`** and **`font-bold`**.
* **Subtext:** Text: **"High-efficiency solar panels for maximum energy generation."** Use **`font-sans`** and **`text-lg`**.
* **Button (CTA):** Text: **"Shop Solar Panels."**
    * **Color:** Use the user-preferred teal/turquoise background color.
    * **Highlight:** Implement a subtle **1px white border** or a faint white **`box-shadow`** to ensure the button pops against the dark overlay.

### C. Section 2: Inverters (Bottom Section)
* **Heading (H1):** Text: **"Reliable Power Inverters."** Use **`font-display`** and **`font-bold`**.
* **Subtext:** Text: **"Premium inverters for reliable power conversion."** Use **`font-sans`** and **`text-lg`**.
* **Button (CTA):** Text: **"Shop Inverters."**
    * **Color:** Use the user-preferred teal/turquoise background color.
    * **Highlight:** Apply the same white border or shadow as used in the Solar Panels CTA.

---

## 4. Final Output

Generate the full **React Component** (or your specified framework component) for the hero section using these complete specifications.