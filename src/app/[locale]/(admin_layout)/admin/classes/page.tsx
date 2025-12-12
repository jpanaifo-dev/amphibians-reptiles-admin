import { PaginationCustom } from "@/components/app/pagination-custom";
import { ClassList } from "@/modules/taxonomies/classes/components/class-list";
import { classService } from "@/modules/taxonomies/classes/services/class.service";
import { SearchParams } from "@/types/core";

interface PageProps {
  searchParams: SearchParams;
}

export default async function Page(props: PageProps) {
  const searchParams = await props.searchParams;
  const params = await searchParams;
  const page = params?.page ? parseInt(params.page as string, 10) : 1;
  const limit = params?.pageSize ? parseInt(params.pageSize as string, 10) : 10;
  const query = (params?.name as string) || (params?.query as string) || "";

  const response = await classService.getAll({
    page,
    pageSize: limit,
    query,
  });

  return (
    <>
      <ClassList items={response.data || []} />
      <PaginationCustom
        totalPages={response.totalPages || 1}
        page={response.page || 1}
        limit={limit}
        total={response.total || 0}
      />
    </>
  );
}
