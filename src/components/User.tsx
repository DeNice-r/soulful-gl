import type React from 'react';
import { type RouterOutputs } from '~/utils/api';
import { TableCell } from './ui/table';
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from '~/components/ui/popover';
import { Button } from './ui/button';

const User: React.FC<{ user: RouterOutputs['user']['list'][number] }> = ({
    user,
}) => {
    return (
        <>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.createdAt.toString()}</TableCell>
            <TableCell>{user.updatedAt.toString()}</TableCell>
            <TableCell>
                {user.suspended ? 'Активний' : 'Деактивований'}
            </TableCell>
            <TableCell className="text-right">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button size="icon" variant="ghost">
                            <MoreHorizontalIcon className="h-4 w-4" />
                            <span className="sr-only">Дії</span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="flex flex-col gap-2 transition-colors">
                        <Button variant={'secondary'}>Редагувати</Button>
                        <Button variant={'destructive'}>Видалити</Button>
                    </PopoverContent>
                </Popover>
            </TableCell>
        </>
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

export default User;
