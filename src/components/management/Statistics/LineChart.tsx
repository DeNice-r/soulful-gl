import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Interval } from '~/utils/types';
import { format } from 'date-fns';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
);

interface DataPoint {
    a: Date;
    b: string | number;
}

interface Props {
    data: DataPoint[];
    label: string;
    title?: string;
    interval?: Interval;
}

const DtFormat = {
    [Interval.MINUTE]: 'HH:mm:ss',
    [Interval.HOUR]: 'dd, HH:mm',
    [Interval.DAY]: 'dd.MM, HH:mm',
    [Interval.MONTH]: 'dd.MM',
    [Interval.YEAR]: 'MM.yyyy',
};

const LineChart: React.FC<Props> = ({
    data,
    label,
    title,
    interval = Interval.DAY,
}) => {
    const options = {
        responsive: true,
        plugins: {
            title: {
                display: !!title,
                text: title,
            },
        },
    };

    const chartData = {
        labels: data.map(
            (d, index) =>
                (index < data.length - 1 ? '' : '🔴 ') +
                format(d.a, DtFormat[interval]),
        ),
        datasets: [
            {
                label,
                data: data.map((d) => Number(d.b)),
                // borderColor: 'rgb(75, 192, 192)',
                // backgroundColor: 'rgba(75, 192, 192, 0.5)',
                tension: 0.3,
            },
        ],
    };

    return <Line options={options} data={chartData} />;
};

export default LineChart;
