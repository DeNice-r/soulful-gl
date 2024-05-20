import React, { type RefObject } from 'react';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '~/components/ui/form';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import type * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AdminQandASchema } from '~/utils/schemas';
import { api, type RouterOutputs } from '~/utils/api';

export const XForm: React.FC<{
    entity?: RouterOutputs['qanda']['get'];
    changeModalState: () => void;
    formRef: RefObject<HTMLFormElement>;
}> = ({ entity, changeModalState, formRef }) => {
    const create = api.qanda.adminCreate.useMutation();
    const update = api.qanda.update.useMutation();

    const form = useForm<z.infer<typeof AdminQandASchema>>({
        resolver: zodResolver(AdminQandASchema),
        defaultValues: {
            question: entity?.question ?? '',
            answer: entity?.answer ?? '',
        },
    });
    async function onSubmit(values: z.infer<typeof AdminQandASchema>) {
        if (entity) {
            await update.mutateAsync({ id: entity.id, ...values });
        } else {
            await create.mutateAsync(values);
        }
        changeModalState();
    }

    return (
        <Form {...form}>
            <form
                ref={formRef}
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex h-[90%] w-3/4 items-center justify-center rounded-lg bg-gray-300 outline outline-neutral-400"
            >
                <div className="flex h-[90%] w-4/5 flex-col items-center justify-between gap-4">
                    <div className="flex h-2/3 w-full gap-12">
                        <div className="flex flex-1 flex-col gap-4">
                            <div className="flex w-full justify-between gap-4">
                                <FormField
                                    control={form.control}
                                    name="question"
                                    render={({ field }) => (
                                        <FormItem className="basis-full">
                                            <FormLabel className="text-xl">
                                                Питання. Уникайте зміни питання
                                                якщо це можливо.
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    className="flex-grow outline outline-1 outline-neutral-400"
                                                    placeholder="Скільки коштує використання платформи?"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="flex w-full justify-between gap-4">
                                <FormField
                                    control={form.control}
                                    name="answer"
                                    render={({ field }) => (
                                        <FormItem className="basis-full">
                                            <FormLabel className="text-xl">
                                                Відповідь
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    className="flex-grow outline outline-1 outline-neutral-400"
                                                    placeholder="Використання платформи безкоштовне! Наші оператори працюють на волонтерських засадах."
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-8 self-end">
                        <Button className=" px-7 py-6" type="submit">
                            {entity ? 'Редагувати' : 'Створити'}
                        </Button>
                        <Button
                            className="px-7 py-6"
                            variant="destructive"
                            onClick={changeModalState}
                        >
                            Відмінити
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    );
};
