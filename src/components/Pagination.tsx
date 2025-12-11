import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage <= 3) {
        // Near start: show 1 2 3 4 ... last
        pages.push(2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near end: show 1 ... last-3 last-2 last-1 last
        pages.push('...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        // Middle: show 1 ... current-1 current current+1 ... last
        pages.push('...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav className="flex items-center justify-center gap-xs sm:gap-sm py-lg" aria-label="Pagination">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-sm py-xs sm:px-md sm:py-sm min-h-touch font-sans font-medium text-caption sm:text-body
                   bg-surface border border-border text-text-primary
                   hover:bg-primary hover:text-white hover:border-primary
                   disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-surface disabled:hover:text-text-primary
                   transition-colors rounded"
        aria-label="Previous page"
      >
        <span className="hidden sm:inline">Previous</span>
        <span className="sm:hidden">←</span>
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-xs">
        {pageNumbers.map((page, index) => {
          if (page === '...') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-xs sm:px-sm py-xs text-text-secondary font-sans text-caption sm:text-body"
              >
                ...
              </span>
            );
          }

          const pageNum = page as number;
          const isActive = pageNum === currentPage;

          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`px-sm py-xs sm:px-md sm:py-sm min-h-touch min-w-[44px] sm:min-w-[48px] font-sans font-medium text-caption sm:text-body
                         border rounded transition-colors
                         ${
                           isActive
                             ? 'bg-primary text-white border-primary'
                             : 'bg-surface text-text-primary border-border hover:bg-primary hover:text-white hover:border-primary'
                         }`}
              aria-label={`Page ${pageNum}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {pageNum}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-sm py-xs sm:px-md sm:py-sm min-h-touch font-sans font-medium text-caption sm:text-body
                   bg-surface border border-border text-text-primary
                   hover:bg-primary hover:text-white hover:border-primary
                   disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-surface disabled:hover:text-text-primary
                   transition-colors rounded"
        aria-label="Next page"
      >
        <span className="hidden sm:inline">Next</span>
        <span className="sm:hidden">→</span>
      </button>
    </nav>
  );
}
