import React from 'react';
import { Button } from '~/components/ui/button';
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from '~/components/ui/popover';
import {
    TableHead,
    TableRow,
    TableHeader,
    TableCell,
    TableBody,
    Table,
} from '~/components/ui/table';

const Operators: React.FC = () => {
    return (
        <div className="rounded-lg border bg-neutral-300 p-2 shadow-sm">
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-neutral-200">
                        <TableHead className="min-w-[150px]">
                            Користувач
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                            Дата створення
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                            Дата оновлення
                        </TableHead>
                        <TableHead className="hidden sm:table-cell">
                            Статус
                        </TableHead>
                        <TableHead className="pr-6 text-right">Дії</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell>Антон Чернюк</TableCell>
                        <TableCell className="hidden md:table-cell">
                            Липень 15, 2021
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                            Червень 23, 2023
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                            Активний
                        </TableCell>
                        <TableCell className="text-right">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button size="icon" variant="ghost">
                                        <MoreHorizontalIcon className="h-4 w-4" />
                                        <span className="sr-only">Дії</span>
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <span>Редагувати</span>
                                    <span>Видалити</span>
                                </PopoverContent>
                            </Popover>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    );
};

function MoreHorizontalIcon(
    props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>,
) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="1" />
            <circle cx="19" cy="12" r="1" />
            <circle cx="5" cy="12" r="1" />
        </svg>
    );
}

export default Operators;
