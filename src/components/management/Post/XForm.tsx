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
import { PostSchema } from '~/utils/schemas';
import { api, type RouterOutputs } from '~/utils/api';
import { uploadImage } from '~/utils/s3/frontend';
import { Editor } from '../common/Editor';
import Modal from 'react-modal';
import getCroppedImg from '../../utils/cropImage';
import Cropper, { type Area, type Point } from 'react-easy-crop';
import { Upload } from 'lucide-react';

declare module 'react' {
    interface CSSProperties {
        '--image-url'?: string;
    }
}

export const XForm: React.FC<{
    entity?: RouterOutputs['post']['get'];
    changeModalState: () => void;
    formRef: RefObject<HTMLFormElement>;
}> = ({ entity, changeModalState, formRef }) => {
    const create = api.post.create.useMutation();
    const update = api.post.update.useMutation();

    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(
        null,
    );

    const form = useForm<z.infer<typeof PostSchema>>({
        resolver: zodResolver(PostSchema),
        defaultValues: {
            title: entity?.title ?? '',
            description: entity?.description ?? '',
            image: entity?.image ?? '',
        },
    });
    async function onSubmit(values: z.infer<typeof PostSchema>) {
        if (entity) {
            await update.mutateAsync({ id: entity.id, ...values });
        } else {
            await create.mutateAsync(values);
        }
        changeModalState();
    }

    function createSetValue(field: keyof z.infer<typeof PostSchema>) {
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
                                            '--image-url': `url(${field.value ?? entity?.image ?? ''})`,
                                        }}
                                        className={`flex aspect-video w-72 items-center justify-center rounded-xl border-2 border-gray-400 bg-white bg-[image:var(--image-url)] bg-cover transition-all hover:opacity-80 dark:bg-gray-700`}
                                    >
                                        {!entity?.image && (
                                            <Upload className="h-8 w-8 text-gray-500 dark:text-gray-400" />
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
                                                Обріжте нову картинку для допису
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
                                                    aspect={16 / 9}
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
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem className="basis-full">
                                            <FormLabel className="text-xl">
                                                Заголовок
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    className="flex-grow outline outline-1 outline-neutral-400"
                                                    placeholder="Як обрати психолога. 7 порад."
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
                                                max-height: 350px;
                                            }`}
                                        </style>
                                        <FormControl>
                                            <Input
                                                className="hidden"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Текст допису
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
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

function readFile(file: Blob) {
    return new Promise<string | ArrayBuffer | null>((resolve) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => resolve(reader.result), false);
        reader.readAsDataURL(file);
    });
}
