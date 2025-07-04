import { ProdFormSchemaType } from '@/schemas/products';
import { Prisma } from '@prisma/client';
import { FieldArrayWithId } from 'react-hook-form';

export type ProdVariantWithIdType = FieldArrayWithId<ProdFormSchemaType, 'variants', 'id'>;
export type ProdImagesWithIdType = FieldArrayWithId<ProdFormSchemaType, 'images', 'id'>;
export type ProductWithCateAndPrImg = Prisma.ProductGetPayload<{
  include: {
    category: {
      include: {
        parent: true;
      };
    };
    productImages: {
      where: {
        isPrimary: true;
      };
    };
  };
}>;
export type ProductWithPayLoad = Prisma.ProductGetPayload<{
  include: {
    category: {
      include: {
        parent: true;
      };
    };
    productImages: true;
    productVariants: {
      include: {
        firstAttr: {
          include: {
            attribute: true;
          };
        };
        secondAttr: {
          include: {
            attribute: true;
          };
        };
      };
    };
  };
}>;
export type ProductWithCateAndImg = Omit<ProductWithPayLoad, 'productVariants'>;
export type ProductWithCateAndPrimaryImg = Prisma.ProductGetPayload<{
  include: {
    category: true;
    productImages: {
      where: {
        isPrimary: true;
      };
    };
  };
}>;
export type ProductVariantWithPayLoad = Prisma.ProductVariantGetPayload<{
  include: {
    firstAttr: {
      include: {
        attribute: true;
      };
    };
    secondAttr: {
      include: {
        attribute: true;
      };
    };
  };
}>;
export type CartItemWithPayload = Prisma.CartItemGetPayload<{
  include: {
    productVariant: {
      include: {
        product: {
          include: {
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

export type UserCartWithPayload = Prisma.CartGetPayload<{
  include: {
    cartItems: {
      include: {
        productVariant: {
          include: {
            product: {
              include: {
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
                attribute: {
                  select: {
                    name: true;
                  };
                };
              };
            };
            secondAttr: {
              select: {
                name: true;
                attribute: {
                  select: {
                    name: true;
                  };
                };
              };
            };
          };
        };
      };
    };
  };
}>;

export type UserCartItemsWithPayload = UserCartWithPayload['cartItems'][0];
