# 🤖 Master Prompt: Minimal, Responsive Product CRUD Admin Panel (Final)

Claude, implement the clean and minimal Product Management section within the existing admin panel structure. Focus solely on the essential **CRUD (Create, Read, Update, Delete)** features defined below, using minimal styling that prioritizes speed and usability.

---

## 0. 🔒 Admin Panel Structure Directive (Crucial)

**The admin panel must use a minimal, internal-focused header and must NOT include any client-side components (footer, client-side navigation links, or the floating WhatsApp icon).**

* **Header:** Must be minimal, containing only the System Title (e.g., "VCSolar Admin"), User information, and a **Logout** link.
* **Footer & Icon:** Omit the public website footer and the floating WhatsApp icon entirely.

---

## 1. 📋 Product Dashboard View (Read, Quick Update, Delete)

Implement the main product list using a **Mobile-First Responsive Table Design** that resolves horizontal overflow on small screens.

### A. Responsive Implementation (Card View / Stacking)

1.  **Desktop View (`>= md`):** Display as a standard HTML table with clear headers (Product Image, Name, Price, Featured Status, Actions).
2.  **Mobile View (`< md` breakpoint):**
    * Hide the table headers (`<th>`).
    * Transform each table row (`<tr>`) into a vertically stacked data card.
    * **CRITICAL:** Ensure each data cell (`<td>`) is preceded by its corresponding column label (e.g., **"Price:"**, **"Featured Status:"**). This label must be styled (e.g., bolded) for readability, as the traditional headers are hidden.

### B. Functionality

* **Create Button:** Add a prominent **"Add New Product"** button at the top to initiate creation (links to the Product Form View).
* **Featured Toggle (Quick Update):** Implement a functional **Toggle Switch** in the "Featured" column that updates the product status immediately upon click via an **AJAX call**.
* **Delete with Confirmation:** The Delete icon/button must trigger a **confirmation modal** before executing the final deletion of the product record.
* **Touch Targets:** Ensure all interactive elements (Edit/Delete icons, Toggle Switch) maintain the **48px x 48px minimum touch target size**.

---

## 2. 📝 Product Form View (Create & Edit)

Implement a single, responsive form used for both creating new products and editing existing ones.

* **Layout & Responsiveness:** The form must be a single, vertically stacked layout with all fields at **100% width** on mobile screens.

### A. Required Fields

Implement the form with logical sections for input:

* **Basic Info:** Product Name, Brand, Category. (The SKU field is removed as it's automated).
* **Pricing:** Price, Currency.
* **Technical Specs:** Wattage, Voltage, Efficiency, Dimensions, Weight, Certifications.
* **Description:** Short Description, Long Description (use a simple rich text editor).
* **Imagery:** Image Upload fields that support multiple file uploads for the product gallery.
* **Status:** Include the **"Mark as Featured Product"** checkbox.

### B. ⚙️ Automated SKU Generation (Server-Side)

Implement the logic to automatically generate the SKU upon submission for new products (CRUD - Create).

1.  **SKU Structure:** The generated SKU must follow this format: `[Brand Code]-[Category Code]-[Wattage/Capacity]-[Unique ID]`.
2.  **Server-Side Logic:** Before saving a new product to the **Vercel Database**, the server must automatically:
    * Query the database to determine the next available **sequential Unique ID** for the specific Brand/Category combination (starting at `001` if none exist).
    * Concatenate the Brand, Category, Wattage/Capacity, and Unique ID segments to create the final, unique SKU and insert it with the product data.