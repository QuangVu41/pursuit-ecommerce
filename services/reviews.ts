import { getUserSession } from '@/auth';
import { db } from '@/lib/db';
import { ReviewSchemaType } from '@/schemas/review';
import { Prisma } from '@prisma/client';
import { subDays } from 'date-fns';

export const hasReviewedProduct = async (productId: string) => {
  const user = await getUserSession();

  if (!user) return false;

  const review = await db.review.findUnique({
    where: {
      userId_productId: {
        userId: user.id as string,
        productId,
      },
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

export const getUserTotalReview = async (searchParams: { [key: string]: string }) => {
  const user = await getUserSession();
  let { sortBy } = searchParams;

  if (!sortBy) sortBy = '7';

  const where: Prisma.ReviewWhereInput = {
    product: {
      userId: user?.id,
    },
    createdAt: {
      gte: subDays(new Date(), parseInt(sortBy)),
      lte: new Date(),
    },
  };

  const totalRevenue = await db.review.aggregate({
    _count: true,
    where,
  });

  return totalRevenue._count || 0;
};

export const getUserAverageRating = async (searchParams: { [key: string]: string }) => {
  const user = await getUserSession();
  let { sortBy } = searchParams;

  if (!sortBy) sortBy = '7';

  const where: Prisma.ReviewWhereInput = {
    product: {
      userId: user?.id,
    },
    createdAt: {
      gte: subDays(new Date(), parseInt(sortBy)),
      lte: new Date(),
    },
  };

  const totalRevenue = await db.review.aggregate({
    _avg: {
      rating: true,
    },
    where,
  });

  return totalRevenue._avg.rating || 0;
};
