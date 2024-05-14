import React from 'react';
import { Layout } from '~/components/common/Layout';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '~/components/ui/breadcrumb';
import { Button } from '~/components/ui/button';
import { Plus } from 'lucide-react';
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
import { useState, type MouseEvent } from 'react';
import { api } from '~/utils/api';
import { FSEntity } from '../../components/management/FSEntity';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';

const Knowledge: React.FC = () => {
    const [currentEntity, setCurrentEntity] = useState<{
        id: string;
        type: 'folder' | 'document';
    } | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newEntityName, setNewEntityName] = useState('Нова папка');
    const [creationEntity, setCreationEntity] = useState<'folder' | 'document'>(
        'folder',
    );

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
            setCurrentEntity({
                id: buttonId,
                type: button.getAttribute('name') as 'folder' | 'document',
            });
        } else {
            setCurrentEntity(null);
        }
    }

    const documentFolders = api.documentFolder.list.useQuery();

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

    const handleDelete = async () => {
        if (!currentEntity || !currentEntity.id) {
            return;
        }
        await deleteMutation[currentEntity.type].mutateAsync(currentEntity.id);
        await documentFolders.refetch();
    };

    const handleTitleChange = async (
        e: React.KeyboardEvent<HTMLInputElement>,
        id: string,
    ) => {
        const inputElement = e.target as HTMLInputElement;
        if (e.key === 'Enter' && currentEntity?.id === id) {
            await updateMutation[currentEntity.type].mutateAsync({
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
        if (button?.getAttribute('id') !== currentEntity?.id) {
            setCurrentEntity(null);
            setIsEditing(false);
        }
    }

    return (
        <Layout footer={false} className="bg-knowledge-cover">
            <div className="flex w-2/3 flex-col items-center gap-10 py-12 text-slate-800">
                <h3 className="font-bold">База знань</h3>
                <div className="flex h-full w-full flex-col gap-8 rounded-2xl bg-neutral-200 px-16 py-10 drop-shadow-lg">
                    <nav>
                        <Breadcrumb>
                            <BreadcrumbList className="text-lg">
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/knowledge">
                                        Головна
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="[&>svg]:size-5" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>
                                        Current Folder
                                    </BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </nav>
                    <ContextMenu>
                        <ContextMenuTrigger asChild>
                            <div
                                onContextMenu={handleChangeId}
                                onClick={handleClickRenameCancel}
                                onKeyDown={handleRenameCancel}
                                className="grid w-full grid-cols-auto grid-rows-6 flex-wrap justify-between gap-8 text-slate-800 2xl:grid-cols-4"
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
                                                    currentEntity,
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
                                                    currentEntity:
                                                        currentEntity,
                                                    isEditing,
                                                }}
                                            />
                                        ),
                                    )}

                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button className="flex h-14 w-14 rounded-full bg-neutral-300 text-slate-800 drop-shadow-md hover:bg-neutral-400/40 active:drop-shadow-none">
                                            <Plus />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        align="start"
                                        className="max-w-40 p-2 text-sm"
                                    >
                                        <div className="flex flex-col text-slate-800">
                                            <p
                                                onClick={() =>
                                                    openCreateEntityWindow(
                                                        'folder',
                                                    )
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
                            {currentEntity ? (
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
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Створити папку</DialogTitle>
                            </DialogHeader>
                            <div className="flex gap-4 py-4">
                                <div className="flex w-full items-center justify-center gap-4">
                                    <Label
                                        htmlFor="name"
                                        className="text-right"
                                    >
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
                                <Button
                                    type="submit"
                                    onClick={handleFolderCreation}
                                >
                                    Створити
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </Layout>
    );
};
export default Knowledge;
