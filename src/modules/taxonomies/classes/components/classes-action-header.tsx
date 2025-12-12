'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { ClassForm } from './class-form'
import { createClassAction } from '../actions'
import { toast } from 'sonner'
import { useRouter } from '@/i18n/routing'

export function ClassesActionHeader() {
    const [open, setOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()

    const handleSubmit = async (data: { name: string; status: number }) => {
        setIsSubmitting(true)
        try {
            const res = await createClassAction(data)
            if (res.success) {
                toast.success(res.message)
                router.refresh()
                setOpen(false)
            } else {
                toast.error(res.message)
            }
        } catch (error) {
            toast.error('Error inesperado')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            <Button onClick={() => setOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Nueva Clase
            </Button>
            <ClassForm
                open={open}
                onOpenChange={setOpen}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
            />
        </>
    )
}
