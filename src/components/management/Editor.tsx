import dynamic from 'next/dynamic';
import { useState } from 'react';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), {
    ssr: false,
});

export const Editor = ({
    defaultValue,
    onChange,
}: {
    defaultValue: string;
    onChange: (value: string) => void;
}) => {
    const [text, setText] = useState(defaultValue);
    function changeValue(value: string) {
        setText(value);
        onChange(value);
    }
    const modules = {
        toolbar: [
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
    };

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
            ></ReactQuill>
        </div>
    );
};
