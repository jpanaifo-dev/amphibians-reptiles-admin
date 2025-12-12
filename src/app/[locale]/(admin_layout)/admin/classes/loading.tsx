import TopicsTableSkeleton from '@/components/app/topics-table-skeleton'

export default function Loading() {
    return (
        <div className="w-full">
            <TopicsTableSkeleton rowCount={10} />
        </div>
    )
}
