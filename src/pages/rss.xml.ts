import rss from "@astrojs/rss";
import { getSortedPostsForLang } from "@utils/content-utils";
import { getPostLogicalSlug } from "@utils/content-utils";
import { getPostUrlBySlug } from "@utils/url-utils";
import type { APIContext } from "astro";
import MarkdownIt from "markdown-it";
import sanitizeHtml from "sanitize-html";
import { siteConfig } from "@/config";
import { DEFAULT_LOCALE, getKeyToLanguage } from "@/i18n/translation";
import { getEffectiveDate } from "@utils/date-utils";

const parser = new MarkdownIt();

function stripInvalidXmlChars(str: string): string {
	return str.replace(
		// biome-ignore lint/suspicious/noControlCharactersInRegex: https://www.w3.org/TR/xml/#charsets
		/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F\uFDD0-\uFDEF\uFFFE\uFFFF]/g,
		"",
	);
}

export async function GET(context: APIContext) {
	const blog = await getSortedPostsForLang(DEFAULT_LOCALE);

	return rss({
		title: siteConfig.title,
		description: siteConfig.subtitle || "No description",
		site: context.site ?? "https://samuelferpim.com",
		items: blog.map((post) => {
			const content =
				typeof post.body === "string" ? post.body : String(post.body || "");
			const cleanedContent = stripInvalidXmlChars(content);
			const pubDate = getEffectiveDate(post.data.published, post.data.updated);
			return {
				title: post.data.title,
				pubDate,
				description: post.data.description || "",
				link: getPostUrlBySlug(getPostLogicalSlug(post), DEFAULT_LOCALE),
				content: sanitizeHtml(parser.render(cleanedContent), {
					allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
				}),
			};
		}),
		customData: `<language>${getKeyToLanguage(DEFAULT_LOCALE)}</language>`,
	});
}
