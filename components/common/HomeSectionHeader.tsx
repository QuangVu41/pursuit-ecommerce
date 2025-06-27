import { Button } from '@/components/ui/button';
import SectionHeader from '@/components/common/SectionHeader';
import SectionTitle from '@/components/common/SectionTitle';
import Link from 'next/link';

interface HomeSectionHeaderProps {
  title: string;
  description?: string;
  buttonLink?: string;
}

const HomeSectionHeader = ({ title, description, buttonLink }: HomeSectionHeaderProps) => {
  return (
    <SectionHeader className='items-start md:items-end flex-col md:flex-row'>
      <div className='flex flex-col gap-y-[18px] max-w-[500px]'>
        <SectionTitle title={title} className='font-bold text-2xl md:text-3xl' />
        {description && <p className='text-base text-home-foreground'>{description}</p>}
      </div>
      {buttonLink && (
        <Button variant='homeOutline' size='homeDefault' asChild className='hidden md:flex text-lg'>
          <Link href={buttonLink}>Browse All</Link>
        </Button>
      )}
    </SectionHeader>
  );
};

export default HomeSectionHeader;
