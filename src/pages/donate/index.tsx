import axios from 'axios';
import React from 'react';
import { useRouter } from 'next/router';
import { Button } from '~/components/ui/button';
import { Layout } from '~/components/common/Layout';

const Donate: React.FC = () => {
    const router = useRouter();

    async function submit() {
        const [amount, currency, action] = [20, 'UAH', undefined];
        const res = await axios.get(
            `/api/payment/generate?amount${amount ?? 20}&csurrency=${currency ?? 'UAH'}&action=${action ?? 'paydonate'}`,
        );

        if (res.status === 200 && typeof res.data === 'string') {
            await router.push(res.data);
        }
    }

    return (
        <Layout>
            <Button className="m-48" onClick={submit}>
                Дать 20 гривень
            </Button>
        </Layout>
    );
};

export default Donate;
