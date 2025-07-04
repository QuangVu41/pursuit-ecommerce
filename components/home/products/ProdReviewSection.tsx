import { Progress } from '@/components/ui/progress';
import starImg from '@/public/star.svg';
import Image from 'next/image';

const ProdReviewSection = () => {
  return (
    <section className='grid sm:grid-cols-2 mt-10'>
      <div className='grid gap-y-3'>
        <h3 className='text-lg font-bold uppercase'>Customer reviews</h3>
        <span>0 reviews</span>
        <div className='grid gap-y-4'>
          {Array.from({ length: 5 }, (_, idx) => (
            <div key={idx} className='flex items-center gap-x-2'>
              <div className='flex items-center'>
                {5 - idx}
                <Image src={starImg} alt={`Start img ${idx}`} className='size-5' />
              </div>
              <Progress value={5 - idx} />
              {5 - idx}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProdReviewSection;
