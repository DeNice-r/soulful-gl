import React, { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';

import {
    TableHead,
    TableRow,
    TableHeader,
    TableBody,
    Table,
} from '~/components/ui/table';
import User from '~/components/User';
import { api } from '~/utils/api';
import Modal from 'react-modal';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '~/components/ui/form';
import { CreateUserSchema } from '~/utils/schemas';
import { type z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const Users: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(true);
    const changeModalState = () => {
        setIsModalOpen(!isModalOpen);
    };
    const users = api.user.list.useQuery();
    const form = useForm<z.infer<typeof CreateUserSchema>>({
        resolver: zodResolver(CreateUserSchema),
    });
    function onSubmit(values: z.infer<typeof CreateUserSchema>) {
        console.log(values);
    }
    return (
        <>
            <div className="flex w-full justify-between">
                <form className="w-1/4">
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
                            <svg
                                className="h-4 w-4 text-gray-500 dark:text-gray-400"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    stroke="currentColor"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                />
                            </svg>
                        </div>
                        <Input
                            type="search"
                            id="default-search"
                            className="w-full py-[1.7rem] ps-10"
                            placeholder="Шукати користувачів"
                            required
                        />
                        <Button
                            type="submit"
                            className="absolute bottom-2.5 end-2.5"
                        >
                            Пошук
                        </Button>
                    </div>
                </form>
                <Button onClick={changeModalState}>Новий користувач</Button>
                <Modal
                    isOpen={isModalOpen}
                    onRequestClose={changeModalState}
                    className="flex h-svh w-svw items-center justify-center"
                >
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="flex h-3/4 w-3/4 flex-col items-center justify-center gap-4 rounded-lg bg-gray-300"
                        >
                            <div className="flex h-2/3 w-4/5 flex-col gap-4">
                                <div className="flex flex-col gap-4">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xl">
                                                    Електронна пошта
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        className="max-w-96"
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
                                            <FormItem>
                                                <FormLabel className="text-xl">
                                                    Ім&apos;я користувача
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        className="max-w-96"
                                                        placeholder="Антон"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xl">
                                                    Опис
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        className="max-w-96"
                                                        placeholder="Введіть текст..."
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Опис нового користувача
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    {/*todo: userRole
                            
                                <FormField
                                    control={form.control}
                                    name="role"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Username</FormLabel>
                                            <FormControl>
                                                <Input
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
                                <Button className="self-end" type="submit">
                                    Створити
                                </Button>
                            </div>
                        </form>
                    </Form>
                </Modal>
            </div>
            <div className="rounded-lg border bg-neutral-300 p-2 shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-neutral-300">
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
                            <TableHead className="pr-6 text-right">
                                Дії
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.data?.map((user) => (
                            <TableRow
                                key={user.id}
                                className="hover:bg-neutral-100/30"
                            >
                                <User user={user} />
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </>
    );
};

export default Users;
