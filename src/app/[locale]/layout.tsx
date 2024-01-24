import { useMessages } from "next-intl";
import { getTranslator } from "next-intl/server";
import Footer from "./components/Footer";
import Header from "./components/Header";
import HelpButton from "./components/HelpButton";
import Navbar from "./components/Navbar";
import NextIntlProvider from "@/i18n/provider";
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

const RootLayout: Layout = ({ children, params: { locale } }) => {
  const messages = useMessages();
  if (messages == null) {
    throw new Error("Missing translations");
  }

  return (
    <html lang={locale}>
      <body>
        <MuiSetup>
          <NextIntlProvider messages={messages} locale={locale}>
            <Navbar />
            <Header />
            <main>{children}</main>
            <HelpButton />
            <Footer />
          </NextIntlProvider>
        </MuiSetup>
      </body>
    </html>
  );
};

export default RootLayout;
