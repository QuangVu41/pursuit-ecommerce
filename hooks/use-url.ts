import { usePathname, useSearchParams, useRouter } from 'next/navigation';

const useUrl = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  return { router, pathname, searchParams };
};

export { useUrl };
