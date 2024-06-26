import React, {
    type RefObject,
    type ChangeEvent,
    useState,
    useEffect,
} from 'react';
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
import { ExerciseSchema, ExerciseStepSchema } from '~/utils/schemas';
import { api, type RouterOutputs } from '~/utils/api';
import { uploadImage } from '~/utils/s3/frontend';
import { Editor } from '../common/Editor';
import Modal from 'react-modal';
import getCroppedImg from '../../utils/cropImage';
import Cropper, { type Area, type Point } from 'react-easy-crop';
import { MoveLeft, MoveRight, Trash2, X, Plus, Upload } from 'lucide-react';
import { usePageContext } from './PageProvider';
import { toast } from '~/components/ui/use-toast';

declare module 'react' {
    interface CSSProperties {
        '--image-url'?: string;
    }
}

export const XForm: React.FC<{
    entity?: RouterOutputs['exercise']['get'];
    changeModalState: () => void;
    formRef: RefObject<HTMLFormElement>;
}> = ({ entity, changeModalState, formRef }) => {
    const create = api.exercise.create.useMutation();
    const update = api.exercise.update.useMutation();

    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(
        null,
    );

    const {
        pages,
        pagesRef,
        currentPage,
        savePageData,
        goToPreviousPage,
        goToNextPage,
        deletePage,
        resetPages,
    } = usePageContext();

    const currentPageData = pages[currentPage]?.data || {
        image: '',
        title: '',
        description: '',
        timeSeconds: '',
    };

    useEffect(() => {
        form.setValue('image', currentPageData.image);
        form.setValue('title', currentPageData.title);
        form.setValue('description', currentPageData.description);
        form.setValue('timeSeconds', currentPageData.timeSeconds);
    }, [currentPage]);

    const form = useForm<z.infer<typeof ExerciseStepSchema>>({
        resolver: zodResolver(ExerciseStepSchema),
        defaultValues: {
            title: entity?.title ?? currentPageData.title,
            description: entity?.description ?? currentPageData.description,
            image: entity?.image ?? currentPageData.image,
            timeSeconds:
                entity?.steps[currentPage - 1]?.timeSeconds?.toString() ??
                currentPageData.timeSeconds?.toString(),
        },
    });

    async function onSubmit(values: z.infer<typeof ExerciseStepSchema>) {
        savePageData(currentPage, values);
        try {
            const r = ExerciseSchema.parse({
                ...pagesRef.current[0].data,
                steps: pagesRef.current.slice(1).map((page) => ({
                    ...page.data,
                    ...(page.data.timeSeconds
                        ? { timeSeconds: page.data.timeSeconds }
                        : {}),
                })),
            });
            if (entity) {
                await update.mutateAsync({ id: entity.id, ...r });
            } else {
                await create.mutateAsync(r);
            }
            resetPages();
            changeModalState();
        } catch (e) {
            toast({
                title: 'Один з кроків вправи не відповідає вимогам',
                variant: 'destructive',
            });
            return true;
        }
    }

    function createSetValue(field: keyof z.infer<typeof ExerciseStepSchema>) {
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

    function handleDeletePage() {
        deletePage(currentPage);
    }

    function handlePreviousPage() {
        const [image, title, description, timeSeconds] = form.getValues([
            'image',
            'title',
            'description',
            'timeSeconds',
        ]);
        goToPreviousPage({
            image: image ?? '',
            title,
            description,
            timeSeconds: timeSeconds ?? '',
        });
    }

    function handleNextPage() {
        const [image, title, description, timeSeconds] = form.getValues([
            'image',
            'title',
            'description',
            'timeSeconds',
        ]);
        goToNextPage({
            image: image ?? '',
            title,
            description,
            timeSeconds: timeSeconds ?? '',
        });
    }

    useEffect(() => {
        resetPages(
            entity && [
                {
                    id: 1,
                    data: {
                        image: entity.image ?? '',
                        title: entity.title,
                        description: entity.description,
                    },
                },
                ...entity.steps.map((step, index) => ({
                    id: index + 2,
                    data: {
                        image: step.image ?? '',
                        title: step.title,
                        description: step.description,
                        timeSeconds: step.timeSeconds?.toString() ?? undefined,
                    },
                })),
            ],
        );
    }, [entity]);

    return (
        <Form {...form}>
            <form
                ref={formRef}
                onSubmit={form.handleSubmit(onSubmit)}
                className="relative flex h-[90%] w-3/4 items-center justify-center rounded-lg bg-gray-300 outline outline-neutral-400"
            >
                <Button
                    className="absolute right-5 top-5 h-6 rounded-full border-none p-0 hover:bg-transparent focus-visible:ring-0"
                    variant="ghost"
                    onClick={() => {
                        resetPages();
                        changeModalState();
                    }}
                >
                    <X className="hover:text-slate-700" />
                </Button>
                <div className="flex h-[90%] w-4/5 flex-col items-center justify-between gap-4">
                    {currentPage < 1 ? (
                        <h2>Титульна сторінка вправи</h2>
                    ) : (
                        <h2>Крок вправи</h2>
                    )}
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
                                    <FormMessage />
                                </label>
                                <Modal
                                    isOpen={!!imageSrc}
                                    className="flex h-svh w-svw items-center justify-center"
                                >
                                    <div className="flex h-3/5 w-2/5 flex-col items-center gap-10 rounded-lg bg-gray-300 outline outline-neutral-400">
                                        <div className="flex h-10 w-full items-center justify-between border-b-2 border-gray-500 bg-gray-400">
                                            <span className="px-5">
                                                Обріжте нову картинку для вправи
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
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem className="">
                                        <FormLabel className="text-xl">
                                            Заголовок
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                className="flex-grow outline outline-1 outline-neutral-400"
                                                placeholder="Заспокоєння у стресовій ситуації"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {currentPage > 0 && (
                                <FormField
                                    control={form.control}
                                    name="timeSeconds"
                                    render={({ field }) => (
                                        <FormItem className="">
                                            <FormLabel className="text-xl">
                                                Час на виконання кроку (с)
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    className="flex-grow outline outline-1 outline-neutral-400"
                                                    type="number"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
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
                                            value={field.value}
                                        />
                                        <style>
                                            {`
                                            .ql-editor {
                                                max-height: 320px;
                                            }`}
                                        </style>
                                        <FormControl>
                                            <Input
                                                className="hidden"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Текст головної сторінки вправи
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <div className="flex w-full justify-between">
                        <div className="flex flex-grow basis-1 gap-8">
                            <Button
                                className=" px-7 py-6"
                                disabled={currentPage < 1 ?? true}
                                onClick={handlePreviousPage}
                            >
                                <MoveLeft />
                            </Button>
                            <Button
                                className="px-7 py-6"
                                onClick={handleNextPage}
                            >
                                {currentPage + 1 >= pagesRef.current.length ? (
                                    <Plus />
                                ) : (
                                    <MoveRight />
                                )}
                            </Button>
                        </div>
                        <div className="flex flex-grow basis-1 justify-center">
                            <Button
                                className="text-wrap px-7 py-6"
                                variant="destructive"
                                onClick={handleDeletePage}
                                disabled={currentPage < 1 ?? true}
                            >
                                <Trash2 />
                            </Button>
                        </div>
                        <div className="flex flex-grow basis-1 justify-end gap-8">
                            <Button className="px-7 py-6 text-sm" type="submit">
                                {entity ? 'Редагувати' : 'Створити'}
                            </Button>
                        </div>
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
