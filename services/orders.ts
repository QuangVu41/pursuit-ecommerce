import { db } from '@/lib/db';
import { Prisma } from '@prisma/client';

export const createOrder = async (orderData: Prisma.OrderCreateArgs) => {
  const order = await db.order.create({
    ...orderData,
    include: {
      orderItems: true,
    },
  });

  if (order) {
    await db.productVariant.update({
      where: { id: order.orderItems[0].productVariantId },
      data: {
        stock: {
          decrement: order.orderItems[0].quantity,
        },
      },
    });
  }
};

export const createOrderFromCart = async (cartItemIds: string[], orderData: Prisma.OrderCreateArgs) => {
  const order = await db.order.create({
    ...orderData,
    include: {
      orderItems: true,
    },
  });

  if (order) {
    order.orderItems.forEach(async (item) => {
      await db.productVariant.update({
        where: { id: item.productVariantId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    });
  }

  await db.cartItem.deleteMany({
    where: {
      id: {
        in: cartItemIds,
      },
    },
  });
};
