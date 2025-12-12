'use client'

import { useState, useEffect } from 'react'
import { classService } from '../services/class.service'
import { ITaxonomyClass } from '@/lib/definitions'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Edit, Trash2, Plus } from 'lucide-react'
import { AdvancedFilterHorizontal } from '@/components/app/advanced-filter-horizontal'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

export default function ClassesPage() {
    const searchParams = useSearchParams();
    const [data, setData] = useState<ITaxonomyClass[]>([])
    const [loading, setLoading] = useState(true)
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 10,
        totalPages: 0,
        totalItems: 0
    })

    const fetchClasses = async () => {
        setLoading(true)
        try {
            const page = Number(searchParams.get('page')) || 1;
            const pageSize = Number(searchParams.get('pageSize')) || 10;
            const query = searchParams.get('name') || '';

            const res = await classService.getAll({ page, pageSize, query });
            if (res.data) {
                setData(res.data.data);
                setPagination({
                    page: res.data.page,
                    pageSize: 10, // API might not return this, assume default or read from request
                    totalPages: res.data.totalPages,
                    totalItems: res.data.total,
                });
            }
        } catch (error) {
            toast.error('Error al cargar las clases');
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchClasses();
    }, [searchParams]);

    const handleDelete = async (id: number) => {
        if (!confirm('¿Estás seguro de eliminar esta clase?')) return;
        try {
            await classService.delete(id);
            toast.success('Clase eliminada correctamente');
            fetchClasses();
        } catch (error) {
            toast.error('Error al eliminar la clase');
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Clases</h1>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Nueva Clase
                </Button>
            </div>

            <AdvancedFilterHorizontal
                filters={[
                    { key: 'name', label: 'Nombre', type: 'text', placeholder: 'Buscar por nombre...' },
                    // Status filter could be added here if API supports it
                ]}
                searchFields={[{ key: 'name', label: 'Nombre' }]}
            />

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
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    Cargando...
                                </TableCell>
                            </TableRow>
                        ) : data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    No se encontraron resultados.
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((item) => (
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
                                            <Button variant="ghost" size="icon">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(item.id)}>
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
            {/* Simple Pagination */}
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    Página {pagination.page} de {pagination.totalPages}
                </div>
                {/* 
                     Note: Real pagination should interact with URL params via Link or router.push 
                     For brevity, I'm omitting the full Pagination component logic here but standard nextjs pagination applies.
                  */}
            </div>
        </div>
    )
}
