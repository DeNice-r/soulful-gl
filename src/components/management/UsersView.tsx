import React, { useState, useEffect, useRef } from 'react';
import { type useRouter } from 'next/router';
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
import { CustomPagination } from '~/components/CustomPagination';

export const UsersView: React.FC<{
    usersQuery: {
        data?: RouterOutputs['user']['list'];
        // return type is unused anyway, so no need to waste time on it
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        refetch: () => Promise<any>;
    };
    page: number;
    total: number;
    query?: string;
    setQuery: React.Dispatch<React.SetStateAction<string | undefined>>;
    router: ReturnType<typeof useRouter>;
}> = ({ usersQuery, page, total, query, setQuery, router }) => {
    const [_, setState] = useState(0);
    const [isMouseDown, setIsMouseDown] = useState(false);
    const { client: apiClient } = api.useContext();
    const formRef = useRef<HTMLFormElement>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const changeModalState = () => {
        void usersQuery.refetch();
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
        await usersQuery.refetch();
    }

    const goToPage = (page: number) => {
        const currentPath = router.pathname;
        const currentQuery = { ...router.query, page };
        void router.push({
            pathname: currentPath,
            query: currentQuery,
        });
    };

    useEffect(() => Modal.setAppElement('body'));

    useEffect(() => {
        if (usersQuery.data) rerender();
    }, [usersQuery.data]);

    useEffect(() => {
        const handleMouseDown = (event: MouseEvent) => {
            if (
                formRef.current?.parentElement?.contains(
                    event.target as Node,
                ) &&
                !formRef.current.contains(event.target as Node)
            ) {
                setIsMouseDown(true);
            }
        };

        const handleMouseUp = (event: MouseEvent) => {
            if (
                isMouseDown &&
                formRef.current?.parentElement?.contains(
                    event.target as Node,
                ) &&
                !formRef.current.contains(event.target as Node)
            ) {
                setIsModalOpen(false);
            }
            setIsMouseDown(false);
        };

        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isModalOpen, isMouseDown]);
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
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                />
                            </svg>
                        </div>
                        <Input
                            type="search"
                            name="query"
                            id="default-search"
                            className="w-full py-[1.7rem] ps-10"
                            placeholder="Шукати користувачів"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            required
                        />
                        {/*<Button*/}
                        {/*    type="submit"*/}
                        {/*    className="absolute bottom-2.5 end-2.5"*/}
                        {/*>*/}
                        {/*    Пошук*/}
                        {/*</Button>*/}
                    </div>
                </form>
                <Button onClick={createUser}>Новий користувач</Button>
                <Modal
                    isOpen={isModalOpen}
                    onRequestClose={changeModalState}
                    className="flex h-svh w-svw items-center justify-center"
                >
                    <UsersForm
                        formRef={formRef}
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
                            <TableHead className="min-w-[150px]">
                                Ім&apos;я
                            </TableHead>
                            <TableHead className="hidden md:table-cell">
                                Дата створення
                            </TableHead>
                            <TableHead className="hidden md:table-cell">
                                Дата оновлення
                            </TableHead>
                            <TableHead className="hidden md:table-cell">
                                Скарги
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
                        {usersQuery.data?.values &&
                            usersQuery.data.values.map((user) => (
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
                        <CustomPagination
                            page={page}
                            total={total}
                            goToPage={goToPage}
                        />
                        {!usersQuery.data && (
                            <TableRow>
                                <TableCell colSpan={100}>
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
