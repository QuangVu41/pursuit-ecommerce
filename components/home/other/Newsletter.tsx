import HomeSectionContainer from '@/components/common/HomeSectionContainer';
import NewsletterInput from './NewsletterInput';

const Newsletter = () => {
  return (
    <HomeSectionContainer className='bg-home-primary py-6 md:py-[100px]'>
      <div className='flex flex-col items-center gap-y-3 relative text-muted'>
        <h2 className='text-3xl lg:text-[42px] font-bold text-center'>Subscribe our newsletter</h2>
        <p className='text-base lg:text-lg max-w-[400px] text-center'>
          Receive latest news, update, and many other things every week.
        </p>
        <NewsletterInput />
      </div>
    </HomeSectionContainer>
  );
};

export default Newsletter;
