import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '~/components/ui/button';
import { Layout } from '~/components/common/Layout';
import {
    LiqpayPeriodicity,
    PaymentAction,
    PaymentCurrency,
} from '~/utils/types';
import { UserCNBSchema } from '~/utils/schemas';
import { useForm } from 'react-hook-form';
import type * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '~/components/ui/dialog';
import {
    Form,
    FormControl,
    FormLabel,
    FormField,
    FormItem,
    FormMessage,
} from '~/components/ui/form';

import { Input } from '~/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '~/components/ui/toggle-group';
import axios from 'axios';
import Head from 'next/head';

const Donate: React.FC = () => {
    const router = useRouter();

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [isSubscription, setIsSubscription] = useState(false);

    function changeDialogState() {
        setIsDialogOpen(!isDialogOpen);
    }

    const form = useForm<z.infer<typeof UserCNBSchema>>({
        resolver: zodResolver(UserCNBSchema),
        defaultValues: {
            action: PaymentAction.PAYDONATE,
            amount: 100,
            currency: PaymentCurrency.UAH,
            subscribe_periodicity: LiqpayPeriodicity.MONTH,
        },
    });

    function handleSubscription() {
        if (form.getValues('action') === PaymentAction.SUBSCRIBE) {
            setIsSubscription(true);
        } else {
            setIsSubscription(false);
        }
    }

    async function onSubmit(values: z.infer<typeof UserCNBSchema>) {
        const params = new URLSearchParams({
            ...values,
            amount: values.amount.toString(),
        });

        const res = await axios.get(`/api/payment/generate`, {
            params,
        });

        if (res.status === 200 && typeof res.data === 'string') {
            await router.push(res.data);
        }
    }

    return (
        <Layout className="items-center bg-homepage-cover py-14">
            <Head>
                <title>Пітримати</title>
            </Head>
            <div className="flex w-2/3 flex-col gap-3 rounded-xl border border-neutral-300 bg-neutral-200/80 p-10 text-justify drop-shadow-xl">
                <h2 className="text-center font-semibold">
                    Підтримайте Soulful – Ваш внесок у ментально здорове
                    оточення
                </h2>
                <p>
                    Soulful – це цілковито безкоштовний проєкт з психологічної
                    підтримки, де волонтери з різних куточків світу
                    об&apos;єдналися, щоб допомагати людям покращувати своє
                    ментальне здоров&apos;я. Ми надаємо підтримку тим, хто
                    потребує, безкоштовно, адже віримо, що психологічна допомога
                    має бути доступною для кожного.
                </p>
                <p>
                    Ми продовжуємо працювати завдяки щедрості наших
                    користувачів. Кожен внесок, незалежно від його розміру,
                    допомагає нам покращувати та розширювати наші послуги,
                    залучати більше фахівців, організовувати нові проєкти та
                    проводити безкоштовні консультації.
                </p>
                <p>Ваші донати допоможуть нам:</p>
                <ul>
                    <li>
                        Підтримувати нашу платформу та забезпечувати її
                        безперебійну роботу.
                    </li>
                    <li>
                        Залучати більше волонтерів та фахівців для надання
                        якісної психологічної допомоги.
                    </li>
                    <li>
                        Організовувати навчальні програми та тренінги для
                        волонтерів.
                    </li>
                    <li>
                        Створювати нові ресурси та матеріали для підтримки
                        ментального здоров&apos;я.
                    </li>
                </ul>
                <p>
                    Будемо раді вашій підтримці! Кожна ваша гривня допомагає нам
                    робити світ кращим місцем, де кожен може знайти підтримку та
                    розуміння.
                </p>
                <Button
                    className="mt-3 self-center"
                    onClick={changeDialogState}
                >
                    Підтримати зараз
                </Button>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="flex flex-col">
                    <DialogHeader className="self-start">
                        <DialogTitle className="text-xl">
                            Введіть дані для оплати
                        </DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="flex flex-col gap-4 py-4"
                        >
                            <FormField
                                control={form.control}
                                name="action"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col items-center space-y-2">
                                        <div className="flex w-full items-center">
                                            <FormControl>
                                                <ToggleGroup
                                                    type="single"
                                                    className="flex-grow gap-0 rounded-lg"
                                                    onValueChange={(
                                                        e: PaymentAction,
                                                    ) => {
                                                        if (e) {
                                                            field.onChange(e);
                                                            handleSubscription();
                                                        }
                                                    }}
                                                    {...field}
                                                >
                                                    <ToggleGroupItem
                                                        value={
                                                            PaymentAction.PAYDONATE
                                                        }
                                                        className="flex-grow rounded-none rounded-s-lg border border-e-0 data-[state=on]:border-e data-[state=on]:border-black"
                                                        aria-label="PAYDONATE"
                                                    >
                                                        Разовий платіж
                                                    </ToggleGroupItem>
                                                    <ToggleGroupItem
                                                        value={
                                                            PaymentAction.SUBSCRIBE
                                                        }
                                                        className="flex-grow rounded-none rounded-e-lg border border-s-0 data-[state=on]:border-s data-[state=on]:border-black"
                                                        aria-label="SUBSCRIBE"
                                                    >
                                                        Підписка
                                                    </ToggleGroupItem>
                                                </ToggleGroup>
                                            </FormControl>
                                        </div>
                                        <FormMessage className="text-center" />
                                    </FormItem>
                                )}
                            />

                            {isSubscription && (
                                <FormField
                                    control={form.control}
                                    name="subscribe_periodicity"
                                    render={({ field }) => (
                                        <FormItem className="space-y-2">
                                            <FormLabel className="text-lg">
                                                Регулярність платежу:
                                            </FormLabel>
                                            <FormControl>
                                                <ToggleGroup
                                                    type="single"
                                                    className="flex-grow gap-0 rounded-lg"
                                                    onValueChange={(
                                                        e: LiqpayPeriodicity,
                                                    ) => {
                                                        if (e) {
                                                            field.onChange(e);
                                                        }
                                                    }}
                                                    {...field}
                                                >
                                                    <ToggleGroupItem
                                                        value={
                                                            LiqpayPeriodicity.DAY
                                                        }
                                                        className="flex-grow rounded-none rounded-s-lg border border-e-0 data-[state=on]:border-e data-[state=on]:border-black"
                                                        aria-label="DAY"
                                                    >
                                                        Щодня
                                                    </ToggleGroupItem>
                                                    <ToggleGroupItem
                                                        value={
                                                            LiqpayPeriodicity.MONTH
                                                        }
                                                        className="flex-grow rounded-none border data-[state=on]:border-black"
                                                        aria-label="MONTH"
                                                    >
                                                        Щомісяця
                                                    </ToggleGroupItem>
                                                    <ToggleGroupItem
                                                        value={
                                                            LiqpayPeriodicity.YEAR
                                                        }
                                                        className="flex-grow rounded-none rounded-e-lg border border-s-0 data-[state=on]:border-s data-[state=on]:border-black"
                                                        aria-label="YEAR"
                                                    >
                                                        Щороку
                                                    </ToggleGroupItem>
                                                </ToggleGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                            <FormField
                                control={form.control}
                                name="currency"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <FormLabel className="text-lg">
                                            Валюта:
                                        </FormLabel>
                                        <FormControl className="w-full">
                                            <ToggleGroup
                                                type="single"
                                                className="flex-grow gap-0 rounded-lg"
                                                onValueChange={(
                                                    e: PaymentCurrency,
                                                ) => {
                                                    if (e) {
                                                        field.onChange(e);
                                                    }
                                                }}
                                                {...field}
                                            >
                                                <ToggleGroupItem
                                                    value={PaymentCurrency.UAH}
                                                    className="flex-grow rounded-none rounded-s-lg border border-e-0 data-[state=on]:border-e data-[state=on]:border-black"
                                                    aria-label="UAH"
                                                >
                                                    ₴
                                                </ToggleGroupItem>
                                                <ToggleGroupItem
                                                    value={PaymentCurrency.USD}
                                                    className="flex-grow rounded-none border data-[state=on]:border-black"
                                                    aria-label="USD"
                                                >
                                                    $
                                                </ToggleGroupItem>
                                                <ToggleGroupItem
                                                    value={PaymentCurrency.EUR}
                                                    className="flex-grow rounded-none rounded-e-lg border border-s-0 data-[state=on]:border-s data-[state=on]:border-black"
                                                    aria-label="EUR"
                                                >
                                                    €
                                                </ToggleGroupItem>
                                            </ToggleGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="amount"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <FormLabel className="text-lg">
                                            Сума внеску:
                                        </FormLabel>
                                        <FormControl className="flex-grow">
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DialogFooter className="self-end">
                                <Button type="submit">Оплатити</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </Layout>
    );
};

export default Donate;
