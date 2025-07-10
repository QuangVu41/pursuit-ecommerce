import { Prisma } from '@prisma/client';

export type OrderItemWithPayload = Prisma.OrderItemGetPayload<{
  include: {
    productVariant: {
      include: {
        product: {
          select: {
            name: true;
            slug: true;
          };
        };
      };
    };
  };
}>;
