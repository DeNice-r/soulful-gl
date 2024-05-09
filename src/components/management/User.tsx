import React from 'react';
import { api, type RouterOutputs } from '~/utils/api';
import { TableCell } from '../ui/table';
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from '~/components/ui/popover';
import { Button } from '../ui/button';
import { defaultFormatDt } from '~/utils/dates';
import { useToast } from '~/components/ui/use-toast';

export const User: React.FC<{
    user: RouterOutputs['user']['list']['values'][number];
    editUser: (arg: string) => void;
    refetch: () => void;
}> = ({ user, editUser, refetch }) => {
    const suspendUserMutation = api.user.suspend.useMutation();
    const deleteUserMutation = api.user.delete.useMutation();
    const { toast } = useToast();

    async function suspendUser(id: string) {
        try {
            await suspendUserMutation.mutateAsync({
                id,
                value: !user.suspended,
            });
        } catch (e) {
            console.error(e);
            toast({
                title: 'Помилка',
                description:
                    e instanceof Error ? e.message : 'Невідома помилка',
                variant: 'destructive',
            });
        }
        void refetch();
    }

    async function deleteUser(id: string) {
        try {
            await deleteUserMutation.mutateAsync(id);
        } catch (e) {
            console.error(e);
            toast({
                title: 'Помилка',
                description:
                    e instanceof Error ? e.message : 'Невідома помилка',
                variant: 'destructive',
            });
        }
        void refetch();
    }

    return (
        <>
            <TableCell>{user.id}</TableCell>
            <TableCell>{user.email ?? '📲'}</TableCell>
            <TableCell>{user.name ?? '👤'}</TableCell>
            <TableCell>{defaultFormatDt(user.createdAt)}</TableCell>
            <TableCell>{defaultFormatDt(user.updatedAt)}</TableCell>
            <TableCell>{user.reportCount}</TableCell>
            <TableCell>{user.suspended ? '⛔' : '✅'}</TableCell>
            <TableCell className="text-right">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button size="icon" variant="ghost">
                            <MoreHorizontalIcon className="h-4 w-4" />
                            <span className="sr-only">Дії</span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="flex flex-col gap-2 transition-colors">
                        <Button onClick={() => editUser(user.id)}>
                            Редагувати
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => suspendUser(user.id)}
                        >
                            {user.suspended ? 'Увімкнути' : 'Відключити'} запис
                        </Button>
                        <Button
                            variant={'destructive'}
                            onClick={() => deleteUser(user.id)}
                        >
                            Видалити
                        </Button>
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
