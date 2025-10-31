import type { LocalePrefixMode } from 'next-intl/routing';

const localePrefix: LocalePrefixMode = 'as-needed';

export const AppConfig = {
  name: 'TechTus Nextjs',
  locales: ['en', 'ja'],
  defaultLocale: 'en',
  localePrefix,
};

export const localeMatcher = `(?:/(?<locale>${AppConfig.locales.join('|')}))?`;
