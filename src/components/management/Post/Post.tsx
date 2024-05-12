import React from 'react';
import Image from 'next/image';
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
import { truncateString } from '~/utils';
import { MoreHorizontalIcon } from 'lucide-react';

export const Post: React.FC<{
    post: RouterOutputs['post']['list']['values'][number];
    editPost: (arg: string) => void;
    refetch: () => void;
}> = ({ post, editPost, refetch }) => {
    const publishPostMutation = api.post.publish.useMutation();
    const deletePostMutation = api.post.delete.useMutation();
    const { toast } = useToast();

    async function publishPost() {
        try {
            publishPostMutation.mutate({
                id: post.id,
                value: !post.published,
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

    async function deletePost() {
        try {
            deletePostMutation.mutate(post.id);
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
                {post.image && (
                    <Image
                        src={post.image ?? '/images/placeholder.svg'}
                        alt={post.title}
                        width={128}
                        height={72}
                    />
                )}
            </TableCell>
            <TableCell>{post.id}</TableCell>
            <TableCell>{post.title}</TableCell>
            <TableCell>{post?.author?.name ?? '👤'}</TableCell>
            <TableCell>{defaultFormatDt(post.createdAt)}</TableCell>
            <TableCell>{defaultFormatDt(post.updatedAt)}</TableCell>
            <TableCell>{post.published ? '✅' : '⛔'}</TableCell>
            <TableCell className="text-right">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button size="icon" variant="ghost">
                            <MoreHorizontalIcon className="h-4 w-4" />
                            <span className="sr-only">Дії</span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="flex flex-col gap-2 transition-colors">
                        <Button onClick={() => editPost(post.id)}>
                            Редагувати
                        </Button>
                        <Button variant="outline" onClick={publishPost}>
                            {post.published ? 'Приховати' : 'Опублікувати'}{' '}
                            запис
                        </Button>
                        <Button variant="destructive" onClick={deletePost}>
                            Видалити
                        </Button>
                    </PopoverContent>
                </Popover>
            </TableCell>
        </>
    );
};
