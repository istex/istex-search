import { Box } from "@mui/material";
import type { Metadata } from "next";
import Script from "next/script";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import CookieConsent from "@/components/CookieConsent";
import { HistoryProvider } from "@/contexts/HistoryContext";
import TanStackQueryProvider from "@/contexts/TanStackQueryProvider";
import routing from "@/i18n/routing";
import Matomo from "@/matomo";
import MuiSetup from "@/mui/setup";
import FloatingSideMenu from "./components/FloatingSideMenu";
import Footer from "./components/Footer";
import Header from "./components/Header";
import HelpButton from "./components/HelpButton";
import Navbar from "./components/Navbar";

// This function tells Next.js to pre-render (at build time) all pages in this layout
// for every supported locale
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("home.metadata");

  return {
    title: "Istex Search",
    description: t("description"),
  };
}

export default async function RootLayout(props: LayoutProps<"/[locale]">) {
  const locale = await getLocale();

  return (
    <html lang={locale}>
      {/* If the Istex API URL is overridden via an environment variable, we inject it into the window object */}
      {process.env.ISTEX_API_URL && (
        <Script id="inject-api-url" strategy="beforeInteractive">
          {`window.ISTEX_API_URL = "${process.env.ISTEX_API_URL}"`}
        </Script>
      )}

      <body>
        <TanStackQueryProvider>
          <MuiSetup locale={locale}>
            <NextIntlClientProvider>
              <HistoryProvider>
                <Navbar />
                <Header />
                <Box component="main" sx={{ flexGrow: 1 }}>
                  {props.children}
                </Box>
                <FloatingSideMenu />
                <Footer />
                <HelpButton />
              </HistoryProvider>

              <Matomo />
              <CookieConsent />
            </NextIntlClientProvider>
          </MuiSetup>
        </TanStackQueryProvider>
      </body>
    </html>
  );
}
