This is a professional **Software Design Document (SDD)** for **QRMaker**.

I have structured this document strictly following the principles and sections outlined in the tutorial you provided. This document serves as the "Bridge" between your idea and the actual code, ensuring the project is scalable, maintainable, and secure.

---

# Software Design Document: QRMaker SaaS

**Version:** 1.0
**Date:** February 3, 2026
**Author:** Abdullah Al Ashrafee

---

## 1. Executive Summary

**QRMaker** is a multi-tenant SaaS platform that allows users to create dynamic QR codes and mobile-first Bio-Link pages. It solves the problem of "broken links" in printed media by providing editable destination URLs. The system includes a robust Admin Panel for plan management, user oversight, and deep analytics.

---

## 2. Requirements Analysis

*Defining what the system should do (Functional) and how it should perform (Non-Functional).*

### 2.1 Functional Requirements

* **User Module:**
* Register/Login (Social Auth + Email).
* Create Dynamic QR Codes (URL, WiFi, vCard).
* Create Bio-Link Pages (Custom avatar, links, social icons).
* View Analytics (Scan count, Device, Location).
* Customize Design (Colors, Logo, Frames).


* **The "Smart" Features:**
* **Retargeting:** Inject Facebook/Google Pixels before redirect.
* **Protection:** Password-protect specific links.
* **Scheduling:** Set start/expiry dates for links.


* **Admin Module (Super Admin):**
* User Management (Ban, Login as User).
* Plan Management (Create Gold/Silver tiers with limits).
* Global Settings (SEO, Site Name, Payment Config).



### 2.2 Non-Functional Requirements

* **Performance:** Redirection must happen in <200ms.
* **Scalability:** Must handle 10,000+ concurrent scans without crashing.
* **SEO:** Bio-Link pages must be server-side rendered (SSR) for indexing.
* **Security:** Prevention of SQL Injection (NoSQL Injection here) and XSS attacks.

---

## 3. System Architecture Design

*Choosing the structure based on project size and scaling needs.*

We will utilize a **Modular Monolithic Architecture** using the **Next.js App Router**.

* **Why this choice?** As per the guide, "Smaller projects or startups... should go with monolithic architecture."
* **Benefit:** Next.js allows us to keep the Frontend (UI) and Backend (API Routes) in a single repository. This reduces complexity for the buyer (easy installation) while maintaining the speed of a Single Page Application (SPA).
* **Cloud-Native Readiness:** Although monolithic in code, it is designed for **Serverless Deployment** (Vercel/AWS Lambda), meaning it effectively behaves like a microservice when deployed (auto-scaling).

---

## 4. Detailed Design

*Breaking down the software into modules, classes, and patterns.*

### 4.1 Data Design (The Schema)

We will use **Mongoose** to define our data classes.

* **User Class:** Handles Auth, Plan Status, and Global Pixels.
* **Link Class (The Factory):** A single collection that handles *both* QR Codes and Bio Pages.
* *Optimization:* We use a Discriminator pattern (or simple `type` field) to distinguish between a simple Redirect QR and a Bio Page.


* **Analytics Class:** Stores high-volume data. We will use **Time-Series** data structuring (storing data by timestamp) to allow fast querying of "Last 30 Days" charts.

### 4.2 Application Design Patterns

We will apply the patterns mentioned in your guide:

1. **MVC (Model-View-Controller):**
* **Model:** Mongoose Schemas (`/models`).
* **View:** React Server Components (`/app/page.tsx`).
* **Controller:** Server Actions & API Routes (`/app/api/...`).


2. **Factory Pattern:**
* Used in the **QR Generator**. Instead of writing separate logic for "WiFi QR", "URL QR", and "VCard QR", we will create a `QRFactory` utility that takes input data and outputs the correct string format for the QR engine.


3. **Single Responsibility Principle (SRP):**
* We will separate the **Redirect Logic** from the **Analytics Logic**.
* *Bad:* The redirect route updates the database count AND redirects.
* *Good:* The redirect route fires an event to an `AnalyticsService` (which updates DB asynchronously) and immediately redirects the user. This keeps the redirect fast.



---

## 5. UI/UX Design Strategy

*Focusing on the user journey and friction-less experience.*

* **Design System:** We will use **Shadcn UI**. This ensures consistency across buttons, inputs, and modals without reinventing the wheel.
* **The "Guest" Experience:** The Landing page will feature a "Try it now" demo that works without logging in. This "Product-Led Growth" UX pattern increases conversion.
* **The Dashboard Flow:**
* *Problem:* Dashboards can be overwhelming.
* *Solution:* We will use a **Sidebar Layout** with a "Quick Action" Fab button (+) always visible to Create a QR Code instantly.



---

## 6. Security Planning

*Built-in security, not an afterthought.*

1. **Input Validation:** We will use **Zod** schema validation for every single API route.
* *Rule:* Never trust the client. If a user tries to send a malicious script in the "Bio Description", Zod will strip it.


2. **Authentication:** **NextAuth.js v5**. Handles session management securely (HttpOnly cookies) to prevent XSS session hijacking.
3. **Role-Based Access Control (RBAC):**
* Middleware will intercept every request to `/admin`.
* `if (user.role !== 'admin') return 403 Forbidden;`


4. **Rate Limiting:** To prevent abuse (e.g., a bot scanning a QR code 1 million times to spike your server costs), we will implement API rate limiting on the public redirect route.

---

## 7. Scalability & Performance

*Preparing for growth.*

