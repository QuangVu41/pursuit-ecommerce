import { Prisma } from '@prisma/client';

export type ProductAttributeWithValues = Prisma.ProductAttributeGetPayload<{
  include: { productAttributeValues: true };
}>;
