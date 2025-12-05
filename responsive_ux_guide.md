1. ⚙️ Global Directives & Breakpoints
Rule	Definition	Rationale
Framework	Tailwind CSS (Use sm:, md:, lg: prefixes)	Ensures consistency with the design_system.md file.
Touch Target	All interactive elements (buttons, icons) must have a minimum 48x48px touch target.	WCAG accessibility standard for mobile usability.
Key Breakpoints	sm: 400px (Narrow Mobile), md: 768px (Tablet), lg: 1024px (Desktop).	Defines clear layout shift points.

Export to Sheets

2. 🧭 Navigation & Header
The header must function as a reliable access point for all content and controls.

Mobile Menu Behavior (The Hamburger)
Hamburger Icon: Must be positioned in the fixed header bar and functional.

Action: Clicking the icon must trigger a full-screen, opaque slide-out menu (drawer) that overlays the main content.

"Products" Link: Convert this into an Accordion/Collapsible section within the slide-out menu. Tapping "Products" expands to show subcategories without navigating away.

Other Links: "Home," "About," "Contact" should be displayed clearly within the menu, using the font-sans family.

3. 🛒 Product Listing Page (Grid and Filtering)
The layout must dynamically adjust to maximize viewing area while preserving image quality.

A. Product Card Grid Rules
Mobile (320px - 400px): 1 Column (w-full)

Large Mobile/Small Tablet (401px - 767px): 2 Columns (grid-cols-2)

Tablet/Desktop (>= 768px): 3 Columns (grid-cols-3)

Typography Scaling: Ensure the Product Name text scales down slightly on 2-column mobile view (text-sm) to prevent wrap issues, maintaining the line-clamp-2 rule.

B. Filter Panel Implementation
Filter Panel (Desktop): Displayed prominently on the left side.

Filter Panel (Mobile): Hidden by default.

Trigger: Implement a clearly visible "Filter" button or icon positioned at the top of the product listing (below the main header).

Action: Tapping the filter trigger must open a full-screen modal or a bottom-up sliding drawer. The contents of this drawer will be the full filter panel.

CTA: The filter drawer must contain a sticky "Apply Filters" CTA at the very bottom, styled with the preferred teal/turquoise color, ensuring users can tap it without scrolling the filters.

4. ✉️ Contact Page Optimization
The layout must be fundamentally refactored to prioritize the form and ensure text is visible.

Mobile Layout Refactor
Image Hero: The existing background image must be cropped and moved into a full-width hero component at the top of the page (occupying about 30% of the screen height). Apply a dark overlay and a bottom gradient to ensure text visibility.

Text Overlay: The headline "Contact Us" (H1, white, font-display) and the paragraph "Have questions about solar? We're here to help" (Body Large, white, font-sans) must be overlaid onto this image hero.

Contact Form: The form must be pulled out of the background image and placed into a dedicated, standard white content block that flows naturally below the hero section.

Form Fields: All input fields must stack vertically and use 100% width. Ensure generous vertical margin/padding (e.g., my-4) between input fields for optimal touch usability.