* **Database Indexing:** We must place a unique index on the `slug` field (the short URL ID). This ensures that finding a QR code takes O(1) time (milliseconds) even if we have 10 million links.
* **Caching:**
* We will use **React Cache** (Next.js native) to cache the "Bio Page" data.
* If 1,000 people scan a Bio Link in 1 minute, the database is hit only *once*. The other 999 get the cached version.



---

# Missings - 

### **Addendum 1: Detailed Routing Strategy (The "Username" Logic)**

*Missing from Section 4.2 (Application Design)*

To fulfill your requirement of `example.com/username` vs `example.com/username/custom-link` vs `example.com/shortId`, we need a specific **Priority Routing Logic** in the Middleware.

**The Routing Algorithm:**

1. **System Check:** Is the request for `/admin`, `/login`, `/api`, or `/_next`? -> **Pass through.**
2. **Root Check:** Is the request `/`? -> **Show Landing Page.**
3. **Collision Check:**
* *Scenario A:* User visits `/ashrafee`.
* *System Action:* Check DB `Users` collection for `username: "ashrafee"`.
* *Result:* If found -> **Render Bio Page Component**.


4. **Sub-Path Check:**
* *Scenario B:* User visits `/ashrafee/my-portfolio`.
* *System Action:* Check DB `Links` collection where `user: ashrafee_id` AND `slug: "my-portfolio"`.
* *Result:* If found -> **Redirect**.


5. **Short-Link Check (Fallback):**
* *Scenario C:* User visits `/x7z9Aa`.
* *System Action:* Check DB `Links` collection for `shortId: "x7z9Aa"`.
* *Result:* If found -> **Redirect**.



---

### **Addendum 2: The "Theme Engine" & UI Architecture**

*Missing from Section 5 (UI/UX Design)*

You requested **"White and Dark mode in all over the application"** and **"Multi theme bio page"**.

* **Global App Theme:**
* We will implement **`next-themes`**. This handles the class switching (`dark` vs `light`) automatically based on user system preference or a toggle switch in the Navbar.
* **Persistence:** The preference is stored in `localStorage` so the user doesn't have to toggle it every time they visit.


* **Bio-Page Theming (Separate System):**
* Bio pages need *specific* themes (e.g., "Cyberpunk", "Minimalist", "Gradient") that are **independent** of the app's dark mode.
* **Implementation:** The `Link` model will store a `themeConfig` object:
```json
{
  "font": "Inter",
  "buttonStyle": "rounded-full",
  "background": "linear-gradient(to right, #ff00cc, #333399)",
  "textColor": "#ffffff"
}

```


* This allows the Bio Page to look completely different from your SaaS dashboard.



---

### **Addendum 3: SEO Architecture**

*Missing from Section 2.2 (Non-functional Requirements)*

You requested **"100% SEO rules followed."** This requires a dedicated module.

* **Dynamic Metadata (Open Graph):**
* When a user shares their Bio Link on Facebook/WhatsApp, it must show *their* avatar and *their* title, not your SaaS logo.
* **Solution:** Use Next.js `generateMetadata` function on the `/[slug]` page to dynamically fetch the user's data and inject `<meta property="og:image" content="..." />`.


* **Sitemap Generation:**
* Automated script (`next-sitemap`) to generate `sitemap.xml` for all "Public" bio pages so they get indexed by Google.


* **Canonical URLs:**
* Ensure `www.yoursite.com/ashrafee` and `yoursite.com/ashrafee` do not count as duplicate content.



---

### **Addendum 4: The "Guest" Layer Workflow**

*Missing from Section 2.1 (Functional Requirements)*

You requested a **3-layer system** (Admin, User, **Guest**).

* **The Guest Constraint:**
* A guest can click "Create QR" on the landing page.
* **Storage:** We do *not* save this to the Database immediately to save space. We store the QR data in the browser's **LocalStorage**.


* **The Conversion Hook:**
* When the Guest clicks "Download" or "Save", we trigger a **"Soft Signup" Modal**: *"Sign up for free to save this QR code forever and track scans."*
* Once they sign up, the data from LocalStorage is pushed to the Database and assigned to their new account.



---

### **Addendum 5: Testing & Validation Strategy**

*Missing from Section 7 (Testing) - Required by your Tutorial*

To ensure the "Technical Precision" mentioned in the article, we must define the tests:

1. **Unit Testing (Jest):**
* Test the `QRFactory` logic (Does it generate the correct string?).
* Test the `PricingLogic` (Does it correctly block a Free user from creating a 6th QR code?).


2. **Integration Testing:**
* **The Redirect Loop:** Simulate a user scanning a QR -> Check if Analytics DB incremented +1 -> Check if User was redirected.


3. **Security Validation:**
* **Penetration Test:** Try to inject JavaScript into the "Bio Page Title" input. Ensure Zod/React sanitizes it.



---

### **Addendum 6: Missing Pages in Sitemap**

*Missing from Section 4 (Detailed Page Structure)*

Based on your list, these specific pages need to be added to the Frontend Architecture:

* **Public/Marketing:**
* `/features` (Detailed Usages & Use Cases).
* `/pricing` (Plan Comparison Table).
* `/about` (Company info).


* **User Dashboard:**
* `/dashboard/links/[id]` (**The Detail View**): This is the specific page you asked for. It shows the large QR, the "Download" buttons (PNG/SVG/PDF), the "Edit" form, and the specific analytics for *just* that link.


### Important reminder 
* I have some dedicated skills, you can found that in the .agent/.agents folder. Whenever you are doing something, always must follow 