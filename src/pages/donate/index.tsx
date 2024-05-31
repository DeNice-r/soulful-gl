import axios from 'axios';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '~/components/ui/button';
import { Layout } from '~/components/common/Layout';
import { PaymentAction, PaymentCurrency } from '~/utils/types';
import { CNBSchema } from '~/utils/schemas';
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
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
} from '~/components/ui/select';
import { SelectValue } from '@radix-ui/react-select';
import { Input } from '~/components/ui/input';

const Donate: React.FC = () => {
    const router = useRouter();

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [isSubscription, setIsSubscription] = useState(false);

    function changeDialogState() {
        setIsDialogOpen(!isDialogOpen);
    }

    const form = useForm<z.infer<typeof CNBSchema>>({
        resolver: zodResolver(CNBSchema),
        defaultValues: {
            action: PaymentAction.PAYDONATE,
            amount: 100,
            currency: PaymentCurrency.UAH,
        },
    });

    function handleSubscription() {
        if (form.getValues('action') === PaymentAction.SUBSCRIBE) {
            setIsSubscription(true);
        } else {
            setIsSubscription(false);
        }
    }

    async function onSubmit() {
        const [
            description,
            public_key,
            version,
            amount,
            currency,
            language,
            action,
            subscribe_periodicity,
            subscribe_date_start,
        ] = form.getValues([
            'description',
            'public_key',
            'version',
            'amount',
            'currency',
            'language',
            'action',
            'subscribe_periodicity',
            'subscribe_date_start',
        ]);
        const res = await axios.get(
            `/api/payment/generate?amount${amount ?? 20}&csurrency=${currency ?? PaymentCurrency.UAH}&action=${action ?? PaymentAction.PAYDONATE}`,
        );

        if (res.status === 200 && typeof res.data === 'string') {
            await router.push(res.data);
        }
    }

    return (
        <Layout className="items-center bg-homepage-cover">
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
                    Донатити зараз
                </Button>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="flex flex-col">
                    <DialogHeader className="self-start">
                        <DialogTitle>Оберіть форму платежу</DialogTitle>
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
                                    <FormItem className="flex flex-col items-center gap-2 space-y-0">
                                        <div className="flex w-2/3 items-center justify-end gap-4">
                                            <Select
                                                onValueChange={(
                                                    e: PaymentAction,
                                                ) => {
                                                    form.setValue(
                                                        field.name,
                                                        e,
                                                    );
                                                    handleSubscription();
                                                }}
                                                defaultValue={form.getValues(
                                                    `${field.name}`,
                                                )}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Оберіть форму платежу" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectItem
                                                            value={
                                                                PaymentAction.PAYDONATE
                                                            }
                                                        >
                                                            Разова підтримка
                                                        </SelectItem>
                                                        <SelectItem
                                                            value={
                                                                PaymentAction.SUBSCRIBE
                                                            }
                                                        >
                                                            Підписка
                                                        </SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                            <FormControl>
                                                <Input
                                                    className="hidden"
                                                    {...field}
                                                />
                                            </FormControl>
                                        </div>
                                        <FormMessage className="w-2/3 self-end text-center" />
                                    </FormItem>
                                )}
                            />
                            {!isSubscription ? (
                                <>
                                    <FormField
                                        control={form.control}
                                        name="amount"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col items-center gap-2 space-y-0">
                                                <div className="flex w-5/6 items-center justify-end gap-4">
                                                    <FormLabel className="basis-1/3">
                                                        Сума внеску:
                                                    </FormLabel>
                                                    <FormControl className="flex-grow">
                                                        <Input
                                                            type="number"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="currency"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col items-center gap-2 space-y-0">
                                                <div className="flex w-5/6 items-center justify-end gap-4">
                                                    <Select
                                                        onValueChange={(
                                                            e: PaymentCurrency,
                                                        ) => {
                                                            form.setValue(
                                                                field.name,
                                                                e,
                                                            );
                                                        }}
                                                        defaultValue={form.getValues(
                                                            `${field.name}`,
                                                        )}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectGroup>
                                                                <SelectItem
                                                                    value={
                                                                        PaymentCurrency.UAH
                                                                    }
                                                                >
                                                                    ₴
                                                                </SelectItem>
                                                                <SelectItem
                                                                    value={
                                                                        PaymentCurrency.EUR
                                                                    }
                                                                >
                                                                    $
                                                                </SelectItem>
                                                                <SelectItem
                                                                    value={
                                                                        PaymentCurrency.USD
                                                                    }
                                                                >
                                                                    €
                                                                </SelectItem>
                                                            </SelectGroup>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormControl>
                                                        <Input
                                                            className="hidden"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </>
                            ) : (
                                <p>Subscription</p>
                            )}

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
