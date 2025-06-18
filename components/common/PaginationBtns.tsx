import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { MAX_DISPLAY_PAGE, RECORDS_PER_PAGE } from '@/lib/constants';

interface PaginationBtnsProps {
  searchParams: { [key: string]: string };
  count: number;
  segment: string;
}

const PaginationBtns = ({ searchParams, count, segment }: PaginationBtnsProps) => {
  const totalPages = Math.ceil(count / RECORDS_PER_PAGE);
  const urlSearchParams = new URLSearchParams(searchParams);
  let currentPage = parseInt(searchParams.page) || 1;
  currentPage = currentPage > totalPages ? 1 : currentPage;
  const startPage =
    currentPage < totalPages - MAX_DISPLAY_PAGE
      ? currentPage
      : totalPages - MAX_DISPLAY_PAGE > 0
      ? totalPages - MAX_DISPLAY_PAGE
      : 1;
  const endPage = Math.min(currentPage + MAX_DISPLAY_PAGE, totalPages);
  const buttons: React.ReactNode[] = [];
  const urlSegment = `${segment}?`;

  if (startPage > 2) {
    const isActive = currentPage === 1;
    urlSearchParams.set('page', '1');

    buttons.push(
      <>
        <PaginationItem key={startPage}>
          <PaginationLink href={`${urlSegment}${urlSearchParams}`} isActive={isActive}>
            1
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
      </>
    );
  }

  for (let i = startPage; i <= endPage; i++) {
    const isActive = currentPage === i;
    urlSearchParams.set('page', `${i}`);

    buttons.push(
      <PaginationItem key={i}>
        <PaginationLink
          href={`${urlSegment}${urlSearchParams}`}
          isActive={isActive}
          className={isActive ? 'pointer-events-none' : ''}
        >
          {i}
        </PaginationLink>
      </PaginationItem>
    );
  }

  if (endPage < totalPages - 1) {
    const isActive = currentPage === totalPages;
    urlSearchParams.set('page', `${totalPages}`);

    buttons.push(
      <>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem key={startPage}>
          <PaginationLink href={`${urlSegment}${urlSearchParams}`} isActive={isActive}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      </>
    );
  }

  return (
    <Pagination className='justify-center sm:justify-end'>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={`${urlSegment}${
              currentPage > 1 && `${new URLSearchParams({ ...searchParams, page: `${currentPage - 1}` })}`
            }`}
            className={`${currentPage === 1 && 'pointer-events-none opacity-50'}`}
          />
        </PaginationItem>
        {buttons}
        <PaginationItem>
          <PaginationNext
            href={`${urlSegment}${
              currentPage < totalPages && `${new URLSearchParams({ ...searchParams, page: `${currentPage + 1}` })}`
            }`}
            className={`${(currentPage === totalPages || totalPages === 0) && 'pointer-events-none opacity-50'}`}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationBtns;
