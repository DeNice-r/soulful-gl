import React, { useState } from 'react';
import { api } from '~/utils/api';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '~/components/ui/table';
import { Spinner } from '~/components/ui/spinner';
import { defaultFormatDiff } from '~/utils/dates';
import LineChart from '~/components/management/Statistics/LineChart';
import { NO_REFETCH } from '~/utils/constants';
import { BusynessEmoji, Interval, IntervalMs } from '~/utils/types';
import { Button } from '~/components/ui/button';

const l10n = {
    numbers: {
        messengerUserCount: 'Користувачі з месенджерів',
        userCount: 'Користувачі платформи',
        operatorCount: 'З них оператори',
    },
    diffs: {
        avgDuration: 'Середня тривалість активних чатів',
    },
    tables: {
        personnelStats: {
            personnelId: 'Ідентифікатор',
            name: 'Ім’я',
            totalChats: 'Всього чатів',
            totalMessages: 'Всього повідомлень',
            averageResponseTimeSeconds: 'Середній час відповіді',
            perceivedBusyness: 'Власна оцінка зайнятості',
            normalizedScore: 'Рейтинг зайнятості',
        },
    },
} as const;

// personnelid	"clulqsftr00018gongwlr11ao"
// name	"Denys Kalinovskyi"
// totalchats	"13"
// normalizedchats	1
// totalmessages	"140"
// normalizedmessages	1
// averageresponsetimeseconds	"1253054.701"
// normalizedresponsetime	"1"
// perceivedbusyness	4
// normalizedbusyness	1
// normalizedscore	4

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

    function numberToEmoji(num: number) {
        return Object.keys(BusynessEmoji)[num];
    }
    function normalizedNumberToEmoji(num: number) {
        return numberToEmoji(Math.round(num * 4));
    }

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
            {/*<div className="rounded-lg border bg-neutral-300 p-2 shadow-sm">*/}
            {/*    <Table>*/}
            {/*        <TableBody>*/}
            {/*            {stats.data &&*/}
            {/*                Object.entries(stats.data.numbers).map(*/}
            {/*                    ([key, value]) => (*/}
            {/*                        <TableRow*/}
            {/*                            key={key}*/}
            {/*                            className="hover:bg-neutral-100/30"*/}
            {/*                        >*/}
            {/*                            <TableCell>*/}
            {/*                                {*/}
            {/*                                    l10n.numbers[*/}
            {/*                                        key as keyof typeof l10n.numbers*/}
            {/*                                    ]*/}
            {/*                                }*/}
            {/*                            </TableCell>*/}
            {/*                            <TableCell>{value}</TableCell>*/}
            {/*                        </TableRow>*/}
            {/*                    ),*/}
            {/*                )}*/}
            {/*            {stats.data &&*/}
            {/*                Object.entries(stats.data.diffs).map(*/}
            {/*                    ([key, value]) => (*/}
            {/*                        <TableRow*/}
            {/*                            key={key}*/}
            {/*                            className="hover:bg-neutral-100/30"*/}
            {/*                        >*/}
            {/*                            <TableCell>*/}
            {/*                                {*/}
            {/*                                    l10n.diffs[*/}
            {/*                                        key as keyof typeof l10n.diffs*/}
            {/*                                    ]*/}
            {/*                                }*/}
            {/*                            </TableCell>*/}
            {/*                            <TableCell>*/}
            {/*                                {defaultFormatDiff(value)}*/}
            {/*                            </TableCell>*/}
            {/*                        </TableRow>*/}
            {/*                    ),*/}
            {/*                )}*/}
            {/*            {!stats.data && (*/}
            {/*                <TableRow>*/}
            {/*                    <TableCell colSpan={100}>*/}
            {/*                        <Spinner size="large" />*/}
            {/*                    </TableCell>*/}
            {/*                </TableRow>*/}
            {/*            )}*/}
            {/*        </TableBody>*/}
            {/*    </Table>*/}
            {/*</div>*/}
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-neutral-300">
                        {Object.keys(l10n.tables.personnelStats).map((key) => {
                            return (
                                <TableHead className="min-w-[150px]" key={key}>
                                    <div className="flex items-center justify-between">
                                        {
                                            l10n.tables.personnelStats[
                                                key as keyof typeof l10n.tables.personnelStats
                                            ]
                                        }
                                    </div>
                                </TableHead>
                            );
                        })}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {stats.data &&
                        stats.data.tables.personnelStats.map((entity) => (
                            <TableRow
                                key={entity.personnelid}
                                className="hover:bg-neutral-100/30"
                            >
                                <TableCell>{entity.personnelid}</TableCell>
                                <TableCell>{entity.name}</TableCell>
                                <TableCell>{`${normalizedNumberToEmoji(entity.normalizedchats)} (${entity.totalchats})`}</TableCell>
                                <TableCell>{`${normalizedNumberToEmoji(entity.normalizedmessages)} (${entity.totalmessages})`}</TableCell>
                                <TableCell>
                                    {`${normalizedNumberToEmoji(Number(entity.normalizedresponsetime))} (${defaultFormatDiff(
                                        Number(
                                            entity.averageresponsetimeseconds,
                                        ),
                                    )})`}
                                </TableCell>
                                <TableCell>
                                    {numberToEmoji(entity.perceivedbusyness)}
                                </TableCell>
                                <TableCell>
                                    {`${numberToEmoji(
                                        Math.round(entity.normalizedscore),
                                    )} (${entity.normalizedscore.toFixed(3)})`}
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
        </>
    );
};
