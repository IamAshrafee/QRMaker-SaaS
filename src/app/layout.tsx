import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import "./globals.css";
import { getSettings } from "@/actions/settings-actions";
import { auth } from "@/auth";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata() {
  const settings = await getSettings();
  return {
    title: settings.seo?.title || "QRMaker SaaS",
    description: settings.seo?.description || "Next-gen QR Code & Bio Page Builder",
    keywords: settings.seo?.keywords ? settings.seo.keywords.split(',') : [],
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();
  const session = await auth();

  // Maintenance Mode Check
  if (settings.system?.maintenanceMode && session?.user?.role !== 'admin') {
    return (
      <html lang="en">
        <body className={inter.className}>
          <div className="flex h-screen w-full flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white gap-4">
            <h1 className="text-4xl font-bold">Under Maintenance</h1>
            <p className="text-slate-500 max-w-md text-center">
              We are currently performing scheduled maintenance. Please check back later.
            </p>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth" suppressHydrationWarning>

      <body className={inter.className}>
        {settings.scripts?.googleAnalyticsId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${settings.scripts.googleAnalyticsId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                            window.dataLayer = window.dataLayer || [];
                            function gtag(){dataLayer.push(arguments);}
                            gtag('js', new Date());
                            gtag('config', '${settings.scripts.googleAnalyticsId}');
                            `}
            </Script>
          </>
        )}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <ToastProvider />
        </ThemeProvider>
      </body>
    </html>
  );
}
