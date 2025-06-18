import { ProductWithPayLoad } from '@/types/products';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Link from 'next/link';

interface ProdBreadcrumbNavProps {
  prod: ProductWithPayLoad;
}

const ProdBreadcrumbNav = ({ prod }: ProdBreadcrumbNavProps) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link className='text-home-primary capitalize font-medium' href='/'>
              Pursuit
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {prod.category.parent && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  className='text-home-primary capitalize font-medium'
                  href={`/products?category=${prod.category.parent.id}`}
                >
                  {prod.category.parent.name}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </>
        )}
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link className='text-home-primary capitalize font-medium' href={`/products?category=${prod.category.id}`}>
              {prod.category.name}
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage className='capitalize font-semibold'>{prod.name}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default ProdBreadcrumbNav;
