import { siteConfig } from "../config";
import type I18nKey from "./i18nKey";
import { en } from "./languages/en";
import { ptBR } from "./languages/pt";


export type Translation = {
	[K in I18nKey]: string;
};

import {
	DEFAULT_LOCALE,
	SUPPORTED_LOCALES,
	type SupportedLocale,
} from "./constants";

export { DEFAULT_LOCALE, SUPPORTED_LOCALES, type SupportedLocale };

const map: { [key: string]: Translation } = {
	en: en,
	en_us: en,
	en_gb: en,
	en_au: en,
	pt_br: 	ptBR,
	pt: ptBR,
	"pt-br": ptBR,
};

const defaultTranslation = map[DEFAULT_LOCALE.toLowerCase()];

export function getTranslation(lang: string): Translation {
	return map[lang.toLowerCase()] || defaultTranslation;
}

export function i18n(key: I18nKey, lang?: string): string {
	const locale = lang || siteConfig.lang || DEFAULT_LOCALE;
	return getTranslation(locale)[key];
}

export function getKeyToLanguage(lang: string): string {
	const normalized = lang.replace("_", "-").toLowerCase();
	const [language, region] = normalized.split("-");
	if (!region) return language;
	return `${language}-${region.toUpperCase()}`;
}