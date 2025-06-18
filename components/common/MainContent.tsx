'use client';

import { cn } from '@/lib/utils';

interface MainContentProps {
  children: React.ReactNode;
  className?: string;
}

const MainContent = ({ children, className }: MainContentProps) => {
  return <div className={cn(`flex flex-1 flex-col gap-4 p-4`, className)}>{children}</div>;
};

export default MainContent;
