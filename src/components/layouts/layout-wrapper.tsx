import { Separator } from "@/components/ui/separator"

interface LayoutWrapperProps {
    children: React.ReactNode
    sectionTitle: string
}

export function LayoutWrapper({ children, sectionTitle }: LayoutWrapperProps) {
    return (
        <div className="flex flex-col gap-4 p-4 lg:p-6 w-full">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-medium">{sectionTitle}</h1>
            </div>
            <Separator />
            {children}
        </div>
    )
}
