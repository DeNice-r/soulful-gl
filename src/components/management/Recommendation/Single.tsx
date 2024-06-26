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
import { MoreHorizontalIcon } from 'lucide-react';

export const Single: React.FC<{
    entity: RouterOutputs['recommendation']['list']['values'][number];
    edit: (arg: string) => void;
    refetch: () => void;
}> = ({ entity, edit, refetch }) => {
    const publish = api.recommendation.publish.useMutation();
    const delete_ = api.recommendation.delete.useMutation();
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
            <TableCell>{entity.title}</TableCell>
            <TableCell>{entity.description}</TableCell>
            <TableCell>{entity?.author?.name ?? '👤'}</TableCell>
            <TableCell>{defaultFormatDateTime(entity.createdAt)}</TableCell>
            <TableCell>{defaultFormatDateTime(entity.updatedAt)}</TableCell>
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
