import { defineRouting } from 'next-intl/routing';
import { AppConfig } from '@/constants/app-config';

export const routing = defineRouting({
  locales: AppConfig.locales,
  localePrefix: AppConfig.localePrefix,
  defaultLocale: AppConfig.defaultLocale,
});
