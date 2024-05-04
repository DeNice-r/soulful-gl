import React, { type RefObject, type ChangeEvent } from 'react';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '~/components/ui/form';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import type * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateUserSchema } from '~/utils/schemas';
import { api, type RouterOutputs } from '~/utils/api';
import { uploadImage } from '~/utils/s3/frontend';

declare module 'react' {
    interface CSSProperties {
        '--image-url'?: string;
    }
}

export const UsersForm: React.FC<{
    user?: RouterOutputs['user']['getById'];
    changeModalState: () => void;
    formRef: RefObject<HTMLFormElement>;
}> = ({ user, changeModalState, formRef }) => {
    const createUser = api.user.create.useMutation();
    const form = useForm<z.infer<typeof CreateUserSchema>>({
        resolver: zodResolver(CreateUserSchema),
        defaultValues: {
            name: user?.name ?? '',
            description: user?.description ?? '',
            email: user?.email ?? '',
            image: user?.image ?? '',
            notes: user?.notes ?? '',
        },
    });
    function onSubmit(values: z.infer<typeof CreateUserSchema>) {
        createUser.mutate(values);
    }
    async function upload(e: ChangeEvent<HTMLInputElement>) {
        e.preventDefault();
        if (e?.target?.files?.[0]) {
            const imageUrl = await uploadImage(e.target.files[0]);
            if (imageUrl) {
                form.setValue('image', imageUrl);
            }
        }
    }
    return (
        <Form {...form}>
            <form
                ref={formRef}
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex h-[90%] w-3/4 flex-col items-center justify-center gap-4 rounded-lg bg-gray-300 outline outline-neutral-400"
            >
                <div className="flex h-5/6 w-4/5 flex-col items-center justify-between gap-4">
                    <FormField
                        control={form.control}
                        name="image"
                        render={({ field }) => (
                            <FormItem className="flex flex-col items-center gap-1">
                                <label
                                    className="cursor-pointer"
                                    htmlFor="image-upload"
                                >
                                    <div
                                        style={{
                                            '--image-url': `url(${field.value ? field.value : user?.image})`,
                                        }}
                                        className={`flex h-24 w-24 items-center justify-center rounded-full border-2 border-gray-400 bg-white bg-[image:var(--image-url)] bg-cover transition-all hover:opacity-80 dark:bg-gray-700`}
                                    >
                                        <UploadIcon className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                                    </div>
                                    <Input
                                        accept="image/*"
                                        id="image-upload"
                                        className="sr-only"
                                        type="file"
                                        onInput={upload}
                                    />
                                </label>
                                <FormControl>
                                    <Input
                                        accept="text"
                                        className="hidden"
                                        type="text"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex h-3/5 w-full gap-12">
                        <div className="flex flex-1 flex-col gap-4">
                            <div className="w flex justify-between gap-4">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem className="flex-grow">
                                            <FormLabel className="text-xl">
                                                Електронна пошта
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    className="flex-grow outline outline-1 outline-neutral-400"
                                                    placeholder="anton@gmail.com"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem className="flex-grow">
                                            <FormLabel className="text-xl">
                                                Ім&apos;я користувача
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    className="flex-grow outline outline-1 outline-neutral-400"
                                                    placeholder="Антон"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem className="">
                                        <FormLabel className="text-xl">
                                            Опис
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                className="flex-grow  outline outline-1 outline-neutral-400"
                                                placeholder="Введіть текст..."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Опис нового користувача (видимий для
                                            користувача)
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="notes"
                                render={({ field }) => (
                                    <FormItem className="">
                                        <FormLabel className="text-xl">
                                            Нотатки про користувача
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                className="flex-grow  outline outline-1 outline-neutral-400"
                                                placeholder="Введіть текст..."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        {/* todo: userRole */}
                        {/* <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel className="text-xl">
                                        Username
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            className="flex-grow outline outline-1 outline-neutral-400"
                                            placeholder="anton@gmail.com"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        This is your public display name.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        /> */}
                    </div>

                    <div className="flex gap-8 self-end">
                        <Button className=" px-7 py-6" type="submit">
                            {user ? 'Редагувати' : 'Створити'}
                        </Button>
                        <Button
                            className="px-7 py-6"
                            variant="destructive"
                            onClick={changeModalState}
                        >
                            Відмінити
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    );
};

function UploadIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
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
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" x2="12" y1="3" y2="15" />
        </svg>
    );
}
