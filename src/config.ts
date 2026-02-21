import { DEFAULT_LOCALE } from "./i18n/constants";
import type {
	CommentConfig,
	ExpressiveCodeConfig,
	LicenseConfig,
	NavBarConfig,
	ProfileConfig,
	SiteConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";

export const expressiveCodeConfig: ExpressiveCodeConfig = {
	theme: "github-dark",
};

export const commentConfig: CommentConfig = {
	giscus: {
		repo: "samuelferpim/site", // TODO: habilitar Discussions no seu repo
		repoId: "", // TODO: pegar em https://giscus.app
		category: "General",
		categoryId: "", // TODO: pegar em https://giscus.app
		mapping: "pathname",
		strict: "0",
		reactionsEnabled: "1",
		emitMetadata: "0",
		inputPosition: "bottom",
		theme: "preferred_color_scheme",
		lang: DEFAULT_LOCALE,
		loading: "lazy",
	},
};

export const siteConfig: SiteConfig = {
	title: "Samuel",
	subtitle: "Just the voices in my head",
	lang: DEFAULT_LOCALE as SiteConfig["lang"],
	themeColor: {
		hue: 225,
		fixed: false,
	},
	banner: {
		enable: true,
		src: "assets/images/banner.png",
		position: "center",
		quality: "mid",
		credit: {
			enable: false,
			text: "",
			url: "",
		},
	},
	toc: {
		enable: true,
		depth: 2,
	},
	favicon: [],
};

export const navBarConfig: NavBarConfig = {
	links: [
		LinkPreset.Home,
		LinkPreset.Archive,
		LinkPreset.About,
		LinkPreset.Portfolio,
		{
			name: "GitHub",
			url: "https://github.com/samuelferpim",
			external: true,
		},
	],
};

export const profileConfig: ProfileConfig = {
	avatar: "assets/images/avatar.jpg",
	avatarQuality: "high",
	name: "Samuel",
	bio: "???",
	links: [
		{
			name: "Instagram",
			icon: "fa6-brands:instagram",
			url: "https://instagram.com/samuelferpim",
		},
		{
			name: "LinkedIn",
			icon: "fa6-brands:linkedin",
			url: "https://www.linkedin.com/in/samuelferpim",
		},
		{
			name: "GitHub",
			icon: "fa6-brands:github",
			url: "https://github.com/samuelferpim",
		},
		{
			name: "E-mail",
			icon: "fa6-solid:envelope",
			url: "mailto:samuelferpim@gmail.com",
		},
	],
};

export const licenseConfig: LicenseConfig = {
	enable: true,
	name: "CC BY-NC-SA 4.0",
	url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
};