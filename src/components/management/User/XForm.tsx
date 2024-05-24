import React, { type RefObject, type ChangeEvent, useState } from 'react';
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
import { api, type RouterOutputs } from '~/utils/api';
import { uploadImage } from '~/utils/s3/frontend';
import { Editor } from '../common/Editor';
import Modal from 'react-modal';
import getCroppedImg from '../../utils/cropImage';
import Cropper, { type Area, type Point } from 'react-easy-crop';
import { useToast } from '~/components/ui/use-toast';

declare module 'react' {
    interface CSSProperties {
        '--image-url'?: string;
    }
}

export const XForm: React.FC<{
    entity?: RouterOutputs['user']['get'];
    changeModalState: () => void;
    formRef: RefObject<HTMLFormElement>;
}> = ({ entity, changeModalState, formRef }) => {
    const create = api.user.create.useMutation();
    const update = api.user.update.useMutation();

    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(
        null,
    );

    const { toast } = useToast();

    function successToast(description: string) {
        toast({
            title: 'Успіх',
            description,
        });
    }

    const form = useForm<z.infer<typeof CreateUserSchema>>({
        resolver: zodResolver(CreateUserSchema),
        defaultValues: {
            name: entity?.name ?? '',
            description: entity?.description ?? '',
            email: entity?.email ?? '',
            image: entity?.image ?? '',
            notes: entity?.notes ?? '',
        },
    });
    async function onSubmit(values: z.infer<typeof CreateUserSchema>) {
        if (entity) {
            await update.mutateAsync({ id: entity.id, ...values });
            successToast('Користувача оновлено');
        } else {
            await create.mutateAsync(values);
            successToast('Користувача створено');
        }
        changeModalState();
    }

    function createSetValue(field: keyof z.infer<typeof CreateUserSchema>) {
        return async function setDescription(value: string) {
            form.setValue(field, value);
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
                form.setValue('image', imageUrl);
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
    return (
        <Form {...form}>
            <form
                ref={formRef}
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex h-[90%] w-3/4 items-center justify-center rounded-lg bg-gray-300 outline outline-neutral-400"
            >
                <div className="flex h-[90%] w-4/5 flex-col items-center justify-between gap-4">
                    <FormField
                        control={form.control}
                        name="image"
                        render={({ field }) => (
                            <FormItem className="flex flex-col items-center gap-1">
                                <label
                                    className="cursor-pointer"
                                    htmlFor="image-upload"
                                >
                                    <div
                                        style={{
                                            '--image-url': `url(${field.value ? field.value : entity?.image})`,
                                        }}
                                        className={`flex h-24 w-24 items-center justify-center rounded-full border-2 border-gray-400 bg-white bg-[image:var(--image-url)] bg-cover transition-all hover:opacity-80 dark:bg-gray-700`}
                                    >
                                        {!entity?.image && (
                                            <UploadIcon className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                                        )}
                                    </div>
                                    <Input
                                        accept="image/*"
                                        id="image-upload"
                                        className="sr-only"
                                        type="file"
                                        onInput={onFileChange}
                                    />
                                </label>
                                <Modal
                                    isOpen={!!imageSrc}
                                    className="flex h-svh w-svw items-center justify-center"
                                >
                                    <div className="flex h-3/5 w-2/5 flex-col items-center gap-10 rounded-lg bg-gray-300 outline outline-neutral-400">
                                        <div className="flex h-10 w-full items-center justify-between border-b-2 border-gray-500 bg-gray-400">
                                            <span className="px-5">
                                                Обріжте новий аватар для
                                                користувача
                                            </span>
                                            <button
                                                onClick={onClose}
                                                className="flex items-center justify-center px-5  dark:text-gray-400"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth="2"
                                                    stroke="currentColor"
                                                    className="max-h-[24px] min-h-[24px] min-w-[24px] max-w-[24px]"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M6 18L18 6M6 6l12 12"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                        <div className="flex h-4/5 w-4/5 flex-col justify-between">
                                            <div className="relative h-96 w-full">
                                                <Cropper
                                                    image={imageSrc ?? ''}
                                                    crop={crop}
                                                    zoom={zoom}
                                                    aspect={1 / 1}
                                                    cropShape="round"
                                                    onCropChange={setCrop}
                                                    onCropComplete={
                                                        onCropComplete
                                                    }
                                                    onZoomChange={setZoom}
                                                />
                                            </div>
                                            <Button
                                                onClick={uploadCroppedImage}
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
                    <div className="flex h-2/3 w-full gap-12">
                        <div className="flex flex-1 flex-col gap-4">
                            <div className="flex w-full justify-between gap-4">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem className="basis-1/2">
                                            <FormLabel className="text-xl">
                                                Електронна пошта
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    className="flex-grow outline outline-1 outline-neutral-400"
                                                    placeholder={
                                                        !entity || entity.email
                                                            ? 'anton@gmail.com'
                                                            : '📲'
                                                    }
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
                                        <FormItem className="basis-1/2">
                                            <FormLabel className="text-xl">
                                                Ім&apos;я користувача
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
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem className="">
                                        <FormLabel className="text-xl">
                                            Опис
                                        </FormLabel>
                                        <Editor
                                            defaultValue={
                                                entity?.description ?? ''
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
                                    <FormItem className="">
                                        <FormLabel className="text-xl">
                                            Нотатки про користувача
                                        </FormLabel>
                                        <Editor
                                            defaultValue={entity?.notes ?? ''}
                                            onChange={createSetValue('notes')}
                                        />
                                        <FormControl>
                                            <Input
                                                className="hidden"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        {/* todo: userRole */}
                        {/* <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel className="text-xl">
                                        Username
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            className="flex-grow outline outline-1 outline-neutral-400"
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

function readFile(file: Blob) {
    return new Promise<string | ArrayBuffer | null>((resolve) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => resolve(reader.result), false);
        reader.readAsDataURL(file);
    });
}

function UploadIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" x2="12" y1="3" y2="15" />
        </svg>
    );
}
