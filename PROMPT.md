Claude, completely restructure the Product Details Page (PDP) to eliminate the Add-to-Cart/Quote button and replace it with a direct communication focus.

1. 🖼️ Image Gallery Implementation:
Convert the main product image area into a functional Image Gallery component.

The gallery must include a large main viewer and a set of smaller thumbnail selectors below it for viewing multiple images.

2. 🎯 Conversion CTA Refactoring (Dual CTAs):
Remove the single "Request Quote" button.

Implement the following two adjacent buttons near the price:

Primary CTA (WhatsApp): Use the Teal/Turquoise background. Text: "Chat Now for a Quote." Must use a pre-filled message including the product name and details.

Secondary CTA (Email): Use an Outlined/Ghost style with Teal text/border. Text: "Email Inquiry." Must use a pre-filled subject line with the product name and details.

3. 📑 Trust & Data:
Place a highly visible Warranty Badge or text (e.g., "25-Year Warranty") prominently near the price.

Ensure the technical specification table is expanded to include essential solar data like Dimensions, Weight, and Certifications.

Add a button/link for "Download Data Sheet (PDF)".

4. 🔗 Related Products Logic and Layout (Final Directive):
The "Related Products" section must display exactly 4 product cards and must adhere to the final, comprehensive responsive grid rules to ensure optimal viewing:

Mobile/Small Tablet (< 768px): The products must display in 2 columns (sm:grid-cols-2).

Desktop/Large Screens (>= 1024px): The products must display in a single row of 4 columns (lg:grid-cols-4).

Data Fallback Logic:

Tier 1 (Priority: Brand Loyalty): Attempt to display up to 4 other products that share the exact same Brand as the current product. These must belong to the same Category.

Tier 2 (Fallback: Compatibility): If the available products from the same Brand are fewer than 4, fill the remaining slots with products from the same Category that have the closest technical specification (e.g., nearest wattage or nearest capacity) to the current product, regardless of brand.

Randomization: If multiple products qualify for a slot in Tier 2, select them randomly.