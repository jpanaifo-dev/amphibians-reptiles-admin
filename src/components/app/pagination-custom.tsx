'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis
} from '@/components/ui/pagination'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'

interface UrlPaginationProps {
  totalPages: number
  limit?: number
  page?: number
  total?: number
  className?: string
  siblingCount?: number
}

export const PaginationCustom = ({
  totalPages,
  limit,
  page,
  total,
  className,
  siblingCount = 1
}: UrlPaginationProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const parsedQueryPage = Number.parseInt(searchParams.get('page') || '1', 10)
  const currentFromQuery = Number.isNaN(parsedQueryPage) ? 1 : parsedQueryPage
  const currentPage = page ?? currentFromQuery
  const validPage = Math.max(1, Math.min(currentPage, totalPages))

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()))
    if (newPage === 1) {
      params.delete('page')
    } else {
      params.set('page', String(newPage))
    }

    // include limit param when provided via props (keeps it consistent)
    if (limit !== undefined) {
      params.set('limit', String(limit))
    }

    const query = params.toString()
    router.push(query ? `?${query}` : '?')
  }

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const leftSibling = Math.max(validPage - siblingCount, 1)
    const rightSibling = Math.min(validPage + siblingCount, totalPages)

    if (leftSibling > 1) {
      pages.push(1)
      if (leftSibling > 2) {
        pages.push('...')
      }
    }

    for (let i = leftSibling; i <= rightSibling; i++) {
      pages.push(i)
    }

    if (rightSibling < totalPages) {
      if (rightSibling < totalPages - 1) {
        pages.push('...')
      }
      pages.push(totalPages)
    }

    return pages
  }

  const canGoPrevious = validPage > 1
  const canGoNext = validPage < totalPages
  const pageNumbers = getPageNumbers()

  return (
    <div
      className={cn(
        'flex items-center w-full justify-between p-4',
        'flex-col md:flex-row gap-4',
        className
      )}
    >
      <div className="text-sm text-muted-foreground flex items-center w-full justify-center md:justify-start">
        <p>
          Página{' '}
          <span className="font-semibold text-foreground"> {validPage} </span>{' '}
          de{' '}
          <span className="font-semibold text-foreground"> {totalPages} </span>
          {typeof total === 'number' && (
            <>
              {' '}
              · Total{' '}
              <span className="font-semibold text-foreground">{total}</span>
            </>
          )}
          {typeof limit === 'number' && (
            <>
              {' '}
              · por página{' '}
              <span className="font-semibold text-foreground">{limit}</span>
            </>
          )}
        </p>
      </div>

      <Pagination className="w-fit">
        <PaginationContent>
          <PaginationItem>
            <Button
              onClick={(e) => {
                e.preventDefault()
                if (canGoPrevious) {
                  handlePageChange(validPage - 1)
                }
              }}
              className={
                !canGoPrevious
                  ? 'pointer-events-none opacity-50'
                  : 'cursor-pointer'
              }
              size="icon"
              variant="outline"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </PaginationItem>

          {pageNumbers.map((p, index) => (
            <PaginationItem key={index}>
              {p === '...' ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    handlePageChange(p as number)
                  }}
                  isActive={p === validPage}
                  className="cursor-pointer"
                >
                  {p}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <Button
              onClick={(e) => {
                e.preventDefault()
                if (canGoNext) {
                  handlePageChange(validPage + 1)
                }
              }}
              className={
                !canGoNext ? 'pointer-events-none opacity-50' : 'cursor-pointer'
              }
              size="icon"
              variant="outline"
            >
              <ChevronLeft className="h-4 w-4 rotate-180" />
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
