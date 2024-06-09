import React from 'react';
import { api, type RouterOutputs } from '~/utils/api';
import { TableCell } from '../../ui/table';
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from '~/components/ui/popover';
import { Button } from '../../ui/button';
import { defaultFormatDateTime } from '~/utils/dates';
import { useToast } from '~/components/ui/use-toast';
import Image from 'next/image';
import { MoreHorizontalIcon } from 'lucide-react';

export const Single: React.FC<{
    entity: RouterOutputs['user']['list']['values'][number];
    edit: (arg: string) => void;
    refetch: () => void;
}> = ({ entity, edit, refetch }) => {
    const resetPassword = api.user.resetPassword.useMutation();
    const suspend = api.user.suspend.useMutation();
    const delete_ = api.user.delete.useMutation();
    const { toast } = useToast();

    function successToast(description: string) {
        toast({
            title: 'Успіх',
            description,
        });
    }

    async function resetPasswordHandler() {
        try {
            await resetPassword.mutateAsync(entity.id);
            successToast('Пароль скинуто');
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

    async function suspendHandler() {
        try {
            await suspend.mutateAsync({
                id: entity.id,
                value: !entity.suspended,
            });
            successToast('Статус змінено');
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

    async function deleteHandler() {
        try {
            await delete_.mutateAsync(entity.id);
            successToast('Запис видалено');
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
            <TableCell>{defaultFormatDateTime(entity.createdAt)}</TableCell>
            <TableCell>{defaultFormatDateTime(entity.updatedAt)}</TableCell>
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
                            onClick={resetPasswordHandler}
                        >
                            Скинути пароль
                        </Button>
                        <Button variant="outline" onClick={suspendHandler}>
                            {entity.suspended ? 'Увімкнути' : 'Відключити'}{' '}
                            запис
                        </Button>
                        <Button variant={'destructive'} onClick={deleteHandler}>
                            Видалити
                        </Button>
                    </PopoverContent>
                </Popover>
            </TableCell>
        </>
    );
};
