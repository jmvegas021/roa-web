import Link from "next/link";
import { SITE } from "@/lib/content/team";
import { withBasePath } from "@/lib/site/basePath";

/**
 * Combined ROA + Kevin Shoun lockup (white ink + Legacy Green accents)
 * processed for dark navy chrome. Native 1024×178.
 */
const LOGO_SRC = withBasePath("/images/roa-kevin-shoun-logo.png");
const LOGO_NATIVE_WIDTH = 1024;
const LOGO_NATIVE_HEIGHT = 178;
const LOGO_ASPECT = LOGO_NATIVE_WIDTH / LOGO_NATIVE_HEIGHT;

interface BrandLogoProps {
  /** Rendered width in CSS pixels; height follows native aspect ratio. */
  width?: number;
  className?: string;
  priority?: boolean;
  /** When true, wraps logo in a home link. */
  linked?: boolean;
}

/**
 * Official ROA × Kevin Shoun horizontal logo for dark ink/navy chrome.
 * White lettering + Legacy Green accents — no light plate.
 */
export function BrandLogo({
  width = 280,
  className = "",
  priority = false,
  linked = false,
}: BrandLogoProps) {
  const height = Math.round(width / LOGO_ASPECT);
  const image = (
    // Plain img: explicit width/height attrs prevent 0×0 collapse from w-auto.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={LOGO_SRC}
      alt="Realty of America — Kevin Shoun"
      width={width}
      height={height}
      decoding="async"
      {...(priority
        ? { fetchPriority: "high" as const }
        : { loading: "lazy" as const })}
      className={`block max-w-full ${className}`}
      style={{ width, height, maxWidth: "100%" }}
    />
  );

  if (!linked) return image;

  return (
    <Link
      href="/"
      className="inline-block max-w-full cursor-pointer focus-visible:outline-offset-4"
      aria-label={`${SITE.brand} — ${SITE.office} — home`}
    >
      {image}
    </Link>
  );
}

interface BrandLockupProps {
  logoWidth?: number;
  /** Logo already includes Kevin Shoun — office line off by default. */
  showOffice?: boolean;
  priority?: boolean;
  className?: string;
  officeClassName?: string;
}

/** Logo lockup for header / footer only (never hero). */
export function BrandLockup({
  logoWidth = 280,
  showOffice = false,
  priority = false,
  className = "",
  officeClassName = "mt-2 text-[0.65rem] uppercase tracking-[0.22em] text-stone-400 sm:text-xs",
}: BrandLockupProps) {
  return (
    <div className={`min-w-0 ${className}`}>
      <BrandLogo width={logoWidth} priority={priority} linked />
      {showOffice ? (
        <p className={officeClassName}>{SITE.office}</p>
      ) : null}
    </div>
  );
}
