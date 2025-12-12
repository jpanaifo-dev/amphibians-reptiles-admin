'use client';

import { ITaxonomyClass } from '@/lib/definitions';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
import { ConfirmAlertDialog } from '@/components/app/confirm-alert-dialog';
import { ClassForm } from './class-form';
import { deleteClassAction, updateClassAction } from '../actions';
import { useRouter } from '@/i18n/routing';

interface ClassListProps {
    items: ITaxonomyClass[];
}

export function ClassList({ items }: ClassListProps) {
    const router = useRouter();
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [editItem, setEditItem] = useState<ITaxonomyClass | undefined>(undefined);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            const res = await deleteClassAction(deleteId);
            if (res.success) {
                toast.success(res.message);
                router.refresh();
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            toast.error('Error al eliminar la clase');
        }
    }

    const handleEditSubmit = async (data: { name: string; status: number }) => {
        if (!editItem) return;
        setIsSubmitting(true);
        try {
            const res = await updateClassAction(editItem.id, data);
            if (res.success) {
                toast.success(res.message);
                router.refresh();
                setIsEditOpen(false);
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            toast.error('Error al actualizar la clase');
        } finally {
            setIsSubmitting(false);
        }
    }

    const openEdit = (item: ITaxonomyClass) => {
        setEditItem(item);
        setIsEditOpen(true);
    }

    return (
        <>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    No se encontraron resultados.
                                </TableCell>
                            </TableRow>
                        ) : (
                            items.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.id}</TableCell>
                                    <TableCell className="font-medium">{item.name}</TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${item.status === 2 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {item.status === 2 ? 'Publicado' : 'Borrador'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => openEdit(item)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setDeleteId(item.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <ConfirmAlertDialog
                open={!!deleteId}
                onOpenChange={(open) => !open && setDeleteId(null)}
                title="¿Estás seguro?"
                description="Esta acción no se puede deshacer. Esto eliminará permanentemente la clase."
                confirmText="Eliminar"
                cancelText="Cancelar"
                confirmVariant="destructive"
                onConfirm={handleDelete}
            />

            <ClassForm
                open={isEditOpen}
                onOpenChange={setIsEditOpen}
                initialData={editItem}
                onSubmit={handleEditSubmit}
                isSubmitting={isSubmitting}
            />
        </>
    );
}
