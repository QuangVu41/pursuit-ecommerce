import { getUserSession } from '@/auth';
import { db } from '@/lib/db';
import FilterApi from '@/lib/filter';
import { OrderItemWithPayload, OrderWithPayload } from '@/types/orders';
import { OrderStatus, Prisma } from '@prisma/client';
import { subDays } from 'date-fns';

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
  const { last = '7' } = searchParams;

  const where: Prisma.OrderItemWhereInput = {
    createdAt: {
      gte: subDays(new Date(), parseInt(last)),
      lte: new Date(),
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
            productImages: {
              where: {
                isPrimary: true,
              },
              select: {
                imageUrl: true,
                altText: true,
              },
            },
          },
        },
        firstAttr: {
          select: {
            name: true,
          },
        },
        secondAttr: {
          select: {
            name: true,
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

export const getAllUserFilteredOrders = async (searchParams: { [key: string]: string }) => {
  const user = await getUserSession();
  if (!user) throw new Error('Unauthenticated!');

  const { from, to } = searchParams;
  const where: Prisma.OrderWhereInput = {
    createdAt: {
      gte: from ? new Date(from) : undefined,
      lte: to ? new Date(to) : undefined,
    },
    userId: user.id,
  };
  const include: Prisma.OrderInclude = {
    orderItems: {
      select: {
        productVariant: {
          select: {
            imageUrl: true,
            altText: true,
            product: {
              select: {
                name: true,
                productImages: {
                  where: {
                    isPrimary: true,
                  },
                },
                slug: true,
              },
            },
          },
        },
        quantity: true,
      },
    },
  };

  const { data, count } = await new FilterApi<OrderWithPayload, Prisma.OrderFindManyArgs>('order', searchParams)
    .where(where)
    .sort()
    .paginate()
    .include(include)
    .execute();

  return { orders: data, count };
};

export const getAllUserSales = async (searchParams: { [key: string]: string }) => {
  const user = await getUserSession();
  if (!user) throw new Error('Unauthenticated!');

  const { last = '7' } = searchParams;

  const orderItems = await db.orderItem.findMany({
    where: {
      order: {
        status: OrderStatus.completed,
      },
      productVariant: {
        product: {
          userId: user?.id,
        },
      },
      createdAt: {
        gte: subDays(new Date(), parseInt(last)),
        lte: new Date(),
      },
    },
  });

  return orderItems;
};

export const getTotalRevenue = async (searchParams: { [key: string]: string } = {}) => {
  const user = await getUserSession();
  let { last = '7' } = searchParams;

  const where: Prisma.OrderItemWhereInput = {
    order: {
      status: OrderStatus.completed,
    },
    productVariant: {
      product: {
        userId: user?.id,
      },
    },
    createdAt: {
      gte: subDays(new Date(), parseInt(last)),
      lte: new Date(),
    },
  };

  const totalRevenue = await db.orderItem.aggregate({
    _sum: {
      total: true,
      platformFee: true,
    },
    where,
  });

  return (
    (totalRevenue._sum.total &&
      totalRevenue._sum.platformFee &&
      totalRevenue._sum.total - totalRevenue._sum.platformFee) ||
    0
  );
};

export const getTotalOrders = async (searchParams: { [key: string]: string }) => {
  const user = await getUserSession();
  let { last = '7' } = searchParams;

  const where: Prisma.OrderItemWhereInput = {
    order: {
      status: OrderStatus.completed,
    },
    productVariant: {
      product: {
        userId: user?.id,
      },
    },
    createdAt: {
      gte: subDays(new Date(), parseInt(last)),
      lte: new Date(),
    },
  };

  const totalRevenue = await db.orderItem.aggregate({
    _sum: {
      quantity: true,
    },
    where,
  });

  return totalRevenue._sum.quantity || 0;
};
