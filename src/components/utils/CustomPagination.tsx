import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '~/components/ui/pagination';
import React from 'react';

export function CustomPagination({
    page,
    total,
    goToPage,
}: {
    page: number;
    total: number;
    goToPage: (page: number) => void;
}) {
    if (total <= 1) return null;

    function PageShortcut({ target }: { target: number }) {
        return (
            <PaginationItem>
                <PaginationLink
                    isActive={page === target}
                    onClick={() => goToPage(target)}
                >
                    {target}
                </PaginationLink>
            </PaginationItem>
        );
    }

    function getButtons() {
        const buttons = [];
        for (
            let i = Math.max(page - 2, 1);
            i <= Math.min(page + 2, total);
            i++
        ) {
            buttons.push(<PageShortcut target={i} />);
        }
        return buttons;
    }

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        disabled={page <= 1}
                        onClick={() => goToPage(page - 1)}
                    />
                </PaginationItem>
                {1 < page - 2 && <PageShortcut target={1} />}
                {1 < page - 4 && (
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                )}
                {1 === page - 4 && <PageShortcut target={3} />}
                {getButtons()}
                {total === page + 4 && <PageShortcut target={total - 1} />}
                {page + 4 < total && (
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                )}
                {page + 2 < total && <PageShortcut target={total} />}
                <PaginationItem>
                    <PaginationNext
                        disabled={page >= total}
                        onClick={() => goToPage(page + 1)}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
