"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { getPublicIdxConfig } from "@/lib/idx/public-config";

export type IdxWidgetKind = "quicksearch" | "showcase" | "mapsearch" | "carousel";

interface IdxBrokerWidgetProps {
  kind: IdxWidgetKind;
  widgetId?: string;
  title?: string;
  fallbackHref?: string;
  className?: string;
  minHeightClassName?: string;
}

function resolveWidgetId(
  kind: IdxWidgetKind,
  explicitId: string | undefined,
  config: ReturnType<typeof getPublicIdxConfig>
): string {
  if (explicitId) return explicitId;
  if (kind === "quicksearch") return config.quickSearchId;
  if (kind === "showcase" || kind === "carousel") return config.showcaseId;
  if (kind === "mapsearch") return config.mapSearchId;
  return "";
}

/**
 * Official IDX Broker widget embed.
 *
 * IDX widget scripts use protocol-relative middleware URLs (`//middleware…`).
 * On http://localhost those become http:// and 404; we rewrite them to https://
 * before executing the script.
 */
export function IdxBrokerWidget({
  kind,
  widgetId,
  title,
  fallbackHref = "/search",
  className = "",
  minHeightClassName = "min-h-[32rem]",
}: IdxBrokerWidgetProps) {
  const config = getPublicIdxConfig();
  const resolvedId = resolveWidgetId(kind, widgetId, config);
  const containerRef = useRef<HTMLDivElement>(null);
  const reactId = useId().replace(/:/g, "");
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !config.subdomain || !resolvedId) return;

    let cancelled = false;
    let objectUrl: string | null = null;
    const scriptId = `idxwidgetsrc-${resolvedId}`;

    async function mountWidget() {
      setHasError(false);
      document.getElementById(scriptId)?.remove();
      container
        ?.querySelectorAll("idx-prime-map-search")
        .forEach((node) => node.remove());

      try {
        const response = await fetch(
          `https://${config.subdomain}/idx/widgets/${resolvedId}`
        );
        if (!response.ok) {
          throw new Error(`Widget script HTTP ${response.status}`);
        }

        // Force HTTPS for middleware assets (broken over http://localhost).
        const source = (await response.text())
          .replaceAll(
            "//middleware.idxbroker.com",
            "https://middleware.idxbroker.com"
          )
          .replaceAll(
            "http://middleware.idxbroker.com",
            "https://middleware.idxbroker.com"
          );

        if (cancelled || !container) return;

        objectUrl = URL.createObjectURL(
          new Blob([source], { type: "text/javascript" })
        );

        const script = document.createElement("script");
        script.id = scriptId;
        script.src = objectUrl;
        script.async = false;
        script.dataset.reactMount = reactId;
        script.onerror = () => {
          if (!cancelled) setHasError(true);
        };
        container.appendChild(script);
      } catch {
        if (!cancelled) setHasError(true);
      }
    }

    void mountWidget();

    return () => {
      cancelled = true;
      document.getElementById(scriptId)?.remove();
      container
        .querySelectorAll("idx-prime-map-search")
        .forEach((node) => node.remove());
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [config.subdomain, resolvedId, reactId]);

  if (!config.subdomain || !resolvedId) {
    return (
      <div
        className={`border border-dashed border-gold/30 bg-stone-950/60 p-8 ${className}`}
      >
        {title ? (
          <p className="text-xs uppercase tracking-[0.18em] text-gold">{title}</p>
        ) : null}
        <p className="mt-3 font-display text-2xl text-stone-50">
          MLS search unavailable
        </p>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-stone-400">
          Set <code className="text-gold">NEXT_PUBLIC_IDX_SUBDOMAIN</code> and the
          matching widget ID to embed live IDX Broker search.
        </p>
        <Link
          href={fallbackHref}
          className="mt-6 inline-flex text-xs uppercase tracking-[0.2em] text-gold hover:underline"
        >
          Continue →
        </Link>
      </div>
    );
  }

  const hostedMapUrl = `https://${config.subdomain}/idx/map/mapsearch`;

  return (
    <div className={className}>
      {title ? (
        <p className="mb-3 text-xs uppercase tracking-[0.18em] text-stone-400">
          {title}
        </p>
      ) : null}
      <div
        ref={containerRef}
        className={`idx-broker-widget-host w-full overflow-hidden bg-stone-900 ${minHeightClassName}`}
        data-idx-widget-kind={kind}
        data-idx-widget-id={resolvedId}
      />
      {hasError ? (
        <div className="mt-4 border border-stone-800 bg-stone-950 p-6">
          <p className="text-sm text-stone-400">
            The embedded map widget failed to load. Open the hosted IDX search
            instead:
          </p>
          <Link
            href={hostedMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex text-xs uppercase tracking-[0.2em] text-gold hover:underline"
          >
            Open IDX map search →
          </Link>
        </div>
      ) : null}
      <noscript>
        <p className="mt-4 text-sm text-stone-400">
          Enable JavaScript to use MLS search, or{" "}
          <Link href={hostedMapUrl} className="text-gold">
            open IDX map search
          </Link>
          .
        </p>
      </noscript>
    </div>
  );
}
