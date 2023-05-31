import { getRequestConfig } from 'next-intl/server';
import deepmerge from 'deepmerge';
import { DEFAULT_LOCALE } from './constants';

export default getRequestConfig(async ({ locale }) => {
  let translations = (await import(`./translations/${locale}.json`)).default;

  // If the current locale isn't the default one, merge the default translations
  // into it to make sure something a label is always displayed
  if (locale !== DEFAULT_LOCALE) {
    const defaultTranslations = (await import(`./translations/${DEFAULT_LOCALE}.json`)).default;
    translations = deepmerge(defaultTranslations, translations);
  }

  return {
    messages: translations,
  };
});
