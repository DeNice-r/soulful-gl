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
import { MoreHorizontalIcon } from 'lucide-react';

export const Single: React.FC<{
    entity: RouterOutputs['qanda']['list']['values'][number];
    edit: (arg: number) => void;
    refetch: () => void;
}> = ({ entity, edit, refetch }) => {
    const publish = api.qanda.publish.useMutation();
    const delete_ = api.qanda.delete.useMutation();
    const { toast } = useToast();

    async function publishHandler() {
        try {
            publish.mutate({
                id: entity.id,
                value: !entity.published,
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

    async function deleteHandler() {
        try {
            delete_.mutate(entity.id);
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
            <TableCell>{entity.id}</TableCell>
            <TableCell>{entity.question}</TableCell>
            <TableCell>{entity.answer}</TableCell>
            <TableCell>{entity.authorEmail}</TableCell>
            <TableCell>{entity.authorName}</TableCell>
            <TableCell>{defaultFormatDt(entity.createdAt)}</TableCell>
            <TableCell>{defaultFormatDt(entity.updatedAt)}</TableCell>
            <TableCell>{entity.published ? '✅' : '⛔'}</TableCell>
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
                        <Button variant="outline" onClick={publishHandler}>
                            {entity.published ? 'Приховати' : 'Опублікувати'}{' '}
                            запис
                        </Button>
                        <Button variant="destructive" onClick={deleteHandler}>
                            Видалити
                        </Button>
                    </PopoverContent>
                </Popover>
            </TableCell>
        </>
    );
};
