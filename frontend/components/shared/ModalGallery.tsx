import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors, DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy
} from '@dnd-kit/sortable';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import React, {useState, useEffect} from "react";
import Image from "next/image";
import {Card, CardContent, CardFooter} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {API_BASE_URL} from "@/lib/globalConstants";
import {Checkbox} from "@/components/ui/checkbox";
import {ImageObject} from "@/lib/types";
import {GripVertical} from "lucide-react";
import {TooltipContent, TooltipProvider, TooltipTrigger} from '../ui/tooltip';
import {Tooltip} from "@/components/ui/tooltip";
import LoaderIcon from "@/components/ui/Loading/LoaderIcon";

interface Props {
    open: boolean;
    openChange: () => void;
    items: ImageObject[];
    selectedKeys: string[];
    setSelectedKeys: (keys: string[]) => void;
    isOpenModalEdit: (key: string) => void;
    onRequestDelete: () => void;
    canReorder?: boolean;
    onSaveOrder?: (newOrder: ImageObject[]) => void;
    keyBy?: 'id' | 'image';
    selectionMode: boolean;
    setSelectionMode: (value: boolean) => void;
    deleteLoading: boolean,
    updateLoading?: boolean,
}

const SortableImage: React.FC<{
    item: ImageObject;
    id: string;
    isSelected: boolean;
    selectionMode: boolean;
    toggleSelect: (id: string) => void;
    isOpenModalEdit: (id: string) => void;
    onRequestDelete: (id: string) => void;
    canReorder: boolean;
    deleteLoading: boolean;
}> = ({item, id, isSelected, selectionMode, toggleSelect, isOpenModalEdit, onRequestDelete, canReorder, deleteLoading}) => {
    const {attributes, listeners, setNodeRef, transform, transition, isDragging} = useSortable({id});

    const style = {
        transform: CSS.Transform.toString(transform),
        transition: transition
            ? 'transform 400ms cubic-bezier(0.22, 1, 0.36, 1)'
            : undefined,
        zIndex: isDragging ? 99 : undefined,
        boxShadow: isDragging ? '0 4px 20px rgba(0,0,0,0.3)' : undefined,
        border: isDragging ? '2px solid #3b82f6' : undefined,
    };

    const imageUrl = API_BASE_URL + '/' + item.image;

    return (
        <Card
            ref={canReorder ? setNodeRef : undefined}
            style={canReorder ? style : undefined}
            className={`w-full h-full relative transition ${selectionMode ? "cursor-pointer" : ""} ${isSelected ? "ring-2 ring-primary" : ""}`}
        >
            {canReorder && !selectionMode && (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="outline"
                                {...attributes}
                                {...listeners}
                                className="p-1 cursor-move absolute top-4 left-4 w-8 h-8 flex items-center justify-center rounded z-[100] ">
                                <GripVertical className="w-10 h-10"/>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right" align="center">
                            Зажмите чтобы перетащить изображение
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )}

            <a
                href={imageUrl}
                onClick={(e) => {
                    e.preventDefault();
                    if (selectionMode) {
                        toggleSelect(id);
                    }
                }}
                className={`block relative w-full h-48 rounded-t overflow-hidden ${selectionMode ? "cursor-pointer" : "cursor-default"}`}
            >
                {selectionMode && (
                    <div className="absolute z-10 top-2 left-2">
                        <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => toggleSelect(id)}
                        />
                    </div>
                )}
                <Image
                    src={imageUrl}
                    alt={item.alt || "Нет альтернативного названия"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                />
            </a>

            <CardContent className="flex-1">
                <div className="text-sm text-gray-700 line-clamp-2">{item.alt || "Нет альтернативного названия"}</div>
            </CardContent>

            <CardFooter className="flex justify-between gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => isOpenModalEdit(id)}
                    disabled={selectionMode}
                >
                    Редактировать
                </Button>
                <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onRequestDelete(id)}
                    disabled={selectionMode || deleteLoading}
                >
                    Удалить
                </Button>
            </CardFooter>
        </Card>
    );
};

