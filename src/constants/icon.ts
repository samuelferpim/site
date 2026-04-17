import type { Favicon } from "@/types/config.ts";

export const defaultFavicons: Favicon[] = [
	{
		src: "/favicon/icon-32.png",
		sizes: "32x32",
	},
	{
		src: "/favicon/icon.png",
		sizes: "512x512",
	},
	{
		src: "/favicon/apple-touch-icon.png",
		sizes: "180x180",
	},
];
