import { LayoutWrapper } from '@/components/layouts/layout-wrapper'
import { AdvancedFilterHorizontal } from '@/components/app/advanced-filter-horizontal'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'

interface ClassesLayoutProps {
    children: React.ReactNode
}

export default function Layout({ children }: ClassesLayoutProps) {
    // We can access useTranslations here for titles if needed
    // But context is server-side here usually, except this layout imports Client Components.
    // AdvancedFilterHorizontal is 'use client'.

    return (
        <LayoutWrapper sectionTitle="Clases">
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-start">
                    <AdvancedFilterHorizontal
                        filters={[
                            {
                                key: 'name',
                                type: 'text',
                                placeholder: 'Buscar por nombre...',
                                label: 'Nombre'
                            },
                            // Add Status filter if required, similar to user request example
                            /*
                            {
                                key: 'status',
                                type: 'select',
                                placeholder: 'Todos',
                                label: 'Estado',
                                options: [
                                    { value: '2', label: 'Publicado' },
                                    { value: '1', label: 'Borrador' }
                                ]
                            }
                            */
                        ]}
                        searchFields={[{ key: 'name', label: 'Nombre' }]}
                        hiddenSearchInput
                    />
                    <Button asChild>
                        <Link href="/admin/classes/new">
                            <Plus className="mr-2 h-4 w-4" /> Nueva Clase
                        </Link>
                    </Button>
                </div>
                {children}
            </div>
        </LayoutWrapper>
    )
}
