import React, { type ChangeEvent, useState } from 'react';
import Router from 'next/router';
import Layout from '~/components/Layout';
import { uploadImage } from '~/utils/s3/frontend';
import { api } from '~/utils/api';

const Draft: React.FC = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState<File | null>();
    const createMutation = api.post.create.useMutation();

    const submitData = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        let image: string | false = false;
        if (file) {
            image = await uploadImage(file);
            if (!image) {
                alert('Failed to upload image');
                return;
            }
        }

        try {
            await createMutation.mutateAsync({
                title,
                description,
                ...(image && { image }),
            });
            await Router.push('/drafts');
        } catch (error) {
            console.error(error);
        }
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (
            !event.target.files ||
            !(event.target.files[0] instanceof File) ||
            !event.target.files[0].name.match(/\.(jpg|jpeg|png|gif)$/i)
        ) {
            return;
        }
        setFile(event.target.files[0]);
    };

    return (
        <Layout>
            <div className="flex h-full flex-col items-center justify-center gap-4">
                <p className="text-center text-2xl font-bold">Новий Допис</p>
                <form
                    onSubmit={submitData}
                    className="flex flex-col items-center justify-between gap-4 rounded-lg shadow-lg md:mb-20 md:h-1/2 md:w-4/5 md:bg-slate-100 md:py-8"
                >
                    <div className="flex h-2/3 flex-col gap-4 md:w-11/12 md:flex-row">
                        <div className="flex basis-1/3 items-start">
                            <label
                                htmlFor="dropzone-file"
                                className="flex aspect-1.91/1 w-full cursor-pointer items-center justify-center rounded-lg border-2 bg-white transition hover:bg-slate-50"
                            >
                                <div className="flex flex-col items-center justify-center pb-6 pt-5">
                                    <p className="mb-2 text-sm text-gray-500">
                                        <span className="font-semibold">
                                            Click to upload
                                        </span>{' '}
                                        or drag and drop
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        PNG, JPG, JPEG or GIF (MAX. 5 MiB)
                                    </p>
                                </div>
                                <input
                                    id="dropzone-file"
                                    type="file"
                                    className="hidden"
                                    onChange={handleFileChange}
                                    accept=".png,.jpeg,.gif,.jpg"
                                />
                            </label>
                        </div>
                        <div className="flex basis-2/3 flex-col gap-4">
                            <input
                                autoFocus
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Заголовок"
                                type="text"
                                value={title}
                                className="mx-0 rounded-lg border-2 border-solid p-2 transition hover:bg-slate-50 active:border-slate-400"
                            />
                            <textarea
                                cols={50}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Вміст"
                                rows={8}
                                value={description}
                                className="row-span-3 mx-0 flex-grow resize-none rounded-lg border-2 border-solid p-2 transition hover:bg-slate-50 active:border-slate-400"
                            />
                        </div>
                    </div>
                    <div className="flex items-center justify-center gap-4">
                        <input
                            disabled={!description || !title}
                            type="submit"
                            value="Створити"
                            className="cursor-pointer rounded-md border-0 bg-sky-600 px-8 py-4 text-slate-50 transition-colors hover:bg-sky-500"
                            // unactive bg-slate-200
                        />
                        <a
                            className="rounded-md bg-slate-200 px-8 py-4 text-red-500 transition-colors hover:bg-red-600 hover:text-slate-50"
                            href="#"
                            onClick={() => Router.push('/')}
                        >
                            Відмінити
                        </a>
                    </div>
                </form>
            </div>
        </Layout>
    );
};

export default Draft;
