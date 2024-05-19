import dynamic from 'next/dynamic';
import { type LegacyRef, useEffect, useMemo, useRef, useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import { uploadImage } from '~/utils/s3/frontend';
import { type ReactQuillProps } from 'react-quill';

const ReactQuill = dynamic(
    async () => {
        const { default: RQ } = await import('react-quill');
        // eslint-disable-next-line react/display-name
        return ({
            forwardedRef,
            ...props
        }: ReactQuillProps & {
            forwardedRef: LegacyRef<ActualReactQuill> | undefined;
        }) => (
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            // @ts-expect-error ref is a valid prop. At this point types are useless.
            <RQ ref={forwardedRef} {...props} />
        );
    },
    { ssr: false },
);

interface ActualReactQuill {
    getEditor: () => {
        getSelection: () => { index: number; length: number };
        insertEmbed: (index: number, type: string, value: string) => void;
        clipboard: {
            // addMatcher: (
            //     type: number,
            //     handler: (node: Node, delta: any) => Promise<any>,
            // ) => void;
        };
    };
}

export const Editor = ({
    defaultValue,
    onChange,
}: {
    defaultValue: string;
    onChange: (value: string) => void;
}) => {
    const quillRef = useRef<ActualReactQuill>(null);
    const [text, setText] = useState(defaultValue);
    function changeValue(value: string) {
        setText(value);
        onChange(value);
    }

    function imageHandler() {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            if (!input.files) return;
            const file = input.files[0];
            if (!file) {
                return;
            }
            const imageUrl = await uploadImage(file);

            if (!quillRef.current || !imageUrl) {
                return;
            }

            const range = quillRef.current.getEditor().getSelection();
            quillRef.current
                .getEditor()
                .insertEmbed(range?.index ?? 0, 'image', imageUrl);
        };
    }

    const modules = useMemo(
        () => ({
            toolbar: {
                container: [
                    [{ header: [1, 2, false] }],
                    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                    [
                        { list: 'ordered' },
                        { list: 'bullet' },
                        { indent: '-1' },
                        { indent: '+1' },
                    ],
                    ['link', 'image'],
                    ['clean'],
                ],
                handlers: {
                    image: imageHandler,
                },
            },
        }),
        [],
    );

    const formats = [
        'header',
        'bold',
        'italic',
        'underline',
        'strike',
        'blockquote',
        'list',
        'bullet',
        'indent',
        'link',
        'image',
    ];

    return (
        <div className="text-editor">
            <ReactQuill
                className="bg-slate-50"
                theme="snow"
                modules={modules}
                formats={formats}
                value={text}
                onChange={changeValue}
                forwardedRef={quillRef}
            ></ReactQuill>
        </div>
    );
};
