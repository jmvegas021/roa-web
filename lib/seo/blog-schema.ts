import { SITE } from "@/lib/content/team";
import { absoluteUrl } from "@/lib/site/siteUrl";
import type { BlogFaqItem, BlogPost } from "@/lib/blog/types";

export function buildBlogPostingSchema(post: BlogPost) {
  const url = absoluteUrl(`/blog/${post.slug}`);
  const modified = post.updatedAt ?? post.publishedAt;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: modified,
    author: {
      "@type": "Person",
      name: post.author,
      url: absoluteUrl("/agents/kevin-shoun"),
    },
    publisher: {
      "@id": absoluteUrl("/#organization"),
      name: SITE.brand,
    },
    image: absoluteUrl(post.heroImage),
    url,
    mainEntityOfPage: url,
    keywords: post.keywords.join(", "),
    articleSection: post.category,
  };
}

export function buildFaqPageSchema(items: BlogFaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
