import dynamic from 'next/dynamic';
import { type LegacyRef, useEffect, useMemo, useRef, useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import { uploadImage } from '~/utils/s3/frontend';
import { type ReactQuillProps } from 'react-quill';
import { useToast } from '~/components/ui/use-toast';
import { cn } from '~/lib/utils';

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
            addMatcher: (
                type: string,
                handler: (
                    node: HTMLImageElement,
                    delta: {
                        ops: unknown[];
                    },
                ) => { ops: unknown[] },
            ) => void;
        };
    };
}

export const Editor = ({
    defaultValue,
    onChange,
    value,
    className,
    containerClassName,
    emitOnOutsideChanges = true,
}: {
    defaultValue?: string;
    onChange: (value: string) => void;
    value?: string;
    className?: string;
    containerClassName?: string;
    emitOnOutsideChanges?: boolean;
}) => {
    const { toast } = useToast();
    const quillRef = useRef<ActualReactQuill>(null);
    const lastChangeOutsideRef = useRef<number>(0);
    const [text, setText] = useState(defaultValue);
    function changeValue(newValue: string) {
        setText(newValue);
        if (!emitOnOutsideChanges && lastChangeOutsideRef.current) {
            lastChangeOutsideRef.current--;
            return;
        }
        onChange(newValue);
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

    useEffect(() => {
        const quill = quillRef.current;
        if (!quill) return;

        quill.getEditor().clipboard.addMatcher('img', (node, delta) => {
            if (node.src.startsWith('data:image')) {
                toast({
                    title: 'Помилка',
                    description:
                        'Будь ласка, використовуйте кнопку "🖼️" для завантаження зображень',
                    variant: 'destructive',
                });
                delta.ops = [];
            }
            return delta;
        });
    }, [quillRef.current]);

    useEffect(() => {
        if (value !== undefined) {
            setText(value);
            lastChangeOutsideRef.current += emitOnOutsideChanges ? 0 : 1;
        }
    }, [value]);

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
        <div className={cn('text-editor', containerClassName)}>
            <ReactQuill
                className={cn('rounded-md bg-neutral-50', className)}
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
