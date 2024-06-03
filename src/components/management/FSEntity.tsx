import { FileText, FolderClosed } from 'lucide-react';
import React from 'react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { type RouterOutputs } from '~/utils/api';

export const FSEntity: React.FC<{
    entity: RouterOutputs['documentFolder']['list'][
        | 'folders'
        | 'documents'][number];
    currentEntity: {
        id: string;
        type: 'folder' | 'document';
    } | null;
    isEditing: boolean;
    handleTitleChange: (
        e: React.KeyboardEvent<HTMLInputElement>,
        id: string,
    ) => Promise<void>;
    type: 'folder' | 'document';
}> = ({ entity, currentEntity, isEditing, handleTitleChange, type }) => {
    return (
        <Button
            id={entity.id}
            name={type}
            className="flex h-14 flex-grow items-center justify-between gap-4 rounded-3xl bg-neutral-300 px-6 text-slate-800 drop-shadow-md hover:bg-neutral-400/40 active:drop-shadow-none"
        >
            <div className="flex flex-grow items-center gap-4">
                {type === 'folder' ? (
                    <FolderClosed className="min-h-6 min-w-6" />
                ) : (
                    <FileText className="min-h-6 min-w-6" />
                )}
                {currentEntity?.id === entity.id && isEditing ? (
                    <Input
                        className="flex-grow p-0"
                        defaultValue={entity.title}
                        onKeyDown={(e) => handleTitleChange(e, entity.id)}
                    ></Input>
                ) : (
                    <p className="select-none">{entity.title}</p>
                )}
            </div>
        </Button>
    );
};
