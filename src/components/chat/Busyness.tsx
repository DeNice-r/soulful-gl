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
        <div className="flex h-10 justify-between px-4">
            {Object.keys(BusynessEmoji).map((emoji, index) => (
                <button
                    key={index}
                    className="rounded-full border-transparent p-2 disabled:border-gray-500 disabled:bg-neutral-200"
                    disabled={busyness === index}
                    onClick={() => setBusynessHandler(index)}
                >
                    {emoji}
                </button>
            ))}
        </div>
    );
};
