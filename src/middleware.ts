import createMiddleware from 'next-intl/middleware';
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from './i18n/constants';

export default createMiddleware({
  locales: SUPPORTED_LOCALES.map(({ code }) => code),
  defaultLocale: DEFAULT_LOCALE,
});

export const config = {
  // Skip all paths that should not be internationalized
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
