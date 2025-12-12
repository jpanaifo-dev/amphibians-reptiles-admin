import { PaginationCustom } from '@/components/app/pagination-custom'
import { ClassList } from '@/modules/taxonomies/classes/components/class-list'
import { classService } from '@/modules/taxonomies/classes/services/class.service'
import { SearchParams } from '@/lib/definitions' // Make sure SearchParams is compatible or redefine locally

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Page({ searchParams }: PageProps) {
    const params = await searchParams;
    const page = params?.page ? parseInt(params.page as string, 10) : 1
    const limit = params?.pageSize ? parseInt(params.pageSize as string, 10) : 10
    const query = params?.name as string || params?.query as string || ''

    try {
        const response = await classService.getAll({
            page,
            pageSize: limit,
            query,
        });

        return (
            <>
                <ClassList items={response.data?.data || []} />
                <PaginationCustom
                    totalPages={response.data?.totalPages || 1}
                    page={response.data?.page || 1}
                    limit={limit}
                    total={response.data?.total || 0}
                />
            </>
        )
    } catch (error) {
        return (
            <div className="text-center py-10 text-red-500">
                Error al cargar los datos. Por favor intente nuevamente.
            </div>
        )
    }
}
