'use server';

import { getUserSession } from '@/auth';
import { catchAsync } from '@/lib/catchAsync';
import { APP_FEE_AMOUNT } from '@/lib/constants';
import { db } from '@/lib/db';
import { ExpectedError } from '@/lib/errors';
import { calDiscountPrice, convertVndToUsd } from '@/lib/helpers';
import { stripe } from '@/lib/stripe';
import { AddToCartSchema, AddToCartSchemaType } from '@/schemas/products';
import { getProdVariantByAttrIds } from '@/services/products';
import { getUserById } from '@/services/user-queries';
import { redirect } from 'next/navigation';

export type ProdDataItem = {
  prodName: string;
  productVariantId: string;
  accountId: string;
  quantity: number;
  accountFund: number;
  platformFee: number;
  totalOrderItem: number;
};

export type ProdDataItemWithCart = ProdDataItem & {
  cartItemId: string;
};

export const purchaseProduct = catchAsync(async (data: AddToCartSchemaType) => {
  const user = await getUserSession();
  const validatedFields = AddToCartSchema.safeParse(data);

  if (!validatedFields.success) {
    return { error: `Invalid Fields! ${validatedFields.error.errors.map((err) => err.message).join(', ')}` };
  }

  const { productId, firstAttrId, secondAttrId, quantity } = validatedFields.data;
  let prodVariant = await getProdVariantByAttrIds(productId, firstAttrId, secondAttrId);
  const prodVariantDiscountPrice = calDiscountPrice(prodVariant.price, prodVariant.product.discountPercentage);
  const applicationFeeAmount = prodVariantDiscountPrice * quantity * APP_FEE_AMOUNT;
  const totalOrder = prodVariantDiscountPrice * quantity;
  const accountFund = Math.round(await convertVndToUsd(totalOrder - applicationFeeAmount)) * 100;
  const prodPriceUsd = Math.round(await convertVndToUsd(prodVariantDiscountPrice)) * 100;

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'usd',
          unit_amount: prodPriceUsd,
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
    payment_method_types: ['card'],
    metadata: {
      prodData: JSON.stringify({
        prodName: prodVariant?.product.name,
        productVariantId: prodVariant?.id,
        accountId: prodVariant?.product.user.connectedAccountId as string,
        quantity,
        accountFund,
        platformFee: applicationFeeAmount,
        totalOrderItem: totalOrder,
      }),
      applicationFeeAmount,
      userId: user?.id as string,
      totalOrder,
    },
    success_url: `${process.env.APP_URL}/payment/success`,
    cancel_url: `${process.env.APP_URL}/payment/cancel`,
  });

  return redirect(session.url as string);
});

export const purchaseProductsInCart = catchAsync(
  async (
    cartTotal,
    payload: (ProdDataItemWithCart & { unit_amount: number; description: string; images: string })[]
  ) => {
    const user = await getUserSession();

    const prodDataWithCart: ProdDataItemWithCart[] = await Promise.all(
      payload.map(async (item) => {
        const user = await db.user.findFirst({
          where: {
            products: {
              some: {
                productVariants: {
                  some: {
                    id: item.productVariantId,
                  },
                },
              },
            },
          },
          select: {
            connectedAccountId: true,
          },
        });
        const totalOrderItem = item.accountFund;
        const platformFee = item.accountFund * APP_FEE_AMOUNT;
        const accountFund = Math.round(await convertVndToUsd(totalOrderItem - platformFee)) * 100;

        return {
          prodName: item.prodName,
          quantity: item.quantity,
          productVariantId: item.productVariantId,
          cartItemId: item.cartItemId,
          accountId: user?.connectedAccountId as string,
          accountFund,
          totalOrderItem,
          platformFee,
        };
      })
    );

    const splittedProdDataWithCart = prodDataWithCart.reduce<{ [key: string]: string }>((acc, item, idx) => {
      const key = `prodData${idx === 0 ? '' : idx}`;
      if (!acc[key]) acc[key] = JSON.stringify(item);
      return acc;
    }, {});

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: await Promise.all(
        payload.map(async (item) => ({
          price_data: {
            currency: 'usd',
            unit_amount: Math.round(await convertVndToUsd(item.unit_amount)) * 100,
            product_data: {
              name: item.prodName,
              description: item.description,
              images: [item.images],
            },
          },
          quantity: item.quantity,
        }))
      ),
      payment_method_types: ['card'],
      metadata: {
        ...splittedProdDataWithCart,
        userId: user?.id as string,
        totalOrder: cartTotal,
        isOrderFromCart: 1,
      },
      success_url: `${process.env.APP_URL}/payment/success`,
      cancel_url: `${process.env.APP_URL}/payment/cancel`,
    });

    return redirect(session.url as string);
  }
);

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
