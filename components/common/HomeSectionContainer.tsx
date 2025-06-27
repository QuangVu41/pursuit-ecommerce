import SectionContainer from '@/components/common/SectionContainer';
import { cn } from '@/lib/utils';

interface HomeSectionContainerProps {
  children: React.ReactNode;
  className?: string;
}

const HomeSectionContainer = ({ children, className }: HomeSectionContainerProps) => {
  return (
    <SectionContainer
      className={cn(
        'bg-background mt-[40px] md:mt-[60px] py-0 px-2 sm:px-6 lg:px-24 xl:px-32 rounded-none shadow-none gap-0',
        className
      )}
    >
      {children}
    </SectionContainer>
  );
};

export default HomeSectionContainer;
