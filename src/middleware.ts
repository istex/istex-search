import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['fr', 'en'],
  defaultLocale: 'fr',
});

export const config = {
  // Skip all paths that should not be internationalized
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
