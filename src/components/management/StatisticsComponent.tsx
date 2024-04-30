import type React from 'react';
import { api } from '~/utils/api';
import { Table, TableBody, TableRow } from '~/components/ui/table';
import { TableCell } from '@mui/material';
import { Spinner } from '~/components/ui/spinner';
import { defaultFormatDiff } from '~/utils/dates';

const l10n: Record<string, Record<string, string>> = {
    numbers: {
        ongoingCount: 'Активні чати',
        ongoingMsgCount: 'Повідомлення в активних чатах',
        recentCount: 'Чати за останні 24 години',
        recentMsgCount: 'Повідомлення за останні 24 години',
    },
    diffs: {
        avgDuration: 'Середня тривалість активних чатів',
        recentAvgDuration: 'Середня тривалість чатів за останні 24 години',
    },
};

export const StatisticsComponent: React.FC = () => {
    const stats = api.stats.list.useQuery();

    return (
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
                                    <TableCell>{l10n.numbers[key]}</TableCell>
                                    <TableCell>{value}</TableCell>
                                </TableRow>
                            ),
                        )}
                    {stats.data &&
                        Object.entries(stats.data.diffs).map(([key, value]) => (
                            <TableRow
                                key={key}
                                className="hover:bg-neutral-100/30"
                            >
                                <TableCell>{l10n.diffs[key]}</TableCell>
                                <TableCell>
                                    {defaultFormatDiff(value)}
                                </TableCell>
                            </TableRow>
                        ))}
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
    );
};
