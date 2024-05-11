import React from 'react';

export const Icon: React.FC<{
    width?: string;
    height?: string;
    viewBox?: string;
    className?: string;
    fill?: string;
    stroke?: string;
    d: string;
}> = ({
    width = '24',
    height = '24',
    viewBox = '0 0 24',
    className,
    stroke = 'currentColor',
    fill = 'none',
    d,
}) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill={fill}
            viewBox={viewBox}
            strokeWidth="2"
            width={width}
            height={height}
            className={className}
            stroke={stroke}
        >
            <path strokeLinecap="round" strokeLinejoin="round" d={d} />
        </svg>
    );
};
