'use server';

import { catchAsync } from '@/lib/catchAsync';
import { ReviewSchema, ReviewSchemaType } from '@/schemas/review';
import { createReview, deleteReview } from '@/services/reviews';
import { revalidatePath } from 'next/cache';

export const createReviewAct = catchAsync(async (data: ReviewSchemaType) => {
  const validatedFields = ReviewSchema.safeParse(data);

  if (!validatedFields.success)
    return { error: `Invalid Fields! ${validatedFields.error.errors.map((err) => err.message).join(', ')}` };

  await createReview(validatedFields.data);

  revalidatePath(`/mng/products/${validatedFields.data.productId}`);
  return { success: 'Review created successfully!' };
});

export const deleteReviewAct = catchAsync(async (reviewId: string) => {
  await deleteReview(reviewId);

  revalidatePath(`/mng/products`);

  return { success: 'Review deleted successfully!' };
});
