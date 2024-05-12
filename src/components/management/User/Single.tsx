import React from 'react';
import { api, type RouterOutputs } from '~/utils/api';
import { TableCell } from '../../ui/table';
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from '~/components/ui/popover';
import { Button } from '../../ui/button';
import { defaultFormatDt } from '~/utils/dates';
import { useToast } from '~/components/ui/use-toast';
import Image from 'next/image';

export const Single: React.FC<{
    entity: RouterOutputs['user']['list']['values'][number];
    edit: (arg: string) => void;
    refetch: () => void;
}> = ({ entity, edit, refetch }) => {
    const suspend = api.user.suspend.useMutation();
    const delete_ = api.user.delete.useMutation();
    const { toast } = useToast();

    async function suspendHandler(id: string) {
        try {
            await suspend.mutateAsync({
                id,
                value: !entity.suspended,
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

    async function deleteHandler(id: string) {
        try {
            await delete_.mutateAsync(id);
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
            <TableCell>
                <Image
                    className="rounded-full"
                    src={
                        entity.image ? entity.image : '/images/placeholder.svg'
                    }
                    alt={entity.name ?? 'Аватар'}
                    width={32}
                    height={32}
                />
            </TableCell>
            <TableCell>{entity.id}</TableCell>
            <TableCell>{entity.email ?? '📲'}</TableCell>
            <TableCell>{entity.name ?? '👤'}</TableCell>
            <TableCell>{defaultFormatDt(entity.createdAt)}</TableCell>
            <TableCell>{defaultFormatDt(entity.updatedAt)}</TableCell>
            <TableCell>{entity.reportCount}</TableCell>
            <TableCell>{entity.suspended ? '⛔' : '✅'}</TableCell>
            <TableCell className="text-right">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button size="icon" variant="ghost">
                            <MoreHorizontalIcon className="h-4 w-4" />
                            <span className="sr-only">Дії</span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="flex flex-col gap-2 transition-colors">
                        <Button onClick={() => edit(entity.id)}>
                            Редагувати
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => suspendHandler(entity.id)}
                        >
                            {entity.suspended ? 'Увімкнути' : 'Відключити'}{' '}
                            запис
                        </Button>
                        <Button
                            variant={'destructive'}
                            onClick={() => deleteHandler(entity.id)}
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
