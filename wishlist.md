Please implement the complete Wishlist/Saved Items feature across the website using the browser's **Local Storage API**. All code must be robust, responsive, and provide clear user feedback.

---

## 1. ⚠️ Warning Banner Directive

A clear, prominent, and stylized **warning banner** must be displayed at the top of the dedicated **`/saved-items`** page.

* **Content:** "⚠️ **Important:** Your saved items are stored only in this browser. If you clear your browser's history, cache, or switch to a different device, your current Wishlist will be permanently deleted."

---

## 2. 💾 Frontend Logic and API

Create the necessary JavaScript utility functions (or TypeScript services) to handle the interaction with Local Storage. The Wishlist array should store only unique product IDs.

| Function | Description |
| :--- | :--- |
| `getWishlistItems()` | Retrieves the current array of product IDs from Local Storage. |
| `toggleWishlistItem(productId)` | Adds the ID if not present, or removes the ID if present. Updates Local Storage immediately. |
| `isProductInWishlist(productId)` | Returns a boolean (`true`/`false`) if the given product ID is saved. |
| `clearWishlist()` | Removes ALL saved product IDs from Local Storage at once. |

---

## 3. 💖 UI Integration

### A. Product Card & PDP Implementation

* **Icon State:** The heart icon must visually reflect the saved state: **Outline** (Unsaved) vs. **Solid** (Saved, using accent color).
* **Click Handler:** Attach the `toggleWishlistItem(productId)` function to the click event of the heart icon on all product cards and on the PDP.

### B. Header Integration

* Add a subtle **Wishlist Icon** (small heart) to the fixed header bar.
* The icon must display a **real-time count** of the items currently saved in Local Storage.

---

## 4. 📄 Dedicated Wishlist Page Structure (`/saved-items`)

Create a new responsive page template for the `/saved-items` route with the following structure:

* **Banner Placement:** Ensure the **Warning Banner** is the first visible element below the header.
* **Data Retrieval:** On load, use `getWishlistItems()` to fetch the IDs and render the corresponding product cards.
* **Empty State:** Display a friendly message and a CTA back to the PLP if the list is empty.
* **Conversion CTA:** Include a prominent button: **"Request Quote for All Saved Items."** (This will trigger the pre-filled WhatsApp/Email message).

### Management Controls:

* **Individual Delete:** Each displayed product card must have a visible **"Remove" button/icon** that triggers the individual deletion of that item (`toggleWishlistItem`).
* **Bulk Delete:** A prominent button labeled **"Clear All Saved Items"** must be included at the top of the page to trigger the `clearWishlist()` function.