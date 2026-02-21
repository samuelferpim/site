export const SUPPORTED_LOCALES = ["en", "pt-BR"] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number] | string;

export const DEFAULT_LOCALE: SupportedLocale = "en";