import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '~/components/ui/select';
import { AmountPerPageOptions } from '~/utils/types';
import React from 'react';
import { useRouter } from 'next/router';

export const AmountSelect = () => {
    const router = useRouter();

    function setAmountPerPage(option: string) {
        void router.push({
            pathname: router.pathname,
            query: { ...router.query, limit: option, page: 1 },
        });
    }

    return (
        <label className="flex items-center">
            <span className="mr-2">#</span>
            <Select
                onValueChange={setAmountPerPage}
                defaultValue={AmountPerPageOptions[0].toString()}
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="#" />
                </SelectTrigger>
                <SelectContent>
                    {AmountPerPageOptions.map((AmountPerPageOption) => (
                        <SelectItem
                            key={AmountPerPageOption}
                            value={AmountPerPageOption.toString()}
                        >
                            {AmountPerPageOption}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </label>
    );
};
