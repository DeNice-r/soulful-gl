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
import { truncateString } from '~/utils';

export const Post: React.FC<{
    post: RouterOutputs['post']['get'][number];
    editPost: (arg: string) => void;
    refetch: () => void;
}> = ({ post, editPost, refetch }) => {
    // const publishPostMutation = api.post.publish.useMutation();
    const deletePostMutation = api.post.delete.useMutation();
    const { toast } = useToast();

    async function deletePost(id: string) {
        try {
            await deletePostMutation.mutateAsync(id);
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
            <TableCell>{post.id}</TableCell>
            <TableCell>{truncateString(post.title)}</TableCell>
            <TableCell>{truncateString(post.description)}</TableCell>
            <TableCell>{post.image}</TableCell>
            <TableCell>{post?.author?.name}</TableCell>

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
                        {/*<Button*/}
                        {/*    variant="outline"*/}
                        {/*    onClick={() => publishPost(user.id)}*/}
                        {/*>*/}
                        {/*    {user.suspended ? 'Увімкнути' : 'Відключити'} запис*/}
                        {/*</Button>*/}
                        <Button
                            variant={'destructive'}
                            onClick={() => deletePost(post.id)}
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
