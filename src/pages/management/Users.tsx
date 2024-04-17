import React from 'react';
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

const Users: React.FC = () => {
    const users = api.user.list.useQuery();
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
                <Button>Новий користувач</Button>
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
