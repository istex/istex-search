import type { Metadata } from "next";
import { useMessages, useNow, useTimeZone } from "next-intl";
import { getTranslations } from "next-intl/server";
import TanStackQueryProvider from "./TanStackQueryProvider";
import Footer from "./components/Footer";
import Header from "./components/Header";
import HelpButton from "./components/HelpButton";
import Navbar from "./components/Navbar";
import FloatingSideMenu from "./results/components/FloatingSideMenu/FloatingSideMenu";
import { HistoryProvider } from "@/contexts/HistoryContext";
import NextIntlProvider from "@/i18n/provider";
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

export default function RootLayout({
  children,
  params: { locale },
}: LayoutProps) {
  const messages = useMessages();
  const timeZone = useTimeZone();
  const now = useNow();

  return (
    <html lang={locale}>
      <body>
        <TanStackQueryProvider>
          <MuiSetup>
            <NextIntlProvider
              locale={locale}
              messages={messages}
              timeZone={timeZone}
              now={now}
            >
              <HistoryProvider>
                <Navbar />
                <Header />
                <main>{children}</main>
                <FloatingSideMenu />
                <Footer />
                <HelpButton />
              </HistoryProvider>
            </NextIntlProvider>
          </MuiSetup>
        </TanStackQueryProvider>
      </body>

      <Matomo />
    </html>
  );
}
