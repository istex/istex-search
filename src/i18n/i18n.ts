import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => {
  const translations = (await import(`./translations/${locale}.json`)).default;

  return {
    messages: translations,
  };
});
