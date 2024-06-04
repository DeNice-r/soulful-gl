import React, { type ChangeEvent, useEffect, useState } from 'react';
import { Layout } from '~/components/common/Layout';
import { Button } from '~/components/ui/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '~/components/ui/form';
import { useForm } from 'react-hook-form';
import type * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '~/components/ui/input';
import { api } from '~/utils/api';
import { ChangePasswordSchema, CreateUserSchema } from '~/utils/schemas';
import getCroppedImg from '~/components/utils/cropImage';
import Cropper, { type Area, type Point } from 'react-easy-crop';
import { uploadImage } from '~/utils/s3/frontend';
import Modal from 'react-modal';
import { useSession } from 'next-auth/react';
import { Editor } from '~/components/management/common/Editor';
import { Upload, X } from 'lucide-react';
import { Spinner } from '~/components/ui/spinner';
import { toast } from '~/components/ui/use-toast';
import { NO_REFETCH } from '~/utils/constants';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '~/components/ui/dialog';
import Head from 'next/head';

const Profile: React.FC = () => {
    const update = api.user.selfUpdate.useMutation();
    const changePassword = api.user.changePassword.useMutation();

    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(
        null,
    );

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    function changeDialogState() {
        setIsDialogOpen(!isDialogOpen);
    }

    const { data: session } = useSession();

    const entity = api.user.get.useQuery(undefined, {
        ...NO_REFETCH,
    });

    // const user = api.user.get.useQuery(entity.id);

    const mainForm = useForm<z.infer<typeof CreateUserSchema>>({
        resolver: zodResolver(CreateUserSchema),
        defaultValues: {
            name: '',
            description: '',
            email: '',
            image: '',
        },
    });

    const passwordForm = useForm<z.infer<typeof ChangePasswordSchema>>({
        resolver: zodResolver(ChangePasswordSchema),
        defaultValues: {
            oldPassword: '',
            newPassword: '',
            newPasswordRepeat: '',
        },
    });

    function handleFormReset() {
        if (entity.data) {
            mainForm.setValue('name', entity.data.name ?? '');
            mainForm.setValue('image', entity.data.image ?? '');
            mainForm.setValue('email', entity.data.email ?? '');
            mainForm.setValue('description', entity.data.description ?? '');
        }
    }

    useEffect(() => {
        if (entity.data) {
            handleFormReset();
        }
    }, [entity.data]);

    async function onSubmit(values: z.infer<typeof CreateUserSchema>) {
        if (!entity.data?.id) {
            return;
        }
        await update.mutateAsync(values);
        await entity.refetch();
        toast({
            title: 'Успішно відредаговано',
            duration: 2000,
        });
    }

    async function onPasswordSubmit(
        values: z.infer<typeof ChangePasswordSchema>,
    ) {
        await changePassword.mutateAsync(values);
        await entity.refetch();
        toast({
            title: 'Пароль успішно змінено',
            duration: 2000,
        });
    }

    function createSetValue(field: keyof z.infer<typeof CreateUserSchema>) {
        return async function setDescription(value: string) {
            mainForm.setValue(field, value);
        };
    }

    const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };
    const uploadCroppedImage = async () => {
        if (!imageSrc || !croppedAreaPixels) {
            return;
        }
        try {
            const croppedImage = await getCroppedImg(
                imageSrc,
                croppedAreaPixels,
            );
            const imageUrl = await uploadImage(croppedImage);
            if (imageUrl) {
                mainForm.setValue('image', imageUrl);
            }
            setImageSrc(null);
        } catch (e) {
            console.error(e);
        }
    };

    const onClose = () => {
        setImageSrc(null);
    };

    const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const imageDataUrl = await readFile(file);
            e.target.value = '';
            setImageSrc(imageDataUrl?.toString() ?? '');
        }
    };

    function handlePasswordChange() {
        changeDialogState();
        toast({
            title: 'Пароль успішно змінено',
            duration: 2000,
        });
    }

    return (
        <Layout className="w-full">
            <Head>
                <title>Профіль</title>
            </Head>
            {session ? (
                <>
                    <Form {...mainForm}>
                        <form
                            onSubmit={mainForm.handleSubmit(onSubmit)}
                            className="flex w-2/3 flex-col items-start justify-between gap-6 py-16"
                        >
                            <FormField
                                control={mainForm.control}
                                name="image"
                                render={({ field }) => (
                                    <FormItem className="flex w-full flex-col items-center gap-1">
                                        <label
                                            className="cursor-pointer"
                                            htmlFor="image-upload"
                                        >
                                            <div
                                                style={{
                                                    '--image-url': `url(${field.value ? field.value : entity.data?.image})`,
                                                }}
                                                className={`flex h-24 w-24 items-center justify-center rounded-full border-2 border-gray-400 bg-white bg-[image:var(--image-url)] bg-cover transition-all hover:opacity-80 dark:bg-gray-700`}
                                            >
                                                {!entity.data?.image && (
                                                    <Upload className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                                                )}
                                            </div>
                                            <Input
                                                accept="image/*"
                                                id="image-upload"
                                                className="sr-only w-0"
                                                type="file"
                                                onInput={onFileChange}
                                            />
                                        </label>
                                        <Modal
                                            isOpen={!!imageSrc}
                                            overlayClassName="z-20 fixed inset-0 bg-white/75"
                                            className="flex h-full w-full items-center justify-center"
                                        >
                                            <div className="flex h-4/5 w-2/5 flex-col items-center gap-10 rounded-lg bg-gray-300 outline outline-1 outline-neutral-400">
                                                <div className="flex h-10 w-full items-center justify-between rounded-t-lg border-b-2 border-gray-500 bg-gray-400">
                                                    <span className="px-5">
                                                        Обріжте новий аватар
                                                    </span>
                                                    <button
                                                        onClick={onClose}
                                                        className="flex items-center justify-center px-5  dark:text-gray-400"
                                                    >
                                                        <X />
                                                    </button>
                                                </div>
                                                <div className="flex h-4/5 w-4/5 flex-col justify-between">
                                                    <div className="relative h-96 w-full">
                                                        <Cropper
                                                            image={
                                                                imageSrc ?? ''
                                                            }
                                                            crop={crop}
                                                            zoom={zoom}
                                                            aspect={1 / 1}
                                                            cropShape="round"
                                                            onCropChange={
                                                                setCrop
                                                            }
                                                            onCropComplete={
                                                                onCropComplete
                                                            }
                                                            onZoomChange={
                                                                setZoom
                                                            }
                                                        />
                                                    </div>
                                                    <Button
                                                        onClick={
                                                            uploadCroppedImage
                                                        }
                                                    >
                                                        Зберегти
                                                    </Button>
                                                </div>
                                            </div>
                                        </Modal>
                                        <FormControl>
                                            <Input
                                                accept="text"
                                                className="hidden"
                                                type="text"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex w-full justify-between gap-4">
                                <FormField
                                    control={mainForm.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem className="basis-1/2">
                                            <FormLabel className="text-xl">
                                                Електронна пошта
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    className="flex-grow outline outline-1 outline-neutral-400"
                                                    disabled
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={mainForm.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem className="basis-1/2">
                                            <FormLabel className="text-xl">
                                                Ім&apos;я
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
                            <FormField
                                control={mainForm.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel className="text-xl">
                                            Опис
                                        </FormLabel>
                                        <Editor
                                            value={field.value}
                                            defaultValue={
                                                entity.data?.description ?? ''
                                            }
                                            onChange={createSetValue(
                                                'description',
                                            )}
                                        />
                                        <style>
                                            {`
                                            .ql-editor {
                                                max-height: 100px;
                                            }`}
                                        </style>
                                        <FormControl>
                                            <Input
                                                className="hidden"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Опис вашого профілю (видимий для
                                            всіх)
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex w-full justify-between">
                                {/* Collision with `undefined` is unwanted, hence the === false*/}
                                {entity.data?.isOauth === false && (
                                    <Button
                                        variant="ghost"
                                        className="px-7 py-6"
                                        type="button"
                                        onClick={changeDialogState}
                                    >
                                        Змінити пароль
                                    </Button>
                                )}
                                <span />
                                <div className="flex gap-8 self-end">
                                    <Button className="px-7 py-6" type="submit">
                                        Зберегти
                                    </Button>
                                    {/*<Button*/}
                                    {/*    className="px-7 py-6"*/}
                                    {/*    type="reset"*/}
                                    {/*    variant="destructive"*/}
                                    {/*    onClick={handleFormReset}*/}
                                    {/*>*/}
                                    {/*    Відмінити*/}
                                    {/*</Button>*/}
                                </div>
                            </div>
                        </form>
                    </Form>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Змінненя пароля</DialogTitle>
                            </DialogHeader>
                            <Form {...passwordForm}>
                                <form
                                    onSubmit={passwordForm.handleSubmit(
                                        onPasswordSubmit,
                                    )}
                                    className="flex w-full flex-col items-center gap-4 py-4"
                                >
                                    <FormField
                                        control={passwordForm.control}
                                        name="oldPassword"
                                        render={({ field }) => (
                                            <FormItem className="mb-6 w-5/6 space-y-2">
                                                <FormLabel className="font-normal">
                                                    Введіть cтарий пароль
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        className=" outline outline-1 outline-neutral-400"
                                                        type="password"
                                                        {...field}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={passwordForm.control}
                                        name="newPassword"
                                        render={({ field }) => (
                                            <FormItem className="w-5/6 space-y-2">
                                                <FormLabel className="font-normal">
                                                    Введіть новий пароль
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        className="outline outline-1 outline-neutral-400"
                                                        type="password"
                                                        {...field}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={passwordForm.control}
                                        name="newPasswordRepeat"
                                        render={({ field }) => (
                                            <FormItem className="w-5/6 space-y-2">
                                                <FormLabel className="font-normal">
                                                    Повторіть новий пароль
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        className=" outline outline-1 outline-neutral-400"
                                                        type="password"
                                                        {...field}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </form>
                            </Form>
                            <DialogFooter>
                                <Button onClick={handlePasswordChange}>
                                    Підтвердити
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </>
            ) : (
                <Spinner />
            )}
        </Layout>
    );
};
export default Profile;

function readFile(file: Blob) {
    return new Promise<string | ArrayBuffer | null>((resolve) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => resolve(reader.result), false);
        reader.readAsDataURL(file);
    });
}
