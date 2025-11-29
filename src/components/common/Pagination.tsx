import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
}: PaginationProps) {
    const getPagesToDisplay = () => {
        const pages: (number | string)[] = [];

        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 4) {
                pages.push(1, 2, 3, 4, 5, "...", totalPages);
            } else if (currentPage >= totalPages - 3) {
                pages.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(
                    1,
                    "...",
                    currentPage - 1,
                    currentPage,
                    currentPage + 1,
                    "...",
                    totalPages
                );
            }
        }

        return pages;
    };

    const pages = getPagesToDisplay();

    return (
        <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-[49px] h-[44px] flex items-center justify-center rounded-[2px] text-gray-300 bg-[#1a1a1a] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#2a2a2a] transition"
            >
                <ChevronLeft className="w-4 h-4" />
            </button>

            {pages.map((page, index) =>
                page === "..." ? (
                    <span
                        key={`ellipsis-${index}`}
                        className="w-[49px] h-[44px] flex items-center justify-center text-gray-400 select-none"
                    >
                        ...
                    </span>
                ) : (
                    <button
                        key={page}
                        onClick={() => onPageChange(Number(page))}
                        disabled={currentPage === page}
                        className={`w-[49px] h-[44px] flex items-center justify-center rounded-[2px] font-medium transition
          ${currentPage === page
                                ? "bg-[#8E4EC6] text-white disabled:opacity-70 disabled:cursor-not-allowed"
                                : "bg-[#1a1a1a] text-gray-300 hover:bg-[#2a2a2a]"
                            }`}
                    >
                        {page}
                    </button>
                )
            )}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-[49px] h-[44px] flex items-center justify-center rounded-[2px] text-gray-300 bg-[#1a1a1a] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#2a2a2a] transition"
            >
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>

    );
}
