import SectionContainer from '@/components/common/SectionContainer';
import { cn } from '@/lib/utils';
import Container from '@/components/common/Container';

interface HomeSectionContainerProps {
  children: React.ReactNode;
  className?: string;
  ctnClassName?: string;
}

const HomeSectionContainer = ({ children, className, ctnClassName }: HomeSectionContainerProps) => {
  return (
    <SectionContainer
      className={cn('bg-background mt-[40px] md:mt-[60px] py-0 px-2 rounded-none shadow-none gap-0', className)}
    >
      <Container className={ctnClassName}>{children}</Container>
    </SectionContainer>
  );
};

export default HomeSectionContainer;
