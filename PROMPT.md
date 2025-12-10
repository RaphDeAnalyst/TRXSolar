Claude, execute a **Global Audit and Refactoring** of all confirmation dialogs, success notifications, error alerts, and full-screen modals across the entire codebase (both client-facing and admin panel). The goal is to enforce **visual consistency, clear hierarchy, and strict adherence** to the established design system.

### 1. 🎨 Design System Enforcement

All dialogs, modals, and notifications must be styled using the typography, color palette, and spacing tokens defined in **`design_system.md`**. Key directives include:

* **Color Palette:** Use the primary accent color (Teal/Turquoise) for the main action button (e.g., "Confirm," "Delete," or "Let's Complete"). Use muted colors (gray/white) for secondary actions or cancel buttons.
* **Typography:** Maintain the defined font stack and hierarchy for Titles (H2/H3), Body text, and Button labels.
* **Spacing & Rounding:** Ensure consistent padding, margins, and border-radius across all dialog types.

---

### 2. 🗂️ Component Standardization (The Hierarchy)

Standardize the structure for the three main types of informational overlays:

#### A. Confirmation Dialogs (Example: Delete Action)

These are for preventing accidental actions.

* **Structure:** Must be modal (overlaying the page), centered, and compact.
* **Content Hierarchy:**
    * **Title:** Clear question or command (e.g., "**Delete Product?**").
    * **Body:** Contextual warning (e.g., "Are you sure you want to delete this panel? This action cannot be undone.").
* **Button Priority:**
    * **Primary Button (Right):** The final action (e.g., "**Delete**"). Should use a color that reflects the severity (e.g., **Red** for deletion, or the accent color for positive completion).
    * **Secondary Button (Left):** The cancel action (e.g., "Cancel," or "No"). Should be an outlined/ghost style.
* **Crucial Integration:** Ensure this design is applied to the **Product Deletion Confirmation Modal** in the Admin Panel.

#### B. Success/Error Notifications (Toasts)

These are non-blocking messages appearing briefly after an action is completed.

* **Placement:** Fixed position, typically in the top-right or bottom-right corner.
* **Visual Indicators:** Use small icons and clear background colors:
    * **Success:** Green background/icon (e.g., "Product Saved Successfully!").
    * **Error:** Red background/icon (e.g., "Image Upload Failed.").

#### C. Full-Screen Modals (Example: Lightbox/Image Gallery)

These are for complex content like the planned PDP image Lightbox.

* **Structure:** Should cover the entire viewport.
* **Focus:** Maintain a clear, highly visible "Close" button (X icon) in the corner.

---

### 3. 🌐 Global Codebase Audit

Perform a full audit and update of the following known locations to ensure they use the new standardized components:

* **Admin Panel:**
    * Product Deletion Confirmation (Crucial).
    * Product Save Success/Failure Notifications.
    * Customer Deletion Confirmation (Crucial)	
* **Client Side:**
    * Form Submission Success/Failure (Contact Page).
    * Wishlist/Saved Item Notifications (e.g., "Item Added to Saved List!").
    * PDP Image Gallery **Lightbox Modal** (ensure consistent look for the close button and background overlay).


Even locations I do not list out, do a full audit and discover them