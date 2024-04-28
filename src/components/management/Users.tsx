import React, { useState, useEffect, useRef } from 'react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import {
    TableHead,
    TableRow,
    TableHeader,
    TableBody,
    Table,
} from '~/components/ui/table';
import { type RouterOutputs, api } from '~/utils/api';
import Modal from 'react-modal';
import { UsersForm } from '~/components/management/UsersForm';
import { Spinner } from '~/components/ui/spinner';
import { TableCell } from '@mui/material';
import { User } from '~/components/management/User';

export const Users: React.FC = () => {
    const [_, setState] = useState(0);

    const users = api.user.list.useQuery();
    const { client: apiClient } = api.useContext();
    const ref = useRef<HTMLFormElement>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const changeModalState = () => {
        setIsModalOpen(!isModalOpen);
    };
    const [editableUser, setEditableUser] =
        useState<RouterOutputs['user']['getById']>();

    const editUser = async (arg: string) => {
        setEditableUser(await apiClient.user.getById.query(arg));
        changeModalState();
    };

    function createUser() {
        setEditableUser(null);
        changeModalState();
    }

    function rerender() {
        setState((prev) => prev + 1);
    }

    async function refetch() {
        await users.refetch();
    }

    useEffect(() => {
        if (users.data) rerender();
    }, [users.data]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                ref.current &&
                !ref.current.contains(event.target as HTMLFormElement)
            ) {
                setIsModalOpen(false);
            }
        };
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, [isModalOpen]);

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
                <Button onClick={createUser}>Новий користувач</Button>
                <Modal
                    isOpen={isModalOpen}
                    onRequestClose={changeModalState}
                    className="flex h-svh w-svw items-center justify-center"
                >
                    <UsersForm
                        formRef={ref}
                        changeModalState={changeModalState}
                        user={editableUser}
                    />
                </Modal>
            </div>
            <div className="rounded-lg border bg-neutral-300 p-2 shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-neutral-300">
                            <TableHead className="min-w-[150px]">
                                Ідентифікатор
                            </TableHead>
                            <TableHead className="min-w-[150px]">
                                Електронна пошта
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
                                <User
                                    editUser={editUser}
                                    user={user}
                                    refetch={refetch}
                                />
                            </TableRow>
                        ))}
                        {!users.data && (
                            <TableRow>
                                <TableCell colSpan={10}>
                                    <Spinner size="large" />
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </>
    );
};
