'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { flattenNestedArray } from '@/lib/helpers';
import { dashboardLinks } from '@/lib/links';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { Fragment } from 'react';

const BreadcrumbNav = () => {
  const params = useParams();
  let { slug } = params;
  slug = slug && decodeURIComponent(slug as string);
  const pathname = usePathname();

  const breadcrumbLinks = flattenNestedArray(dashboardLinks, 'subMenu').filter((link) => pathname.includes(link.href));

  return (
    <Breadcrumb className='flex items-center gap-x-1'>
      <BreadcrumbList>
        {breadcrumbLinks.map((link) => {
          if (link.href === pathname)
            return (
              <Fragment key={link.label}>
                {breadcrumbLinks.length > 1 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  <BreadcrumbPage>{link.label}</BreadcrumbPage>
                </BreadcrumbItem>
              </Fragment>
            );
          return (
            <Fragment key={link.label}>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={link.href}>{link.label}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              {slug && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className='capitalize'>{(slug as string).replaceAll('-', ' ')}</BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadcrumbNav;
