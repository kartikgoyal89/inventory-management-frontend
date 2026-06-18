import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ page, pages, total, onChange }) => {
  if (pages <= 1) return null;

  return (
    <div className="flex items-center justify-between border-t border-gray-200 px-1 py-3">
      <p className="text-xs text-gray-500">
        Page {page} of {pages} &middot; {total} total
      </p>
      <div className="flex gap-1">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page <= 1}
          className="rounded-md border border-gray-300 p-1.5 text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          onClick={() => onChange(page + 1)}
          disabled={page >= pages}
          className="rounded-md border border-gray-300 p-1.5 text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
