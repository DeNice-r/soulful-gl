import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import { api, type RouterOutputs } from '~/utils/api';
import { DEFAULT_LIMIT, NO_REFETCH } from '~/utils/constants';
import { useRouter } from 'next/router';
import Modal from 'react-modal';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from '~/components/ui/table';
import { CustomPagination } from '~/components/utils/CustomPagination';
import { TableCell } from '@mui/material';
import { Spinner } from '~/components/ui/spinner';
import { SortableRecommendationFields } from '~/utils/types';
import { Single } from '~/components/management/Recommendation/Single';
import { XForm } from '~/components/management/Recommendation/XForm';

const TableHeaders: Record<string, string> = {
    [SortableRecommendationFields.ID]: 'Ідентифікатор',
    [SortableRecommendationFields.TITLE]: 'Заголовок',
    [SortableRecommendationFields.DESCRIPTION]: 'Наповнення',
    author: 'Автор',
    [SortableRecommendationFields.CREATED_AT]: 'Дата створення',
    [SortableRecommendationFields.UPDATED_AT]: 'Дата оновлення',
    [SortableRecommendationFields.PUBLISHED]: 'Статус',
} as const;

const XTable: React.FC = () => {
    const router = useRouter();
    const queryParam = router.query.query;
    const orderBy = router.query.orderBy as string | undefined;
    const order = router.query.order as string | undefined;

    const [query, setQuery] = useState<string | undefined>(
        queryParam as string,
    );

    const limit = router.query.limit
        ? Number(router.query.limit)
        : DEFAULT_LIMIT;
    const page = router.query.page ? Number(router.query.page) : 1;

    const entities = api.recommendation.list.useQuery(
        { limit, page, query, orderBy, order },
        NO_REFETCH,
    );

    const total = entities.data?.count
        ? Math.ceil(entities.data.count / limit)
        : 0;

    const [_, setState] = useState(0);
    const [isMouseDown, setIsMouseDown] = useState(false);
    const { client: apiClient } = api.useContext();
    const formRef = useRef<HTMLFormElement>(null);

    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const changeModalState = () => {
        void entities.refetch();
        setIsModalOpen(!isModalOpen);
    };
    const [editable, setEditable] =
        useState<RouterOutputs['recommendation']['get']>();

    const editHandler = async (arg: string) => {
        setEditable(await apiClient.recommendation.get.query(arg));
        changeModalState();
    };

    function createHandler() {
        setEditable(null);
        changeModalState();
    }

    function rerender() {
        setState((prev) => prev + 1);
    }

    async function refetch() {
        await entities.refetch();
    }

    const goToPage = (page: number) => {
        const currentPath = router.pathname;
        const currentQuery = { ...router.query, page };
        void router.push({
            pathname: currentPath,
            query: currentQuery,
        });
    };

    const setOrderBy = (orderBy: string) => {
        const currentPath = router.pathname;
        const currentQuery = {
            ...router.query,
            orderBy,
            order:
                router.query.order === 'asc' || router.query.orderBy !== orderBy
                    ? 'desc'
                    : 'asc',
        };
        void router.push({
            pathname: currentPath,
            query: currentQuery,
        });
    };

    function debounce(fn: () => void, ms: number) {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }
        debounceRef.current = setTimeout(fn, ms);
    }

    useEffect(() => Modal.setAppElement('body'));

    useEffect(() => {
        if (entities.data) rerender();
    }, [entities.data]);

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
                <div className="relative min-w-96">
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
                        placeholder="Шукати рекомендації"
                        defaultValue={query}
                        onChange={(e) =>
                            debounce(() => setQuery(e.target.value), 1000)
                        }
                    />
                </div>
                <Button onClick={createHandler}>Нова рекомендація</Button>
                <Modal
                    isOpen={isModalOpen}
                    onRequestClose={changeModalState}
                    className="flex h-svh w-svw items-center justify-center"
                >
                    <XForm
                        formRef={formRef}
                        changeModalState={changeModalState}
                        entity={editable}
                    />
                </Modal>
            </div>
            <div className="rounded-lg border bg-neutral-300 p-2 shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-neutral-300">
                            {Object.keys(TableHeaders).map((key) => {
                                return (
                                    <TableHead
                                        className="min-w-[150px]"
                                        key={key}
                                        onClick={() => setOrderBy(key)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span>{TableHeaders[key]}</span>
                                            <span>
                                                {orderBy === key
                                                    ? order === 'asc'
                                                        ? '⬆️'
                                                        : '⬇️'
                                                    : ''}
                                            </span>
                                        </div>
                                    </TableHead>
                                );
                            })}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {entities.data?.values &&
                            entities.data.values.map((entity) => (
                                <TableRow
                                    key={entity.id}
                                    className="hover:bg-neutral-100/30"
                                >
                                    <Single
                                        edit={editHandler}
                                        entity={entity}
                                        refetch={refetch}
                                    />
                                </TableRow>
                            ))}
                        <CustomPagination
                            page={page}
                            total={total}
                            goToPage={goToPage}
                        />
                        {!entities.data && (
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

export default XTable;
