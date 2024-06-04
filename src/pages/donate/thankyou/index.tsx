import { Sparkle, Sun } from 'lucide-react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import { Button } from '~/components/ui/button';

const Thankyou: React.FC = () => {
    const router = useRouter();
    return (
        <>
            <Head>
                <title>Дякуємо</title>
            </Head>
            <div className="over flex h-svh w-full items-center justify-center bg-thankyou-cover">
                <div className="flex h-2/3 w-2/3 flex-col items-center justify-center gap-8 rounded-2xl bg-neutral-200 p-14 drop-shadow-xl">
                    <h4 className="font-semibold">Дякуємо!</h4>
                    <Sun className="h-14 w-14 fill-amber-500 text-amber-500" />
                    <h1 className="text-center">
                        Ми надзвичайно цінуємо вашу довіру та щедрість. Завдяки
                        вам ми можемо продовжувати надавати безкоштовну
                        психологічну допомогу тим, хто її потребує. Ваша
                        підтримка робить світ кращим :&#41;
                    </h1>
                    <Button
                        className="flex gap-2"
                        onClick={async () => {
                            await router.push('/');
                        }}
                    >
                        <Sparkle className="h-4 fill-amber-500 text-amber-500" />
                        На головну
                        <Sparkle className="h-4 fill-amber-500 text-amber-500" />
                    </Button>
                </div>
            </div>
            <style>
                {`
                    html {
                        overflow-y: auto;
                    }
                `}
            </style>
        </>
    );
};
export default Thankyou;
