import Link from "next/link";
import { getPublicIdxConfig } from "@/lib/idx/public-config";

interface IdxWidgetProps {
  type: "quicksearch" | "showcase" | "mapsearch";
  title?: string;
  widgetId?: string;
  fallbackHref?: string;
  className?: string;
}

/**
 * Embeds an IDX Broker widget when IDs / subdomain are configured.
 * Falls back to a branded CTA into /search or /wrapper.
 */
export function IdxWidget({
  type,
  title,
  widgetId,
  fallbackHref = "/search",
  className = "",
}: IdxWidgetProps) {
  const config = getPublicIdxConfig();
  const resolvedId =
    widgetId ||
    (type === "quicksearch"
      ? config.quickSearchId
      : type === "showcase"
        ? config.showcaseId
        : undefined);

  if (config.subdomain && resolvedId) {
    return (
      <div className={`border border-stone-800 bg-stone-950 p-4 ${className}`}>
        {title ? (
          <p className="mb-3 text-xs uppercase tracking-[0.18em] text-stone-400">
            {title}
          </p>
        ) : null}
        <div
          className="IDX-widget"
          data-widget-id={resolvedId}
          data-widget-type={type}
          id={`idx-widget-${type}-${resolvedId}`}
        />
        <noscript>
          <p className="text-sm text-stone-400">
            Enable JavaScript to use MLS search, or{" "}
            <Link href={fallbackHref} className="text-gold">
              continue here
            </Link>
            .
          </p>
        </noscript>
      </div>
    );
  }

  return (
    <div
      className={`border border-dashed border-gold/30 bg-stone-950/60 p-8 ${className}`}
    >
      {title ? (
        <p className="text-xs uppercase tracking-[0.18em] text-gold">{title}</p>
      ) : null}
      <p className="mt-3 font-display text-2xl text-stone-50">
        Full MLS search via IDX
      </p>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-stone-400">
        Configure <code className="text-gold">NEXT_PUBLIC_IDX_SUBDOMAIN</code> and
        widget IDs to embed live Quick Search. Until then, use our search page and
        dynamic wrapper.
      </p>
      <Link
        href={fallbackHref}
        className="mt-6 inline-flex text-xs uppercase tracking-[0.2em] text-gold hover:underline"
      >
        Go to search →
      </Link>
    </div>
  );
}
