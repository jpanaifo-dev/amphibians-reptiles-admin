import { LayoutWrapper } from '@/components/layouts/layout-wrapper'
import { AdvancedFilterHorizontal } from '@/components/app/advanced-filter-horizontal'
import { ClassesActionHeader } from '@/modules/taxonomies/classes/components/classes-action-header'

interface ClassesLayoutProps {
    children: React.ReactNode
}

export default function Layout({ children }: ClassesLayoutProps) {
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
                        ]}
                        searchFields={[{ key: 'name', label: 'Nombre' }]}
                        hiddenSearchInput
                    />
                    <ClassesActionHeader />
                </div>
                {children}
            </div>
        </LayoutWrapper>
    )
}
