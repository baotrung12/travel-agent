import sanitizeHtml from "sanitize-html";

// Allow only the formatting the admin rich-text editor produces; strips scripts, event handlers, iframes, etc.
export function sanitizeRichText(html: string | null | undefined): string {
  return sanitizeHtml(html ?? "", {
    allowedTags: ["p", "br", "strong", "b", "em", "i", "s", "u", "code", "pre", "blockquote",
      "h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "li", "hr", "span", "a"],
    allowedAttributes: { a: ["href", "target", "rel"] },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer nofollow", target: "_blank" }),
    },
  });
}
