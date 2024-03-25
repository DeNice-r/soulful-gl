import React, { type ChangeEvent, useState } from 'react';
import Router from 'next/router';
import ConstrainedLayout from '../components/ConstrainedLayout';
import { uploadImage } from '~/utils/s3/frontend';

const Draft: React.FC = () => {
    const [title, setTitle] = useState('Title');
    const [description, setDescription] = useState('Description');
    const [file, setFile] = useState<File | null>();

    const submitData = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (!file) {
            alert('Please select a file first.');
            return;
        }

        const image = await uploadImage(file);

        if (!image) {
            alert('Failed to upload image');
        }

        try {
            const body = { title, description, image };
            await fetch('/api/post', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
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
        <ConstrainedLayout>
            <div>
                <form onSubmit={submitData}>
                    <h1>New Draft</h1>
                    <input
                        autoFocus
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Title"
                        type="text"
                        value={title}
                    />
                    <textarea
                        cols={50}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Description"
                        rows={8}
                        value={description}
                    />
                    <input type="file" onChange={handleFileChange} />
                    <input
                        disabled={!description || !title}
                        type="submit"
                        value="Create"
                    />
                    <a
                        className="back"
                        href="#"
                        onClick={() => Router.push('/')}
                    >
                        or Cancel
                    </a>
                </form>
            </div>
            <style jsx>{`
                .page {
                    background: var(--geist-background);
                    padding: 3rem;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                input[type='text'],
                textarea {
                    width: 100%;
                    padding: 0.5rem;
                    margin: 0.5rem 0;
                    border-radius: 0.25rem;
                    border: 0.125rem solid rgba(0, 0, 0, 0.2);
                }

                input[type='submit'] {
                    background: #ececec;
                    border: 0;
                    padding: 1rem 2rem;
                }

                .back {
                    margin-left: 1rem;
                }
            `}</style>
        </ConstrainedLayout>
    );
};

export default Draft;
