import { getUserSession } from '@/auth';
import { db } from '@/lib/db';
import { ReviewSchemaType } from '@/schemas/review';

export const hasReviewedProduct = async (productId: string) => {
  const user = await getUserSession();

  if (!user) return false;

  const review = await db.review.findFirst({
    where: {
      userId: user.id,
      productId,
    },
  });

  return !!review;
};

export const createReview = async (data: ReviewSchemaType) => {
  const user = await getUserSession();

  if (!user) throw new Error('User not authenticated');

  const { content, productId, rating, title } = data;

  await db.review.create({
    data: {
      content,
      productId,
      rating,
      title,
      userId: user.id as string,
    },
  });
};

export const getProductReviews = async (productId: string) => {
  const reviews = await db.review.findMany({
    where: {
      productId,
    },
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });

  return reviews;
};

export const getNumReviews = async (productId: string) => {
  const reviews = await db.review.count({
    where: {
      productId,
    },
  });

  return reviews;
};

export const getAverageRating = async (productId: string) => {
  const reviews = await db.review.aggregate({
    _avg: {
      rating: true,
    },
    where: {
      productId,
    },
  });

  return reviews._avg.rating || 0;
};
