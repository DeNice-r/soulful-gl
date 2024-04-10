import React from 'react';

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
        <Table>
            <TableHeader>
                <TableRow className="hover:bg-neutral-200">
                    <TableHead className="min-w-[150px]">Користувач</TableHead>
                    <TableHead className="hidden md:table-cell">
                        Дата створення
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                        Дата оновлення
                    </TableHead>
                    <TableHead className="hidden sm:table-cell">
                        Статус
                    </TableHead>
                    <TableHead className="pr-6 text-right">Дії</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.data?.map((user) => (
                    <TableRow key={user.id}>
                        <User user={user} />
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default Users;
