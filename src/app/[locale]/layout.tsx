import type { Metadata } from "next";
import { useMessages } from "next-intl";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Box } from "@mui/material";
import TanStackQueryProvider from "./TanStackQueryProvider";
import Footer from "./components/Footer";
import Header from "./components/Header";
import HelpButton from "./components/HelpButton";
import Navbar from "./components/Navbar";
import FloatingSideMenu from "./results/components/FloatingSideMenu/FloatingSideMenu";
import { HistoryProvider } from "@/contexts/HistoryContext";
import { routing } from "@/i18n/routing";
import Matomo from "@/matomo";
import MuiSetup from "@/mui/setup";
import type { GenerateMetadataProps, LayoutProps } from "@/types/next";

export async function generateMetadata({
  params: { locale },
}: GenerateMetadataProps): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "home.metadata" });

  return {
    title: "Istex Search",
    description: t("description"),
  };
}

// This function tells Next.js to pre-render (at build time) all pages in this layout
// for every supported locale
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default function RootLayout({
  children,
  params: { locale },
}: LayoutProps) {
  const messages = useMessages();

  return (
    <html lang={locale}>
      <body>
        <TanStackQueryProvider>
          <MuiSetup>
            <NextIntlClientProvider messages={messages}>
              <HistoryProvider>
                <Navbar />
                <Header />
                <Box component="main" sx={{ flexGrow: 1 }}>
                  {children}
                </Box>
                <FloatingSideMenu />
                <Footer />
                <HelpButton />
              </HistoryProvider>
            </NextIntlClientProvider>
          </MuiSetup>
        </TanStackQueryProvider>
      </body>

      {process.env.NODE_ENV === "production" && <Matomo />}
    </html>
  );
}
