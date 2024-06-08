import {
    type InferGetServerSidePropsType,
    type GetServerSidePropsContext,
} from 'next';
import { getCsrfToken, signIn, useSession } from 'next-auth/react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { Logo } from '~/components/common/Logo';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';

export const SignIn = ({
    csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const { data: session } = useSession();

    const router = useRouter();

    useEffect(() => {
        if (session) {
            void router.push('/');
        }
    }, [session]);

    return (
        <>
            <Head>
                <title>Вхід</title>
            </Head>
            <div className="flex h-svh w-full flex-col items-center justify-center gap-4">
                <h2 className="font-semibold uppercase text-neutral-500">
                    Увійдіть в
                </h2>
                <Logo className="text-5xl" />
                <p className="text-neutral-500">
                    Ваша праця робить світ кращим
                </p>
                <div className="flex w-2/3 flex-col items-center justify-center gap-4 rounded-2xl bg-neutral-200 p-14 drop-shadow-xl">
                    <div className="flex w-2/3 justify-center gap-10">
                        <Button
                            onClick={async () => {
                                await signIn('github', { callbackUrl: '/' });
                            }}
                            variant="ghost"
                            className="h-[50px] w-[50px] rounded-full p-0"
                        >
                            <Image
                                src={'/images/github-mark.svg'}
                                className="rounded-full"
                                width={50}
                                height={50}
                                style={{
                                    aspectRatio: '1',
                                    objectFit: 'cover',
                                }}
                                alt="LogIn by github"
                            />
                        </Button>
                        <Button
                            onClick={async () => {
                                await signIn('google', { callbackUrl: '/' });
                            }}
                            variant="ghost"
                            className="h-[50px] w-[50px] rounded-full p-0"
                        >
                            <Image
                                src={'/images/google-logo.svg'}
                                className="rounded-full"
                                width={50}
                                height={50}
                                style={{
                                    aspectRatio: '1',
                                    objectFit: 'cover',
                                }}
                                alt="LogIn by google"
                            />
                        </Button>
                        <Button
                            onClick={async () => {
                                await signIn('facebook', { callbackUrl: '/' });
                            }}
                            variant="ghost"
                            className="h-[50px] w-[50px] rounded-full p-0"
                        >
                            <Image
                                src={'/images/facebook-logo.svg'}
                                className="rounded-full"
                                width={50}
                                height={50}
                                style={{
                                    aspectRatio: '1',
                                    objectFit: 'cover',
                                }}
                                alt="LogIn by facebook"
                            />
                        </Button>
                    </div>
                    <p className="text-neutral-400">або</p>
                    <Tabs defaultValue="email" className="w-2/3">
                        <TabsList className="flex h-14 w-full rounded-b-none p-0">
                            <TabsTrigger
                                className="m-2 grow py-2 data-[state=active]:mb-0 data-[state=active]:rounded-t-md data-[state=active]:py-3 data-[state=active]:shadow-none"
                                value="email"
                            >
                                Електронна пошта
                            </TabsTrigger>
                            <TabsTrigger
                                value="account"
                                className="m-2 grow py-2 data-[state=active]:mb-0 data-[state=active]:rounded-t-md data-[state=active]:py-3 data-[state=active]:shadow-none"
                            >
                                Облікові дані
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent
                            value="account"
                            className="mt-0 rounded-b-md bg-neutral-100 p-2 pt-0"
                        >
                            <form
                                method="post"
                                action="/api/auth/callback/credentials"
                                className="flex h-52 flex-col justify-center gap-4 rounded-b-md rounded-tl-md bg-white p-4"
                            >
                                <Input
                                    name="csrfToken"
                                    type="hidden"
                                    defaultValue={csrfToken}
                                />
                                <Input
                                    name="username"
                                    type="text"
                                    placeholder="Введіть ваш логін..."
                                    className="border border-neutral-400"
                                />
                                <Input
                                    name="password"
                                    type="password"
                                    placeholder="Введіть ваш пароль..."
                                    className="border border-neutral-400"
                                />
                                <Button className="w-full" type="submit">
                                    Увійти
                                </Button>
                            </form>
                        </TabsContent>
                        <TabsContent
                            value="email"
                            className="mt-0 rounded-b-md bg-neutral-100 p-2 pt-0"
                        >
                            <form
                                method="post"
                                action="/api/auth/signin/email"
                                className="flex h-52 flex-col justify-center gap-4 rounded-b-md rounded-tr-md bg-white p-4"
                            >
                                <Input
                                    name="csrfToken"
                                    type="hidden"
                                    defaultValue={csrfToken}
                                />
                                <Input
                                    name="email"
                                    type="email"
                                    placeholder="Введіть вашу пошту..."
                                    className="border border-neutral-400"
                                />
                                <Button className="w-full" type="submit">
                                    Увійти
                                </Button>
                            </form>
                        </TabsContent>
                    </Tabs>
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

export default SignIn;

export async function getServerSideProps(context: GetServerSidePropsContext) {
    return {
        props: {
            csrfToken: await getCsrfToken(context),
        },
    };
}
