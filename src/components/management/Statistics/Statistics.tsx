import React from 'react';
import { api } from '~/utils/api';
import { Table, TableBody, TableRow } from '~/components/ui/table';
import { TableCell } from '@mui/material';
import { Spinner } from '~/components/ui/spinner';
import { defaultFormatDiff } from '~/utils/dates';
import LineChart from '~/components/management/Statistics/LineChart';
import { NO_REFETCH } from '~/utils/constants';
import { Interval, IntervalMs } from '~/utils/types';

const l10n: Record<string, Record<string, string>> = {
    numbers: {
        messengerUserCount: 'Користувачі з месенджерів',
        userCount: 'Користувачі платформи',
        operatorCount: 'З них оператори',
    },
    diffs: {
        avgDuration: 'Середня тривалість активних чатів',
    },
};

export const Statistics: React.FC = () => {
    const stats = api.stats.list.useQuery(undefined, {
        ...NO_REFETCH,
        refetchInterval: IntervalMs[Interval.MINUTE],
    });

    return (
        <>
            {/* todo: interval name and number select*/}
            <div className="flex flex-row flex-wrap md:flex-nowrap">
                <div className="flex-1 p-2">
                    <LineChart
                        data={
                            Array.isArray(stats.data?.graphs.messageCount)
                                ? stats.data?.graphs.messageCount
                                : []
                        }
                        label="Повідомлення"
                    ></LineChart>
                </div>
                <div className="flex-1 p-2">
                    <LineChart
                        data={
                            Array.isArray(stats.data?.graphs.chatCount)
                                ? stats.data?.graphs.chatCount
                                : []
                        }
                        label="Активні чати"
                    ></LineChart>
                </div>
            </div>
            <div className="rounded-lg border bg-neutral-300 p-2 shadow-sm">
                <Table>
                    <TableBody>
                        {stats.data &&
                            Object.entries(stats.data.numbers).map(
                                ([key, value]) => (
                                    <TableRow
                                        key={key}
                                        className="hover:bg-neutral-100/30"
                                    >
                                        <TableCell>
                                            {l10n.numbers[key]}
                                        </TableCell>
                                        <TableCell>{value}</TableCell>
                                    </TableRow>
                                ),
                            )}
                        {stats.data &&
                            Object.entries(stats.data.diffs).map(
                                ([key, value]) => (
                                    <TableRow
                                        key={key}
                                        className="hover:bg-neutral-100/30"
                                    >
                                        <TableCell>{l10n.diffs[key]}</TableCell>
                                        <TableCell>
                                            {defaultFormatDiff(value)}
                                        </TableCell>
                                    </TableRow>
                                ),
                            )}
                        {!stats.data && (
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
