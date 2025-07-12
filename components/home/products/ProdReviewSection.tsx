import { Progress } from '@/components/ui/progress';
import ProdReviewForm from '@/components/home/products/ProdReviewForm';
import { checkIfUserHasPurchasedProduct } from '@/services/products';
import { getNumReviews, getProductReviews, hasReviewedProduct } from '@/services/reviews';
import { Star } from 'lucide-react';

interface ProdReviewSectionProps {
  productId: string;
}

const ProdReviewSection = async ({ productId }: ProdReviewSectionProps) => {
  const hasPurchased = await checkIfUserHasPurchasedProduct(productId);
  const hasReviewed = await hasReviewedProduct(productId);
  const reviews = await getProductReviews(productId);
  const numReviews = await getNumReviews(productId);

  return (
    <section className='flex flex-col md:flex-row md:items-start gap-4 sm:gap-8'>
      <div className='grid gap-y-3 flex-1'>
        <h3 className='text-lg font-bold uppercase'>Customer reviews</h3>
        <span>
          {numReviews} review{numReviews > 1 ? 's' : ''}
        </span>
        <div className='grid gap-y-2 md:gap-y-4'>
          {Array.from({ length: 5 }, (_, idx) => {
            const reviewsPerRating = reviews.filter((review) => review.rating === 5 - idx);

            return (
              <div key={idx} className='flex items-center gap-x-2'>
                <div className='flex items-center'>
                  {5 - idx}
                  <Star className='size-4 stroke-yellow-500 fill-yellow-500' />
                </div>
                <Progress value={(reviewsPerRating.length * 100) / reviews.length} />
                {reviewsPerRating.length}
              </div>
            );
          })}
        </div>
      </div>
      <ProdReviewForm hasPurchased={hasPurchased} hasReviewed={hasReviewed} productId={productId} />
    </section>
  );
};

export default ProdReviewSection;
