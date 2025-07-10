import { Prisma } from '@prisma/client';

export type CateWithSubCates = Prisma.CategoryGetPayload<{
  include: { subcategories: true };
}>;

export type CateWithParentCate = Prisma.CategoryGetPayload<{
  include: { parent: true };
}>;
