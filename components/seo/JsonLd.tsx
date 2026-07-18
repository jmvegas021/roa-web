interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
}

/** Renders Schema.org JSON-LD for search engines and AI citation systems. */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
