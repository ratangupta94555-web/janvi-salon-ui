import React from "react";
import "./AdminPagination.css";

type Props = {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  itemLabel: string;
  onPageChange: (page: number) => void;
};

export default function AdminPagination({
  currentPage,
  pageSize,
  totalItems,
  itemLabel,
  onPageChange,
}: Props) {
  const pageCount = Math.ceil(totalItems / pageSize);
  if (pageCount <= 1) return null;

  const safePage = Math.min(currentPage, pageCount);
  const firstItem = (safePage - 1) * pageSize + 1;
  const lastItem = Math.min(safePage * pageSize, totalItems);

  return (
    <nav className="admin-pagination" aria-label={`${itemLabel} pages`}>
      <span aria-live="polite">
        Showing {firstItem}–{lastItem} of {totalItems} {itemLabel}
      </span>
      <div>
        <button
          type="button"
          aria-label="Previous page"
          disabled={safePage === 1}
          onClick={() => onPageChange(safePage - 1)}
        >
          Previous
        </button>
        <span aria-current="page">
          Page {safePage} of {pageCount}
        </span>
        <button
          type="button"
          aria-label="Next page"
          disabled={safePage === pageCount}
          onClick={() => onPageChange(safePage + 1)}
        >
          Next
        </button>
      </div>
    </nav>
  );
}
