import { useLocale, useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import MuiSetup from "@/mui/setup";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { navbarLinks, type NavbarLinks } from "./components/NavbarLinks";
import type { GenerateMetadata, Layout } from "@/types/next";

export const generateMetadata: GenerateMetadata = async () => {
  const t = await getTranslations("Metadata");

  return {
    title: "Istex-DL",
    description: t("description"),
  };
};

const RootLayout: Layout = ({ children }) => {
  const locale = useLocale();
  const t = useTranslations();

  const translatedNavbarLinks: NavbarLinks = {
    istex: {
      label: t(navbarLinks.istex.label),
      url: navbarLinks.istex.url,
    },
    others: navbarLinks.others.map((link) => ({
      label: t(link.label),
      url: link.url,
    })),
  };

  return (
    <html lang={locale}>
      <body>
        <MuiSetup>
          <Navbar links={translatedNavbarLinks} />
          <Header />
          <main>{children}</main>
          <Footer />
        </MuiSetup>
      </body>
    </html>
  );
};

export default RootLayout;
