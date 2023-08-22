import { NextIntlClientProvider, useLocale, useMessages } from "next-intl";
import { getTranslator } from "next-intl/server";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import MuiSetup from "@/mui/setup";
import type { GenerateMetadata, Layout } from "@/types/next";

export const generateMetadata: GenerateMetadata = async ({
  params: { locale },
}) => {
  const t = await getTranslator(locale, "home.metadata");

  return {
    title: "Istex-DL",
    description: t("description"),
  };
};

const RootLayout: Layout = ({ children }) => {
  const locale = useLocale();
  const messages = useMessages();

  return (
    <html lang={locale}>
      <body>
        <MuiSetup>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <Navbar />
            <Header />
            <main>{children}</main>
            <Footer />
          </NextIntlClientProvider>
        </MuiSetup>
      </body>
    </html>
  );
};

export default RootLayout;
