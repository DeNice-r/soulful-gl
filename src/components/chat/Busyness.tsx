import * as React from 'react';
import { useSession } from 'next-auth/react';
import { BusynessEmoji } from '~/utils/types';
import { api } from '~/utils/api';

export const Busyness = () => {
    const { data: session, status } = useSession();
    const { client: apiClient } = api.useUtils();
    const [busyness, setBusyness] = React.useState<number>(-1);

    React.useEffect(() => {
        if (status !== 'authenticated') return;
        setBusyness(session.user.busyness);
    }, [status]);

    function setBusynessHandler(index: number) {
        setBusyness(index);
        void apiClient.chat.setBusyness.mutate(index);
    }

    return (
        <div className="flex justify-between">
            {Object.keys(BusynessEmoji).map((emoji, index) => (
                <button
                    key={index}
                    className="rounded-full border-transparent p-2 focus:border-blue-300  focus:outline-none disabled:border-2 disabled:border-gray-500 disabled:bg-gray-300"
                    disabled={busyness === index}
                    onClick={() => setBusynessHandler(index)}
                >
                    {emoji}
                </button>
            ))}
        </div>
    );
};