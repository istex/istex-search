import { useMessages, useNow, useTimeZone } from "next-intl";
import { getTranslations } from "next-intl/server";
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
  const t = await getTranslations({ locale, namespace: "home.metadata" });

  return {
    title: "Istex-DL",
    description: t("description"),
  };
};

const RootLayout: Layout = ({ children, params: { locale } }) => {
  const messages = useMessages();
  const timeZone = useTimeZone();
  const now = useNow();

  return (
    <html lang={locale}>
      <body>
        <MuiSetup>
          <NextIntlProvider
            locale={locale}
            messages={messages}
            timeZone={timeZone}
            now={now}
          >
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
