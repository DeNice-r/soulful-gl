import React, { type RefObject } from 'react';
import {
    Form,
    FormControl,
    FormDescription,
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
import { CreateUserSchema } from '~/utils/schemas';

const UsersForm: React.FC<{
    id?: string;
    changeModalState: () => void;
    formRef: RefObject<HTMLFormElement>;
}> = ({ id, changeModalState, formRef }) => {
    const form = useForm<z.infer<typeof CreateUserSchema>>({
        resolver: zodResolver(CreateUserSchema),
        defaultValues: {
            name: '',
            description: '',
            email: '',
            image: '',
            notes: '',
        },
    });
    function onSubmit(values: z.infer<typeof CreateUserSchema>) {
        console.log(values);
    }
    return (
        <Form {...form}>
            <form
                ref={formRef}
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex h-3/4 w-3/4 flex-col items-center justify-center gap-4 rounded-lg bg-gray-300"
            >
                <div className="flex h-3/4 w-4/5 flex-col justify-between gap-4">
                    <div className="flex flex-col gap-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xl">
                                        Електронна пошта
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            className="max-w-96"
                                            placeholder="anton@gmail.com"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xl">
                                        Ім&apos;я користувача
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            className="max-w-96"
                                            placeholder="Антон"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xl">
                                        Опис
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            className="max-w-96"
                                            placeholder="Введіть текст..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Опис нового користувача (видимий для
                                        користувача)
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xl">
                                        Нотатки про користувача
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            className="max-w-96"
                                            placeholder="Введіть текст..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/*todo: userRole
                            <FormField
                                control={form.control}
                                name="role"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="anton@gmail.com"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        This is your public display name.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        /> */}
                    </div>
                    <div className="flex gap-8 self-end">
                        <Button className=" px-7 py-6" type="submit">
                            Створити
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

export default UsersForm;
