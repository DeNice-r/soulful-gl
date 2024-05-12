import React, { type RefObject, type ChangeEvent, useState } from 'react';
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
import { RecommendationSchema } from '~/utils/schemas';
import { api, type RouterOutputs } from '~/utils/api';

export const XForm: React.FC<{
    entity?: RouterOutputs['recommendation']['get'];
    changeModalState: () => void;
    formRef: RefObject<HTMLFormElement>;
}> = ({ entity, changeModalState, formRef }) => {
    const create = api.recommendation.create.useMutation();
    const update = api.recommendation.update.useMutation();

    const form = useForm<z.infer<typeof RecommendationSchema>>({
        resolver: zodResolver(RecommendationSchema),
        defaultValues: {
            title: entity?.title ?? '',
            description: entity?.description ?? '',
        },
    });
    async function onSubmit(values: z.infer<typeof RecommendationSchema>) {
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
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem className="basis-full">
                                            <FormLabel className="text-xl">
                                                Заголовок
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    className="flex-grow outline outline-1 outline-neutral-400"
                                                    placeholder="Антон"
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
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem className="basis-full">
                                            <FormLabel className="text-xl">
                                                Наповнення
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    className="flex-grow outline outline-1 outline-neutral-400"
                                                    placeholder="Антон"
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
