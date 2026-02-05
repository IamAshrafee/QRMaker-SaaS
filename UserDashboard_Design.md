This is the **User Dashboard Specification**.

The Dashboard is the "Engine Room." It needs to feel **fast, productive, and dense with information** without looking cluttered. We will strictly use the **Shadcn UI** component library here for consistency, but customized with our "Glorious" styling.

---

### **1. The Layout Architecture (The "Shell")**

The dashboard is wrapped in a **Persistent Shell** that remains visible across all sub-pages.

#### **A. The Sidebar (Navigation)**

* **Position:** Fixed Left. Width: `250px`. (Collapses to icons on mobile).
* **Appearance:**
* **Light:** White background, thin right border (`border-slate-200`).
* **Dark:** Deep Slate (`bg-slate-950`), subtle border (`border-slate-800`).


* **Content:**
1. **Logo:** Top left. Clicking it goes to `/dashboard`.
2. **"New" Button:** A large, full-width `Primary` button: **+ Create New**. (Triggers a Modal asking: "QR Code" or "Bio Link"?).
3. **Menu Items:**
* **Home:** (Icon: `LayoutDashboard`)
* **QR Codes:** (Icon: `QrCode`)
* **Bio Pages:** (Icon: `Smartphone`)
* **Analytics:** (Icon: `BarChart3`) - *Aggregate view.*
* **My Plan:** (Icon: `CreditCard`) - *Shows "Free" or "Pro" badge.*


4. **Bottom:** User Profile (Avatar + Name + tiny "Settings" gear).



#### **B. The Topbar (Context)**

* **Position:** Sticky Top. Height: `64px`.
* **Appearance:** Glassmorphism (`backdrop-blur-md`).
* **Content:**
* **Left:** Breadcrumbs (e.g., `Home > QR Codes > Edit`).
* **Right:**
* **Theme Toggle:** Sun/Moon icon.
* **Notifications:** Bell icon (Red dot if system alerts exist).





---

### **2. Page 1: The Overview (`/dashboard`)**

*The "Command Center".*

* **Welcome Section:**
* Headline: "Good Morning, Ashrafee 👋".
* Subtext: "Here is what’s happening with your links today."


* **The "Stats Deck" (4 Cards):**
* *Design:* Simple cards with a small icon in the corner.
* **Total Scans:** Big number (e.g., "1,204"). Badge: "+12% this week" (Green).
* **Active Links:** Count of QRs + Bio Pages.
* **Top Performer:** Shows the name of the most scanned link (e.g., "Restaurant Menu").
* **Plan Usage:** A progress bar (e.g., "4/5 QRs used"). *Upsell Trigger: If full, show "Upgrade" button.*


* **Recent Activity:**
* A simplified table showing the last 5 scans.
* Columns: *Link Name*, *Location (Flag)*, *Device*, *Time*.



---

### **3. Page 2: The Managers (`/dashboard/qrcodes` & `/bio`)**

*These two pages look similar but filter data differently.*

* **The Data Table (Shadcn UI Table):**
* **Filters:** Search bar ("Search by name..."), Filter by Status (Active/Archived).
* **Columns:**
1. **Preview:** A tiny thumbnail of the QR or Avatar.
2. **Name:** Bold title + faint URL below it.
3. **Scans:** Badge with total count.
4. **Created:** Date string (e.g., "Feb 14, 2026").
5. **Actions (Dropdown):**
* *Edit Design*
* *Download (PNG/SVG)*
* *View Analytics*
* *Delete (Destructive)*






* **Empty State:**
* If no links exist, show a beautiful SVG illustration and a big "Create your first QR" button.



---

### **4. Page 3: The Builder (`/dashboard/create`)**

*The most critical part of the app. This must be a **Split-Screen** experience.*

#### **Layout:**

* **Left Panel (50% - Scrollable):** The Configuration Form.
* **Right Panel (50% - Sticky):** The Live Preview.

#### **A. The Left Panel (The Controls)**

Organized into **Accordions** (Collapsible sections) to keep it clean.

1. **Section 1: Destination (Logic)**
* **Tabs:** URL | WiFi | vCard | Text.
* **Input:** "Paste your website URL".
* *SaaS Feature:* Toggle "Dynamic Link?" (Yes/No).


2. **Section 2: Design (Appearance)**
* **Color Picker:** Pre-set circles (Brand colors) + Custom Hex input.
* **Frame:** Select distinct shapes (Classic Square, Rounded, Dot Style).
* **Logo:** Upload Center Logo.


3. **Section 3: Smart Rules (Pro Features)**
* **Password:** Toggle switch. If ON -> Show password input.
* **Schedule:** "Active From" and "Expire At" date pickers.
* **Retargeting:** Dropdown to select a stored Pixel.



#### **B. The Right Panel (The Preview)**

* **Visual:** A realistic **Phone Mockup** (CSS-only or image frame).
* **Interaction:**
* As the user types the URL or changes color, the Phone screen updates **instantly**.
* Beneath the phone: "Download" buttons (PNG / SVG / PDF).



---

### **5. Page 4: Bio Link Builder (`/dashboard/bio/create`)**

*Similar layout to QR Builder, but specific for Profile Pages.*

#### **Left Panel (Content Editor)**

1. **Profile:** Upload Avatar, Name, Description.
2. **Links (Draggable List):**
* Button: "+ Add Link".
* List Items: Each item has a "Title", "URL", and an Icon picker.
* *Drag & Drop:* Use `dnd-kit` to allow reordering links.


3. **Theme:**
* Grid of "Cards" representing themes (Dark, Gradient, Minimal). Clicking one applies it to the preview.



#### **Right Panel (Preview)**

* Shows the "Web Page" inside the Phone Mockup.
* *Crucial:* It must look exactly like the real mobile page.

---

### **6. Page 5: Analytics Detail (`/dashboard/links/[id]`)**

*Deep dive into a specific link.*

* **Header:** Link Name + Big "Download QR" button.
* **Chart 1 (Timeline):** Large Area Chart. "Scans over last 30 days."
* *Interaction:* Hovering shows exact count per day.


* **Chart 2 (Geography):**
* List of Top 5 Countries with Flag icons.
* *Optional:* A simple World Map highlighting active regions.


* **Chart 3 (Tech Stack):**
* Donut Chart: Mobile vs Desktop.
* Donut Chart: iOS vs Android vs Windows.



---

### **7. Page 6: Settings & Billing (`/dashboard/settings`)**

* **Tab: Profile:** Change Name, Email, Password.
* **Tab: Pixels (Marketing):**
* Input fields to save "Facebook Pixel ID" and "Google Analytics ID" globally.
* *Why:* Users save it here once, then select it in the Builder dropdown.


* **Tab: Billing (The Money):**
* **Current Plan:** Large Card showing "Free Plan".
* **Upgrade Section:** 3-Column Pricing Table (same as Landing Page) allowing them to click "Upgrade".
* **Invoices:** Simple table of past payments.



---

### **UX/Micro-Interactions Checklist**

* **Loading States:** When saving a QR code, the button should show a spinner and say "Generating...".
* **Toast Notifications:** When a link is copied or saved: "Success! Link copied to clipboard" (Use Shadcn `Sonner` or `Toast`).
* **Tooltips:** Add `?` icons next to complex features like "Retargeting Pixel" to explain what they are.
