'use server';

import { getUserSession } from '@/auth';
import { catchAsync } from '@/lib/catchAsync';
import { APP_FEE_AMOUNT } from '@/lib/constants';
import { db } from '@/lib/db';
import { ExpectedError } from '@/lib/errors';
import { stripe } from '@/lib/stripe';
import { AddToCartSchema, AddToCartSchemaType } from '@/schemas/products';
import { getUserById } from '@/services/users';
import { Prisma } from '@prisma/client';
import { redirect } from 'next/navigation';

export const purchaseProduct = catchAsync(async (data: AddToCartSchemaType) => {
  const validatedFields = AddToCartSchema.safeParse(data);

  if (!validatedFields.success) {
    return { error: `Invalid Fields! ${validatedFields.error.errors.map((err) => err.message).join(', ')}` };
  }

  const { productId, firstAttrId, secondAttrId, quantity } = validatedFields.data;
  let prodVariant: Prisma.ProductVariantGetPayload<{
    include: {
      product: {
        include: {
          productImages: {
            where: {
              isPrimary: true;
            };
          };
          user: {
            select: {
              connectedAccountId: true;
            };
          };
        };
      };
    };
  }> | null = null;

  if (secondAttrId) {
    prodVariant = await db.productVariant.findUnique({
      where: {
        productId_firstAttrId_secondAttrId: {
          productId,
          firstAttrId,
          secondAttrId,
        },
      },
      include: {
        product: {
          include: {
            productImages: {
              where: {
                isPrimary: true,
              },
            },
            user: {
              select: {
                connectedAccountId: true,
              },
            },
          },
        },
      },
    });
  } else {
    prodVariant = await db.productVariant.findFirst({
      where: {
        productId,
        firstAttrId,
        secondAttrId: null,
      },
      include: {
        product: {
          include: {
            productImages: {
              where: {
                isPrimary: true,
              },
            },
            user: {
              select: {
                connectedAccountId: true,
              },
            },
          },
        },
      },
    });
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'vnd',
          unit_amount: prodVariant?.price,
          product_data: {
            name: prodVariant?.product.name as string,
            description: prodVariant?.product.summary,
            images: prodVariant?.imageUrl
              ? [prodVariant?.imageUrl as string]
              : [prodVariant?.product.productImages[0].imageUrl as string],
          },
        },
        quantity: quantity,
      },
    ],
    payment_intent_data: {
      application_fee_amount: prodVariant!.price * quantity * APP_FEE_AMOUNT,
      transfer_data: {
        destination: prodVariant?.product.user.connectedAccountId as string,
      },
    },
    success_url: 'http://localhost:3000/payment/success',
    cancel_url: 'http://localhost:3000/payment/cancel',
  });

  return redirect(session.url as string);
});

export const createStripeAccountLink = catchAsync(async () => {
  const user = await getUserSession();
  const userId = user?.id;
  if (!userId) throw new ExpectedError('Unauthenticated!');

  const userPayload = await getUserById(userId);

  const accountLInk = await stripe.accountLinks.create({
    account: userPayload!.connectedAccountId as string,
    refresh_url: 'http://localhost:3000/billing',
    return_url: `http://localhost:3000/return/${userPayload?.connectedAccountId}`,
    type: 'account_onboarding',
  });

  return redirect(accountLInk.url);
});

export const getStripeDashboardLink = catchAsync(async () => {
  const user = await getUserSession();
  const userId = user?.id;
  if (!userId) throw new ExpectedError('Unauthenticated!');

  const userPayload = await getUserById(userId);

  const loginLink = await stripe.accounts.createLoginLink(userPayload?.connectedAccountId as string);

  return redirect(loginLink.url);
});
