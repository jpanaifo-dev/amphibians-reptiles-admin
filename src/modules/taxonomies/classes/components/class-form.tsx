'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { ITaxonomyClass, CreateClassDto } from '@/lib/definitions'
import { useEffect } from 'react'

const classSchema = z.object({
    name: z.string().min(1, 'El nombre es obligatorio'),
    status: z.coerce.number().int().default(1),
})

type ClassFormValues = z.infer<typeof classSchema>

interface ClassFormProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    initialData?: ITaxonomyClass
    onSubmit: (data: ClassFormValues) => Promise<void>
    isSubmitting?: boolean
}

export function ClassForm({
    open,
    onOpenChange,
    initialData,
    onSubmit,
    isSubmitting = false,
}: ClassFormProps) {
    const form = useForm<any>({
        resolver: zodResolver(classSchema),
        defaultValues: {
            name: '',
            status: 1,
        },
    })

    // Reset form when initialData changes or dialog opens
    useEffect(() => {
        if (open) {
            form.reset({
                name: initialData?.name || '',
                status: initialData?.status || 1,
            })
        }
    }, [open, initialData, form])

    const handleSubmit = async (values: ClassFormValues) => {
        await onSubmit(values)
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {initialData ? 'Editar Clase' : 'Nueva Clase'}
                    </DialogTitle>
                    <DialogDescription>
                        {initialData
                            ? 'Realiza cambios en la clase aquí. Haz clic en guardar cuando termines.'
                            : 'Agrega una nueva clase a la taxonomía. Haz clic en guardar cuando termines.'}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ej. Amphibia" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {
                            !initialData && (
                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Estado</FormLabel>
                                            <Select
                                                onValueChange={(val) => field.onChange(Number(val))}
                                                value={String(field.value)}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className='w-full'>
                                                        <SelectValue placeholder="Selecciona un estado" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="2">Publicado</SelectItem>
                                                    <SelectItem value="1">Borrador</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )
                        }
                        <DialogFooter>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Guardando...' : 'Guardar'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
