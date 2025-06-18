import HomeSectionContainer from '@/components/common/HomeSectionContainer';
import FooterRating from '@/components/home/footer/FooterRating';
import { Separator } from '@/components/ui/separator';
import FooterNav from './FooterNav';

const Footer = () => {
  return (
    <HomeSectionContainer className='!mt-0 bg-foreground pt-10 lg:pt-14 pb-7'>
      <FooterRating />
      <Separator className='my-5 md:my-7 bg-muted/70' />
      <FooterNav />
    </HomeSectionContainer>
  );
};

export default Footer;
