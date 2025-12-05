# 🛍️ Product Card Component Specification

This specification governs the display of individual products, prioritizing the visual experience and mobile clarity.

## 1. Layout and Sizing Directives

The design must maximize the visual hierarchy, making the product image the dominant element.

* **Aspect Ratio (Image):** The product image container must enforce a **4:5 aspect ratio** (taller than it is wide) to make the image more prominent, mirroring the provided visual example.
* **Layout:** The card should be structured into two main vertical sections:
    1.  **Image Container (Top):** Must occupy approximately **80%** of the total card height.
    2.  **Text Container (Bottom):** Must occupy approximately **20%** of the total card height and remain concise.
* **Spacing/Padding:** There must be minimal padding (4px or `p-1`) between the image and the text block, and minimal internal padding within the text block, to keep the card compact.
* **Interactivity:** The entire product card area must be clickable, linking to the full product detail page (`<a href="{product.url}">...</a>`).

## 2. Content Hierarchy and Typography

Only the essential text information should be displayed, adhering to the existing typography system (`design_system.md`).

| Element | Typography System Rule | Formatting / Constraints |
| :--- | :--- | :--- |
| **Category/Brand** (e.g., "Barbour") | Use `text-xs` (Small text) | Should be positioned at the top of the text block. Use a light gray color (`text-gray-500`) to visually separate it from the name. |
| **Product Name** (e.g., "Carlton beanie & gloves gift set in navy") | Use `text-sm` or `text-base` (Body Base) | The primary descriptive line. Should be displayed in **regular weight**. Must be truncated to **two lines** maximum (`line-clamp-2` utility). |
| **Price** (e.g., "$87.00") | Use `text-sm` and `font-mono` | Must be displayed in **bold weight**. Should use the `font-mono` (Space Mono) and `tabular-nums` classes as defined in the style guide. |

## 3. Actionable Code Directives for Claude

Instruct the agent to use specific Tailwind utilities for the layout:

1.  **Enforce Image Aspect Ratio:** Use the `aspect-h-5 aspect-w-4` (or similar 4:5 ratio) utility on the image container.
2.  **Truncate Text:** Apply the `line-clamp-2` utility to the product name to prevent cards from having uneven heights.

---

**Example Prompt for Claude Code:**

> "Using the provided visual reference (C:\Users\rapha\Desktop\TRXSolar\product_card_reference.png) and adhering to the `design_system.md` typography rules, create a responsive Tailwind CSS component for a product card. The card must prioritize a **4:5 aspect ratio image**, show only the **Category/Brand, Name (truncated to two lines), and Price**."