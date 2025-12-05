Please expand the width of the product card listing area on the Product Listing Page (PLP) to utilize the available space on the left and right sides, while maintaining all existing responsiveness rules.

1. 📐 Container Width Adjustment (Maximizing Space)
The main container wrapper for the product listing area must be adjusted to take up more horizontal space.

Current Constraint Fix: Identify the main wrapper element surrounding the product grid and filters (likely using a class like container mx-auto max-w-7xl or similar).

New Directive: Reduce the horizontal padding on this main wrapper (e.g., from px-6 to px-4) and increase the maximum width constraint (e.g., change max-w-7xl to max-w-screen-xl or larger). The goal is to maximize edge-to-edge space while maintaining necessary side margins.

Filter Margin: Ensure the spacing/gap between the left-side filter panel (on desktop) and the product grid is efficient and doesn't waste space.

2. 🛒 Product Grid Optimization (Utilizing New Space)
The expanded container width must be utilized by displaying more product cards per row on larger screens.

Reference: Consult the existing responsive_ux_guide.md file (Section 3A).

New Directive: Update the product card grid rules for larger devices:

Tablet/Small Desktop (>= 768px): Increase the column count from 3 to 4 columns (grid-cols-4).

Large Desktop (>= 1280px): Introduce a new breakpoint (or use xl:) to display 5 columns (xl:grid-cols-5).

3. 🖼️ Product Card Integrity
Constraint: After widening the grid, ensure the 4:5 image aspect ratio and the line-clamp-2 rule for the product name (defined in the initial product card specification) remain stable and the card does not become too wide or distorted.

Summary of Change: The implementation should remove unnecessary whitespace padding on the edges and use the reclaimed space to display more product cards per row, improving user efficiency and visual density.