import { useLocale, useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import MuiSetup from '@/lib/mui/setup';
import Navbar from './Navbar';
import { navbarLinks, type NavbarLinks } from './NavbarLinks';
import type { GenerateMetadata, Layout } from '@/types/next';

interface RouteParams {
  locale: string;
}

export const generateMetadata: GenerateMetadata<RouteParams> = async () => {
  const t = await getTranslations('Metadata');

  return {
    title: 'Istex-DL',
    description: t('description'),
  };
};

const RootLayout: Layout = ({ children }) => {
  const locale = useLocale();
  const t = useTranslations('Home');

  const translatedNavbarLinks: NavbarLinks = {
    istex: {
      label: t(navbarLinks.istex.label),
      url: navbarLinks.istex.url,
    },
    others: navbarLinks.others.map(link => ({
      label: t(link.label),
      url: link.url,
    })),
  };

  return (
    <html lang={locale}>
      <body>
        <MuiSetup>
          <Navbar links={translatedNavbarLinks} />
          {children}
        </MuiSetup>
      </body>
    </html>
  );
};

export default RootLayout;
