import { getUserSession } from '@/auth';
import { db } from '@/lib/db';
import FilterApi from '@/lib/filter';
import { OrderItemWithPayload } from '@/types/orders';
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

export const getSellerFilteredSales = async (searchParams: { [key: string]: string }) => {
  const user = await getUserSession();
  if (!user) throw new Error('Unauthenticated!');

  const { from, to } = searchParams;
  const where: Prisma.OrderItemWhereInput = {
    createdAt: {
      gte: from ? new Date(from) : undefined,
      lte: to ? new Date(to) : undefined,
    },
    productVariant: {
      product: {
        userId: user.id,
      },
    },
  };
  const include: Prisma.OrderItemInclude = {
    productVariant: {
      include: {
        product: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
    },
  };

  const { data, count } = await new FilterApi<OrderItemWithPayload, Prisma.OrderItemFindManyArgs>(
    'orderItem',
    searchParams
  )
    .where(where)
    .sort()
    .paginate()
    .include(include)
    .execute();

  return { sales: data, count };
};

export const getTotalSellerSales = async (searchParams: { [key: string]: string }) => {
  const user = await getUserSession();
  if (!user) throw new Error('Unauthenticated!');

  const { from, to } = searchParams;
  const where: Prisma.OrderItemWhereInput = {
    createdAt: {
      gte: from ? new Date(from) : undefined,
      lte: to ? new Date(to) : undefined,
    },
    productVariant: {
      product: {
        userId: user.id,
      },
    },
  };

  const totalSales = await db.orderItem.aggregate({
    _sum: {
      total: true,
      platformFee: true,
    },
    where,
  });

  return (
    (totalSales._sum.total && totalSales._sum.platformFee && totalSales._sum.total - totalSales._sum.platformFee) || 0
  );
};
