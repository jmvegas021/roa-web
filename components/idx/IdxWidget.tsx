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
 * @deprecated Prefer IdxBrokerWidget for official script embeds.
 * Kept as a light CTA fallback for home teaser slots.
 */
export function IdxWidget({
  type,
  title,
  fallbackHref = "/search",
  className = "",
}: IdxWidgetProps) {
  const config = getPublicIdxConfig();
  const hasSearch =
    Boolean(config.subdomain) &&
    (type === "mapsearch"
      ? Boolean(config.mapSearchId)
      : type === "showcase"
        ? Boolean(config.showcaseId)
        : Boolean(config.quickSearchId || config.mapSearchId));

  return (
    <div
      className={`border border-stone-800 bg-stone-950/80 p-8 ${className}`}
    >
      {title ? (
        <p className="text-xs uppercase tracking-[0.18em] text-gold">{title}</p>
      ) : null}
      <p className="mt-3 font-display text-2xl text-stone-50">
        {hasSearch ? "Search the full MLS" : "MLS search"}
      </p>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-stone-400">
        {hasSearch
          ? "Open our IDX Broker map search for live inventory, map tools, and listing details."
          : "Configure IDX subdomain and map search widget ID to enable live MLS search."}
      </p>
      <Link
        href={fallbackHref}
        className="mt-6 inline-flex text-xs uppercase tracking-[0.2em] text-gold hover:underline"
      >
        {hasSearch ? "Open MLS search →" : "Go to search →"}
      </Link>
    </div>
  );
}
