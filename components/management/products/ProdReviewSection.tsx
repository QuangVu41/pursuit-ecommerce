import { deleteReviewAct } from '@/actions/reviews';
import DeleteConfirm from '@/components/common/DeleteConfirm';
import Empty from '@/components/common/Empty';
import ModalPopup from '@/components/common/ModalPopup';
import SectionContainer from '@/components/common/SectionContainer';
import SectionContent from '@/components/common/SectionContent';
import SectionHeader from '@/components/common/SectionHeader';
import SectionTitle from '@/components/common/SectionTitle';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProductReviewWithPayload } from '@/types/products';
import { Star, Trash2 } from 'lucide-react';

interface ProdReviewSectionProps {
  prodReviews: ProductReviewWithPayload[];
}

const ProdReviewSection = ({ prodReviews }: ProdReviewSectionProps) => {
  return (
    <SectionContainer>
      <SectionHeader>
        <SectionTitle title='Product reviews' />
      </SectionHeader>
      <SectionContent className='!mt-4 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
        {prodReviews.length > 0 ? (
          prodReviews.map((review) => (
            <Card key={review.id}>
              <CardHeader>
                <CardTitle className='font-manrope truncate'>{review.user.name}</CardTitle>
                <CardDescription>{review.title}</CardDescription>
                <CardAction>
                  <ModalPopup
                    title='Delete Review'
                    content={
                      <DeleteConfirm
                        id={review.id}
                        confirmText='Are you sure you want to delete this review?'
                        serverAction={deleteReviewAct}
                      />
                    }
                  >
                    <Button type='button' variant='destructive' size='icon'>
                      <Trash2 />
                    </Button>
                  </ModalPopup>
                </CardAction>
              </CardHeader>
              <CardContent>
                <span className='flex items-center gap-0.5'>
                  {Array.from({ length: review.rating }).map((_, idx) => (
                    <Star key={idx} className='size-4 stroke-yellow-500 fill-yellow-500' />
                  ))}
                  {Array.from({ length: 5 - review.rating }).map((_, idx) => (
                    <Star key={idx} className='size-4 stroke-gray-300' />
                  ))}
                </span>
                {review.content}
              </CardContent>
            </Card>
          ))
        ) : (
          <Empty title='No reviews yet!' />
        )}
      </SectionContent>
    </SectionContainer>
  );
};

export default ProdReviewSection;
