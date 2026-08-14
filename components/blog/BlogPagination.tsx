"use client";

interface BlogPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function BlogPagination({
  page,
  totalPages,
  onPageChange,
}: BlogPaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav
      aria-label="Journal pages"
      className="mt-12 flex flex-wrap items-center justify-center gap-1 border-t border-stone-800 pt-10"
    >
      <PageButton
        label="Previous"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      />
      {pages.map((value) => (
        <PageButton
          key={value}
          label={String(value)}
          current={value === page}
          onClick={() => onPageChange(value)}
        />
      ))}
      <PageButton
        label="Next"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      />
    </nav>
  );
}

interface PageButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  current?: boolean;
}

function PageButton({
  label,
  onClick,
  disabled = false,
  current = false,
}: PageButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-current={current ? "page" : undefined}
      className={`inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center px-3 text-xs uppercase tracking-[0.16em] transition duration-200 disabled:cursor-not-allowed disabled:opacity-40 ${
        current
          ? "text-gold"
          : "text-stone-400 hover:text-stone-50"
      }`}
    >
      {label}
    </button>
  );
}
