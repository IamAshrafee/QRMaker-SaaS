This is the **Official Design System & Color Palette** for QRMaker.

To achieve the "Modern, Glorious, Trendy" look (similar to Stripe, Linear, or Raycast), we will not use flat colors. We will use a **Deep Slate** base for dark mode and a **Vivid Violet-Cyan** gradient for the "Glorious" branding.

### **1. The Core Philosophy**

* **Light Mode:** Clean, crisp, professional. Uses pure white and very light slate grays.
* **Dark Mode:** Deep, immersive, "Void" style. Not pure black, but a very rich dark slate.
* **The "Glorious" Element:** A primary gradient that moves from **Electric Violet** to **Bright Cyan**. This represents "Creation" and "Technology."

---

### **2. The Palette (Hex Codes)**

#### **A. Brand Colors (The "Action" Colors)**

Used for Buttons, Links, Logos, and Active States.

| Role | Hex Code | Tailwind Name | Usage |
| --- | --- | --- | --- |
| **Primary Base** | `#6366F1` | Indigo-500 | Main buttons, active tabs. |
| **Primary Hover** | `#4F46E5` | Indigo-600 | Hover state for buttons. |
| **Secondary** | `#A855F7` | Purple-500 | Used in gradients/accents. |
| **Tertiary** | `#06B6D4` | Cyan-500 | Used for "Tech" highlights. |
| **The "Glorious" Gradient** | `linear-gradient(135deg, #6366F1 0%, #A855F7 50%, #EC4899 100%)` |  | **The "Secret Sauce".** Use this for the "Sign Up" button and Hero text. |

#### **B. Neutral Scale (Light Mode)**

Used for Backgrounds, Text, and Borders in Light Mode.

| Role | Hex Code | Description |
| --- | --- | --- |
| **Background** | `#FFFFFF` | Pure White. |
| **Surface (Cards)** | `#F8FAFC` | Slate-50. Very subtle grey. |
| **Border** | `#E2E8F0` | Slate-200. Thin, crisp borders. |
| **Text Main** | `#0F172A` | Slate-900. Deep navy-black (Never use #000). |
| **Text Muted** | `#64748B` | Slate-500. For descriptions/footers. |

#### **C. Neutral Scale (Dark Mode)**

Used for Backgrounds, Text, and Borders in Dark Mode.

| Role | Hex Code | Description |
| --- | --- | --- |
| **Background** | `#020617` | Slate-950. Deepest void blue-black. |
| **Surface (Cards)** | `#0F172A` | Slate-900. Slightly lighter for depth. |
| **Border** | `#1E293B` | Slate-800. Low contrast border. |
| **Text Main** | `#F8FAFC` | Slate-50. Almost white. |
| **Text Muted** | `#94A3B8` | Slate-400. Readable grey. |

#### **D. Functional Colors (Feedback)**

* **Success (Green):** `#10B981` (Emerald-500) - For "Active" status.
* **Error (Red):** `#EF4444` (Red-500) - For "Delete" or "Plan Expired".
* **Warning (Orange):** `#F59E0B` (Amber-500) - For "Trial Ending".

---

### **3. Implementation Guide (Tailwind Config)**

Copy this directly into your `tailwind.config.ts`. This maps your semantic names (`primary`, `background`) to the specific colors defined above. This allows you to write `<div className="bg-background text-foreground">` and it works in both Light and Dark modes automatically.

```typescript
// tailwind.config.ts
import { fontFamily } from "tailwindcss/defaultTheme"

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"], // Vital for the Toggle Button
  content: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
      },
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: `calc(var(--radius) - 4px)`,
      },
      backgroundImage: {
        'glorious-gradient': 'linear-gradient(to right bottom, #6366f1, #a855f7, #ec4899)',
        'mesh': 'radial-gradient(at 40% 20%, hsla(250,100%,94%,1) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189,100%,96%,1) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(341,100%,96%,1) 0px, transparent 50%)',
        'mesh-dark': 'radial-gradient(at 40% 20%, hsla(266, 51%, 15%, 1) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(190, 40%, 15%, 1) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(340, 40%, 15%, 1) 0px, transparent 50%)',
      },
    },
  },
}

```

### **4. CSS Variables (globals.css)**

*Paste this into your global CSS file. This is where the magic switching happens.*

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* LIGHT MODE */
    --background: 0 0% 100%;       /* #FFFFFF */
    --foreground: 222.2 84% 4.9%;  /* Slate-900 */
    
    --primary: 249 95% 60%;        /* Indigo-500 (#6366f1) */
    --primary-foreground: 210 40% 98%;

    --secondary: 270 95% 65%;      /* Purple-500 (#A855F7) */
    --secondary-foreground: 222.2 47.4% 11.2%;

    --muted: 210 40% 96.1%;        /* Slate-100 */
    --muted-foreground: 215.4 16.3% 46.9%;

    --accent: 210 40% 96.1%;       /* Hover state background */
    --accent-foreground: 222.2 47.4% 11.2%;

    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;

    --border: 214.3 31.8% 91.4%;   /* Slate-200 */
    --input: 214.3 31.8% 91.4%;
    --ring: 262.1 83.3% 57.8%;
    
    --radius: 0.75rem; /* Rounded-xl (Modern Soft Radius) */
  }

  .dark {
    /* DARK MODE */
    --background: 222.2 84% 4.9%;  /* Slate-950 (#020617) */
    --foreground: 210 40% 98%;     /* Slate-50 */
 
    --primary: 249 95% 65%;        /* Lighter Indigo for dark mode visibility */
    --primary-foreground: 222.2 47.4% 11.2%;
 
    --secondary: 270 95% 65%;
    --secondary-foreground: 210 40% 98%;
 
    --muted: 217.2 32.6% 17.5%;    /* Slate-800 */
    --muted-foreground: 215 20.2% 65.1%;
 
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
 
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
 
    --border: 217.2 32.6% 17.5%;   /* Slate-800 */
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 48%;
  }
}

@layer utilities {
  /* The "Glorious" Text Effect Class */
  .text-gradient {
    @apply bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500;
  }
  
  /* The "Glass" Effect Class */
  .glass {
    @apply bg-white/10 dark:bg-black/10 backdrop-blur-md border border-white/20 dark:border-white/10;
  }
}

```

### **5. Usage Instructions**

* **For the "Glorious" Buttons:**
`<button className="bg-glorious-gradient text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all">Sign Up</button>`
* **For the Landing Page Background:**
`<div className="bg-white dark:bg-slate-950 bg-mesh dark:bg-mesh-dark">`
*(This creates that subtle, moving blob effect in the background).*
* **For Cards:**
`<div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm hover:shadow-md transition-all">`
