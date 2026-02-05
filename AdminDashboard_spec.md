This is the **Super Admin Dashboard Specification**.

This area is strictly for **You** (the owner). It allows you to manage the business, handle users, and configure plans without touching the code.

**Design Note:** To prevent confusion between the "User Dashboard" and "Admin Dashboard," we will add a distinct **"ADMIN MODE"** badge in the sidebar and perhaps use a slightly different accent color (e.g., utilize the **Secondary Purple** more heavily here).

---

### **1. The Admin Layout**

* **Sidebar:** Similar structure to the User Dashboard but with Admin-specific links:
* **Overview:** (Icon: `Activity`)
* **Users:** (Icon: `Users`)
* **Plans:** (Icon: `Crown`)
* **QR/Links:** (Icon: `Link`) - *View all generated links in the system.*
* **Settings:** (Icon: `Settings`)


* **Topbar:**
* **"Back to App" Button:** A button to switch back to your personal User Dashboard.



---

### **2. Page 1: Admin Overview (`/admin`)**

*The "Pulse" of your business.*

* **The "Big Numbers" (Revenue & Growth):**
* **Total Revenue:** (e.g., "$12,450").
* **Total Users:** (e.g., "850"). Badge: "+12 today".
* **Active Subscriptions:** Count of Pro users.
* **Total Links:** Count of all QRs created by everyone.


* **Charts:**
* **Revenue Chart:** Bar chart showing income over the last 6 months.
* **User Growth:** Line chart showing new signups per day.


* **Recent Activity Feed:**
* "User JohnDoe registered."
* "User Sarah upgraded to Gold Plan."
* "System Alert: High traffic detected from IP 192.168..."



---

### **3. Page 2: User Management (`/admin/users`)**

*Control your customer base.*

* **The DataTable:**
* **Columns:** *Avatar/Name, Email, Plan (Free/Pro), Links Created, Status (Active/Banned), Joined Date.*
* **Filters:** Search by Email, Filter by Plan.


* **Actions (The Power Tools):**
* **Login as User (Ghost Mode):** *Critical feature.* A button that lets you view the dashboard *exactly* as that user sees it (to debug their issues).
* **Edit Plan:** Manually move a user from "Free" to "Pro" (e.g., if they paid you offline).
* **Ban User:** A "Destructive" button that locks their account and deactivates all their links immediately.



---

### **4. Page 3: Plan Manager (`/admin/plans`)**

*The "SaaS Engine" - No coding required to change limits.*

* **List of Plans:** Display cards for "Free", "Basic", "Pro".
* **Edit Plan Modal:**
* **Name:** Input (e.g., "Gold Tier").
* **Price:** Input (e.g., "19").
* **Currency:** Dropdown (USD, BDT, etc.).
* **Limits (The Toggles):**
* `Max QR Codes`: Number input (e.g., 50).
* `Max Bio Pages`: Number input.
* `Allow Retargeting?`: Toggle.
* `Allow Password Protection?`: Toggle.
* `Show Ads?`: Toggle (If ON, ads show on their public links).




* **Why this matters:** If you want to run a "Black Friday" promotion where the Free plan gets 10 links instead of 5, you just change the number here, and it updates instantly for everyone.

---

### **5. Page 4: Global Settings (`/admin/settings`)**

*White-labeling and Configuration.*

* **General:**
* **Site Name:** Change the browser title.
* **Logo Upload:** Replace the site logo.
* **Support Email:** Where "Contact Us" messages go.


* **SEO & Metadata:**
* **Global Keywords:** Input field.
* **OG Image:** Upload the default image used when sharing the site on Facebook.


* **Payment Settings (Future Proofing):**
* **Currency Symbol:** ($ or ৳).
* **Bank Details:** Text area to display "Bank Transfer" instructions to users (since we are doing manual payments first).


* **Ad Manager (Bonus):**
* **Ad Sense Code:** A text area to paste Google Adsense script.
* *Logic:* This script is injected into the public pages of **Free Tier** users only.



---

### **Summary of the 3-Layer Logic**

1. **Guest:** Sees Landing Page -> Can create QR in LocalStorage -> Prompted to Signup.
2. **User:** Sees Dashboard -> Can create Links based on Plan Limits -> Can Upgrade.
3. **Admin:** Sees Admin Panel -> Can Edit Plans, Ban Users, and Manage the System.

### **Next Step: The Code**

You have the **Design System**, the **User Dashboard**, the **Admin Dashboard**, and the **Landing Page** blueprinted.
