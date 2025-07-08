'use server';

import { getUserSession } from '@/auth';
import { catchAsync } from '@/lib/catchAsync';
import { APP_FEE_AMOUNT } from '@/lib/constants';
import { ExpectedError } from '@/lib/errors';
import { convertVndToUsd } from '@/lib/helpers';
import { stripe } from '@/lib/stripe';
import { AddToCartSchema, AddToCartSchemaType } from '@/schemas/products';
import { getProdVariantByAttrIds } from '@/services/products';
import { getUserById } from '@/services/users';
import { redirect } from 'next/navigation';

export type prodDataItem = {
  prodName: string;
  productVariantId: string;
  accountId: string;
  quantity: number;
  accountFund: number;
};

export const purchaseProduct = catchAsync(async (data: AddToCartSchemaType) => {
  const user = await getUserSession();
  const validatedFields = AddToCartSchema.safeParse(data);

  if (!validatedFields.success) {
    return { error: `Invalid Fields! ${validatedFields.error.errors.map((err) => err.message).join(', ')}` };
  }

  const { productId, firstAttrId, secondAttrId, quantity } = validatedFields.data;
  let prodVariant = await getProdVariantByAttrIds(productId, firstAttrId, secondAttrId);
  const applicationFeeAmount = prodVariant!.price * quantity * APP_FEE_AMOUNT;
  const accountFund = Math.round(await convertVndToUsd(prodVariant!.price * quantity - applicationFeeAmount)) * 100;

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
    metadata: {
      prodData: JSON.stringify([
        {
          prodName: prodVariant?.product.name,
          productVariantId: prodVariant?.id,
          accountId: prodVariant?.product.user.connectedAccountId as string,
          quantity,
          accountFund,
        },
      ]),
      applicationFeeAmount,
      userId: user?.id as string,
    },
    success_url: `${process.env.APP_URL}/payment/success`,
    cancel_url: `${process.env.APP_URL}/payment/cancel`,
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
    refresh_url: `${process.env.APP_URL}/billing`,
    return_url: `${process.env.APP_URL}/return/${userPayload?.connectedAccountId}`,
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
