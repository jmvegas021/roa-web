interface IdxHostedSearchProps {
  src: string;
  title?: string;
  className?: string;
}

/**
 * Embeds IDX Broker's hosted map/search page over HTTPS.
 * More reliable than the widget script on http://localhost (widgets use
 * protocol-relative middleware URLs that 404 over plain HTTP).
 */
export function IdxHostedSearch({
  src,
  title = "MLS map search",
  className = "",
}: IdxHostedSearchProps) {
  return (
    <div className={className}>
      <iframe
        title={title}
        src={src}
        className="h-[70vh] min-h-[32rem] w-full bg-stone-900 lg:h-[75vh]"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allow="geolocation; fullscreen"
      />
    </div>
  );
}
