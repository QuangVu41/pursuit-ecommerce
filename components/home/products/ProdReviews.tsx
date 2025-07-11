import { getProductReviews } from '@/services/reviews';
import { Star } from 'lucide-react';
import Image from 'next/image';

interface ProdReviewsProps {
  productId: string;
}

const ProdReviews = async ({ productId }: ProdReviewsProps) => {
  const reviews = await getProductReviews(productId);

  return (
    reviews.length > 0 && (
      <div className='grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {reviews.map((review) => (
          <div key={review.id} className='flex flex-col gap-2 p-4 shadow-md border'>
            <div className='flex items-start gap-2'>
              <figure className='relative size-12 rounded-full overflow-hidden'>
                <Image
                  src={review.user.image || '/default-avatar.png'}
                  alt={review.user.name as string}
                  width={48}
                  height={48}
                  className='absolute inset-0 w-full h-full object-cover'
                />
              </figure>
              <div className='flex flex-col gap-1'>
                <h3 className='font-medium whitespace-nowrap'>{review.user.name}</h3>
                <span className='flex items-center gap-0.5'>
                  {Array.from({ length: review.rating }).map((_, idx) => (
                    <Star key={idx} className='size-4 stroke-yellow-500 fill-yellow-500' />
                  ))}
                  {Array.from({ length: 5 - review.rating }).map((_, idx) => (
                    <Star key={idx} className='size-4 stroke-gray-300' />
                  ))}
                </span>
              </div>
            </div>
            <h4 className='text-lg font-medium whitespace-nowrap'>{review.title}</h4>
            <p className='text-sm'>{review.content}</p>
          </div>
        ))}
      </div>
    )
  );
};

export default ProdReviews;
