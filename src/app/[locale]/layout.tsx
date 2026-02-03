import { Box } from "@mui/material";
import type { Metadata } from "next";
import { type Locale, NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import * as React from "react";
import CookieConsent from "@/components/CookieConsent";
import { HistoryProvider } from "@/contexts/HistoryContext";
import TanStackQueryProvider from "@/contexts/TanStackQueryProvider";
import Matomo from "@/matomo";
import MuiSetup from "@/mui/setup";
import FloatingSideMenu from "./components/FloatingSideMenu";
import Footer from "./components/Footer";
import Header from "./components/Header";
import HelpButton from "./components/HelpButton";
import Navbar from "./components/Navbar";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("home.metadata");

  return {
    title: "Istex Search",
    description: t("description"),
  };
}

export default function RootLayout(props: LayoutProps<"/[locale]">) {
  const params = React.use(props.params);

  return (
    <html lang={params.locale}>
      <body>
        <TanStackQueryProvider>
          <MuiSetup locale={params.locale as Locale}>
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