const ModalGallery: React.FC<Props> = ({
                                           open,
                                           openChange,
                                           items,
                                           selectedKeys,
                                           setSelectedKeys,
                                           isOpenModalEdit,
                                           onRequestDelete,
                                           canReorder = false,
                                           keyBy = 'id',
                                           selectionMode,
                                           setSelectionMode,
                                           onSaveOrder,
                                           deleteLoading,
                                           updateLoading
                                       }) => {

    const [currentItems, setCurrentItems] = useState(items);

    useEffect(() => {
        setCurrentItems(items);
    }, [items]);

    const getKey = (item: ImageObject): string => {
        const key = keyBy === 'id' ? item._id : item.image;
        if (!key) throw new Error('Ключ элемента не определен');
        return key;
    };

    const toggleSelect = (key: string) => {
        if (selectedKeys.includes(key)) {
            setSelectedKeys(selectedKeys.filter(_id => _id !== key));
        } else {
            setSelectedKeys([...selectedKeys, key]);
        }
    };

    const clearSelection = () => {
        setSelectedKeys([]);
        setSelectionMode(false);
    };

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const {active, over} = event;
        if (active.id !== over?.id) {
            const oldIndex = currentItems.findIndex(i => getKey(i) === active.id);
            const newIndex = currentItems.findIndex(i => getKey(i) === over?.id);
            const newOrder = arrayMove(currentItems, oldIndex, newIndex);
            setCurrentItems(newOrder);
        }
    };

    const content = (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto p-2">
            {currentItems.map((item) => {
                const key = getKey(item);
                return (
                    <SortableImage
                        key={key}
                        id={key}
                        item={item}
                        isSelected={selectedKeys.includes(key)}
                        selectionMode={selectionMode}
                        toggleSelect={toggleSelect}
                        isOpenModalEdit={isOpenModalEdit}
                        onRequestDelete={(id) => {
                            setSelectedKeys([id]);
                            onRequestDelete();
                        }}
                        deleteLoading={deleteLoading}
                        canReorder={canReorder}
                    />
                );
            })}
        </div>
    );

    return (
        <Dialog open={open} onOpenChange={() => {
            clearSelection();
            openChange();
        }}>
            <DialogContent aria-describedby={undefined} className="!w-auto !max-w-6xl">
                <DialogHeader className="flex justify-between items-center gap-4">
                    <DialogTitle>Галерея</DialogTitle>
                    <div className="flex gap-2">
                        {selectionMode ? (
                            <>
                                <Button
                                    variant="destructive"
                                    disabled={selectedKeys.length === 0 || deleteLoading}
                                    onClick={onRequestDelete}
                                >
                                    {deleteLoading && <LoaderIcon/>}
                                    Удалить выбранные ({selectedKeys.length})
                                </Button>
                                <Button variant="outline" onClick={clearSelection}>
                                    Отменить выбор
                                </Button>
                            </>
                        ) : (
                            <Button variant="outline" onClick={() => setSelectionMode(true)}>
                                Выбрать элементы
                            </Button>
                        )}

                        {canReorder && onSaveOrder && !selectionMode &&(
                            <Button
                                variant="default"
                                size="sm"
                                onClick={() => onSaveOrder(currentItems)}
                                disabled={updateLoading}
                            >
                                {updateLoading && <LoaderIcon/>}
                                Сохранить порядок
                            </Button>
                        )}

                    </div>
                </DialogHeader>

                {currentItems.length > 0 ? (
                    canReorder ? (
                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                            <SortableContext items={currentItems.map(getKey)} strategy={verticalListSortingStrategy}>
                                {content}
                            </SortableContext>
                        </DndContext>
                    ) : content
                ) : (
                    <p>Нет изображений в галереи</p>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default ModalGallery;