import { Prisma } from '@prisma/client';

export type OrderItemWithPayload = Prisma.OrderItemGetPayload<{
  include: {
    productVariant: {
      include: {
        product: {
          select: {
            name: true;
            slug: true;
            productImages: {
              where: {
                isPrimary: true;
              };
            };
          };
        };
        firstAttr: {
          select: {
            name: true;
          };
        };
        secondAttr: {
          select: {
            name: true;
          };
        };
      };
    };
  };
}>;

export type OrderWithPayload = Prisma.OrderGetPayload<{
  include: {
    orderItems: {
      select: {
        productVariant: {
          select: {
            imageUrl: true;
            altText: true;
            product: {
              select: {
                name: true;
                productImages: {
                  where: {
                    isPrimary: true;
                  };
                };
                slug: true;
              };
            };
          };
        };
        quantity: true;
      };
    };
  };
}>;
