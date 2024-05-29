import React, { useState } from 'react';
import { api } from '~/utils/api';
import { Table, TableBody, TableRow } from '~/components/ui/table';
import { TableCell } from '@mui/material';
import { Spinner } from '~/components/ui/spinner';
import { defaultFormatDiff } from '~/utils/dates';
import LineChart from '~/components/management/Statistics/LineChart';
import { NO_REFETCH } from '~/utils/constants';
import { Interval, IntervalMs } from '~/utils/types';
import { Button } from '~/components/ui/button';

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

const presets = [
    { intervalName: Interval.MINUTE, intervalNumber: 30 },
    { intervalName: Interval.HOUR, intervalNumber: 24 },
    { intervalName: Interval.DAY, intervalNumber: 7 },
    { intervalName: Interval.DAY, intervalNumber: 30 },
    { intervalName: Interval.MONTH, intervalNumber: 12 },
    { intervalName: Interval.YEAR, intervalNumber: 5 },
] as const;

const presetL10n = [
    'Похвилинно',
    'Погодинно',
    'Поденно (тиждень)',
    'Поденно (місяць)',
    'Помісячно',
    'Порічно',
];

export const Statistics: React.FC = () => {
    const [presetNum, setPresetNum] = useState<number>(0);
    const stats = api.stats.list.useQuery(presets[presetNum], {
        ...NO_REFETCH,
        refetchInterval: IntervalMs[Interval.MINUTE],
    });

    return (
        <>
            {/* todo: interval name and number select*/}
            <div>
                {presets.map((_, index) => (
                    <Button
                        className="me-1"
                        key={index}
                        variant={index !== presetNum ? 'ghost' : 'default'}
                        onClick={() => setPresetNum(index)}
                    >
                        {presetL10n[index]}
                    </Button>
                ))}
            </div>
            <div className="flex flex-row flex-wrap md:flex-nowrap">
                <div className="flex-1 p-2">
                    <LineChart
                        data={
                            Array.isArray(stats.data?.graphs.messageCount)
                                ? stats.data?.graphs.messageCount
                                : []
                        }
                        label="Повідомлення"
                        interval={presets[presetNum].intervalName}
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
                        interval={presets[presetNum].intervalName}
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
