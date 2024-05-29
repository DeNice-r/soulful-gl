import React, { type MouseEvent, useEffect, useState } from 'react';
import {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '~/components/ui/breadcrumb';
import { Button } from '~/components/ui/button';
import { Pencil, Plus } from 'lucide-react';
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from '~/components/ui/context-menu';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '~/components/ui/popover';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '~/components/ui/dialog';
import { api, type RouterOutputs } from '~/utils/api';
import { FSEntity } from '~/components/knowledge/FSEntity';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { ScrollArea } from '~/components/ui/scroll-area';
import { cn } from '~/lib/utils';
import { Editor } from '~/components/management/common/Editor';
import { Spinner } from '~/components/ui/spinner';
import { type EntityData, EntityType } from '~/utils/types';

const Knowledge: React.FC<{
    chat?: boolean;
    currentEntity: EntityData;
    setCurrentEntity: (entity: EntityData) => void;
}> = ({ chat = false, currentEntity, setCurrentEntity }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newEntityName, setNewEntityName] = useState('Нова папка');
    const [creationEntity, setCreationEntity] = useState<'folder' | 'document'>(
        'folder',
    );
    const [document, setDocument] =
        useState<RouterOutputs['document']['get']>(null);

    const [editingEntity, setEditingEntity] = useState<EntityData>(null);

    const { client: apiClient } = api.useUtils();

    const documentFolders = api.documentFolder.list.useQuery({
        id: currentEntity?.id,
    });

    const deleteMutation = {
        folder: api.documentFolder.delete.useMutation(),
        document: api.document.delete.useMutation(),
    };

    const updateMutation = {
        folder: api.documentFolder.update.useMutation(),
        document: api.document.update.useMutation(),
    };

    const createMutation = {
        folder: api.documentFolder.create.useMutation(),
        document: api.document.create.useMutation(),
    };

    function openCreateEntityWindow(type: 'folder' | 'document') {
        setIsDialogOpen(true);
        setCreationEntity(type);
    }

    function handleChangeId(e: MouseEvent<HTMLElement>) {
        const element = e.target as HTMLElement;
        const button = element.closest('button');
        const buttonId = button?.getAttribute('id');
        setIsEditing(false);
        if (button && buttonId) {
            setEditingEntity({
                id: buttonId,
                type: button.getAttribute('name') as EntityType,
            });
        } else {
            setEditingEntity(null);
        }
    }

    const handleDelete = async () => {
        if (!editingEntity || !editingEntity.id) {
            return;
        }
        await deleteMutation[editingEntity.type].mutateAsync(editingEntity.id);
        await documentFolders.refetch();
    };

    const handleTitleChange = async (
        e: React.KeyboardEvent<HTMLInputElement>,
        id: string,
    ) => {
        const inputElement = e.target as HTMLInputElement;
        if (e.key === 'Enter' && editingEntity?.id === id) {
            await updateMutation[editingEntity.type].mutateAsync({
                id: id,
                title: inputElement.value,
            });
            await documentFolders.refetch();
            setIsEditing(false);
        }
    };

    const handleFolderCreation = async () => {
        setIsDialogOpen(false);
        setTimeout(() => {
            void (async () => {
                await createMutation[creationEntity].mutateAsync({
                    title: newEntityName,
                    description: '',
                    parentId:
                        currentEntity?.type === EntityType.FOLDER
                            ? currentEntity?.id
                            : null,
                });
                setNewEntityName('Нова папка');
                await documentFolders.refetch();
            })();
        });
    };

    function handleRenameCancel(e: React.KeyboardEvent<HTMLDivElement>) {
        if (e.key === 'Escape' && currentEntity) {
            setCurrentEntity(null);
            setIsEditing(false);
        }
    }

    function handleClickRenameCancel(e: React.MouseEvent<HTMLDivElement>) {
        const element = e.target as HTMLElement;
        const button = element.closest('button');
        if (
            editingEntity?.id &&
            editingEntity?.id !== button?.getAttribute('id')
        ) {
            setEditingEntity(null);
            setIsEditing(false);
            return true;
        }
    }

    useEffect(() => {
        void (async () => {
            if (
                currentEntity?.type === EntityType.DOCUMENT &&
                currentEntity?.id &&
                !document
            ) {
                const document = await apiClient.document.get.query(
                    currentEntity?.id,
                );
                setDocument(document);
            }
        })();

        if (currentEntity?.type !== EntityType.DOCUMENT) {
            setDocument(null);
            setIsEditing(false);
        }
    }, [currentEntity?.type, currentEntity?.id]);

    const handleDocumentEdit = async () => {
        setIsEditing((val) => !val);
        console.log(document);
        console.log(isEditing, currentEntity?.id, document);
        if (isEditing && currentEntity?.id && document) {
            await updateMutation['document'].mutateAsync({
                id: currentEntity?.id,
                title: document.title,
                description: document.description,
            });
        }
    };

    function handleGoToEntity(e: MouseEvent<HTMLElement>) {
        const element = e.target as HTMLElement;
        const button = element.closest('button');
        const buttonId = button && button?.getAttribute('id');
        const type = button && button.getAttribute('name');
        if (
            button &&
            buttonId &&
            (type === EntityType.DOCUMENT || type === EntityType.FOLDER)
        ) {
            setCurrentEntity({
                type,
                id: buttonId,
            });
        }
    }

    const topParentId =
        documentFolders.data?.parent?.parentId ??
        (document?.parent?.parentId || null);
    const parentId =
        documentFolders.data?.parent?.id ?? document?.parent?.id ?? null;
    const parentTitle =
        documentFolders.data?.parent?.title ?? document?.parent?.title ?? null;
    const title = documentFolders.data?.title ?? document?.title ?? null;

    return (
        <div
            className={cn(
                'flex h-full w-full flex-col rounded-2xl bg-neutral-200 px-16 py-10 drop-shadow-lg',
                !document && 'gap-8',
                chat &&
                    'overflow-y-auto rounded-none bg-neutral-300 px-8 drop-shadow-none',
            )}
        >
            <Breadcrumb className="select-none">
                <BreadcrumbList
                    className={cn(
                        'text-lg transition-colors hover:text-neutral-950',
                        chat && 'text-neutral-950 hover:text-neutral-500',
                    )}
                >
                    <BreadcrumbItem>
                        <span
                            className="cursor-pointer"
                            onClick={() =>
                                setCurrentEntity({
                                    id: null,
                                    type: EntityType.FOLDER,
                                })
                            }
                        >
                            Головна
                        </span>
                    </BreadcrumbItem>
                    {topParentId && (
                        <>
                            <BreadcrumbSeparator className="[&>svg]:size-5" />
                            <BreadcrumbItem>
                                <BreadcrumbEllipsis />
                            </BreadcrumbItem>
                        </>
                    )}
                    {parentId && (
                        <>
                            <BreadcrumbSeparator className="[&>svg]:size-5" />
                            <BreadcrumbItem>
                                <span
                                    className="cursor-pointer"
                                    onClick={() =>
                                        setCurrentEntity({
                                            id: parentId,
                                            type: EntityType.FOLDER,
                                        })
                                    }
                                >
                                    {parentTitle}
                                </span>
                            </BreadcrumbItem>
                        </>
                    )}
                    {title && (
                        <>
                            <BreadcrumbSeparator className="[&>svg]:size-5" />
                            <BreadcrumbItem>
                                <BreadcrumbPage>{title}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </>
                    )}
                </BreadcrumbList>
            </Breadcrumb>
            {!document && !documentFolders.data && (
                <Spinner size="large"></Spinner>
            )}
            {document ? (
                <div className="flex h-full flex-col items-center">
                    <div className="flex w-full items-center justify-between py-4">
                        {!isEditing ? (
                            <h3 className="font-semibold">{document.title}</h3>
                        ) : (
                            <div className="relative">
                                <Pencil className="pointer-events-none absolute bottom-2 end-0 mr-2 flex h-4 w-4 items-center text-neutral-500" />
                                <Input
                                    className="h-9 w-40 rounded-none border-0 border-b border-neutral-900 bg-neutral-200 px-1 py-0 text-3xl font-semibold focus:rounded-md focus:border-b-0 focus-visible:ring-transparent"
                                    defaultValue={document.title}
                                    onChange={(e) => {
                                        document.title = e.target.value;
                                    }}
                                />
                            </div>
                        )}
                        <Button onClick={handleDocumentEdit}>
                            {!isEditing ? 'Редагувати' : 'Зберегти'}
                        </Button>
                    </div>

                    {!isEditing ? (
                        chat ? (
                            <ScrollArea className="flex h-full max-h-[calc(100%-140px)] w-full scroll-smooth rounded-2xl bg-neutral-50 shadow-inner">
                                <div
                                    className="ql-editor w-full pr-4 text-justify"
                                    dangerouslySetInnerHTML={{
                                        __html: document.description,
                                    }}
                                />
                            </ScrollArea>
                        ) : (
                            <div
                                className={cn(
                                    'flex h-full w-full rounded-2xl bg-neutral-50 shadow-inner',
                                    chat && 'h-auto',
                                )}
                            >
                                <div
                                    className="ql-editor !px-8 !text-justify"
                                    dangerouslySetInnerHTML={{
                                        __html: document.description,
                                    }}
                                />
                            </div>
                        )
                    ) : (
                        <Editor
                            defaultValue={document.description}
                            onChange={(description: string) =>
                                setDocument({
                                    ...document,
                                    description,
                                })
                            }
                        ></Editor>
                    )}
                    <style>
                        {`
                                    .text-editor{
                                        width: 100%;
                                    }
                                    .quill {
                                        border-radius: 1rem;
                                    }
                                    .ql-toolbar {
                                        border-top-left-radius: 1rem;
                                        border-top-right-radius: 1rem;
                                    }
                                    .ql-container {
                                        border-bottom-left-radius: 1rem;
                                        border-bottom-right-radius: 1rem;
                                    }
                                    .ql-editor {
                                        font-size: 1rem;
                                        line-height: 1.5;
                                        padding-left: 2rem;
                                        padding-right: 2rem;
                                        text-align: justify;
                                    }
                                `}
                    </style>
                </div>
            ) : (
                <ContextMenu>
                    <ContextMenuTrigger asChild>
                        <div
                            onContextMenu={handleChangeId}
                            onClick={(e) => {
                                isEditing
                                    ? handleClickRenameCancel(e)
                                    : handleGoToEntity(e);
                            }}
                            onKeyDown={handleRenameCancel}
                            className={cn(
                                'grid w-full grid-cols-auto grid-rows-6 flex-wrap justify-between gap-8 text-slate-800',
                                chat ? '2xl:grid-cols-auto' : '2xl:grid-cols-4',
                            )}
                        >
                            {!!documentFolders?.data?.folders?.length &&
                                documentFolders?.data?.folders?.map(
                                    (entity) => (
                                        <FSEntity
                                            key={entity.id}
                                            {...{
                                                type: 'folder',
                                                entity,
                                                handleTitleChange,
                                                editingEntity,
                                                isEditing,
                                            }}
                                        />
                                    ),
                                )}
                            {!!documentFolders?.data?.documents?.length &&
                                documentFolders?.data?.documents?.map(
                                    (entity) => (
                                        <FSEntity
                                            key={entity.id}
                                            {...{
                                                type: 'document',
                                                entity,
                                                handleTitleChange,
                                                editingEntity,
                                                isEditing,
                                            }}
                                        />
                                    ),
                                )}
                            <Popover>
                                {!(
                                    currentEntity?.type === EntityType.DOCUMENT
                                ) &&
                                    documentFolders.data && (
                                        <PopoverTrigger asChild>
                                            <Button className="flex h-14 w-14 rounded-full bg-neutral-300 text-slate-800 drop-shadow-md hover:bg-neutral-400/40 active:drop-shadow-none">
                                                <Plus />
                                            </Button>
                                        </PopoverTrigger>
                                    )}
                                <PopoverContent
                                    align="start"
                                    className="max-w-40 p-2 text-sm"
                                >
                                    <div className="flex flex-col text-slate-800">
                                        <p
                                            onClick={() =>
                                                openCreateEntityWindow('folder')
                                            }
                                            className="cursor-pointer rounded-t-md p-1 hover:bg-neutral-100"
                                        >
                                            Створити папку
                                        </p>

                                        <p
                                            onClick={() =>
                                                openCreateEntityWindow(
                                                    'document',
                                                )
                                            }
                                            className="cursor-pointer rounded-b-md p-1 hover:bg-neutral-100"
                                        >
                                            Створити файл
                                        </p>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                        {editingEntity ? (
                            <>
                                <ContextMenuItem
                                    className="cursor-pointer"
                                    onClick={() => {
                                        setIsEditing(true);
                                    }}
                                >
                                    Перейменувати
                                </ContextMenuItem>
                                <ContextMenuItem
                                    onClick={handleDelete}
                                    className="cursor-pointer text-red-500 focus:text-red-600"
                                >
                                    Видалити
                                </ContextMenuItem>
                            </>
                        ) : (
                            <>
                                <ContextMenuItem
                                    onClick={() =>
                                        openCreateEntityWindow('folder')
                                    }
                                    className="cursor-pointer"
                                >
                                    Створити папку
                                </ContextMenuItem>
                                <ContextMenuItem
                                    onClick={() =>
                                        openCreateEntityWindow('document')
                                    }
                                    className="cursor-pointer"
                                >
                                    Створити файл
                                </ContextMenuItem>
                            </>
                        )}
                    </ContextMenuContent>
                </ContextMenu>
            )}

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Створити папку</DialogTitle>
                    </DialogHeader>
                    <div className="flex gap-4 py-4">
                        <div className="flex w-full items-center justify-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Назва
                            </Label>
                            <Input
                                id="name"
                                placeholder="Нова папка"
                                className="w-3/5"
                                onChange={(e) =>
                                    setNewEntityName(e.target.value)
                                }
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" onClick={handleFolderCreation}>
                            Створити
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};
export default Knowledge;
