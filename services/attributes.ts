import { getUserSession } from '@/auth';
import { db } from '@/lib/db';
import { ExpectedError } from '@/lib/errors';
import FilterApi from '@/lib/filter';
import { hasDuplicates } from '@/lib/helpers';
import { deleteFromS3 } from '@/lib/upload';
import { CreateAttrSchemaType, UpdateAttrSchemaType } from '@/schemas/attributes';
import { ProductAttributeWithValues } from '@/types/attributes';
import { Prisma } from '@prisma/client';

export const getAllAttributes = async () => {
  const user = await getUserSession();
  const userId = user?.id;
  if (!userId) throw new ExpectedError('Unauthenticated!');

  const attributes = await db.productAttribute.findMany({
    include: {
      productAttributeValues: true,
    },
    where: {
      userId,
    },
  });

  return attributes;
};

export const createAttribute = async (data: CreateAttrSchemaType) => {
  const user = await getUserSession();
  const userId = user?.id;
  if (!userId) throw new ExpectedError('Unauthenticated!');

  const { name, values } = data;

  if (hasDuplicates(values.map((val) => val.value)))
    throw new ExpectedError('Duplicate values are not allowed! Please choose unique values.');

  const existingAttribute = await getUserAttrByName(name, userId);
  if (existingAttribute) throw new ExpectedError('Attribute already exists! Please choose another name.');

  const attribute = await db.productAttribute.create({
    data: {
      name,
      userId,
      productAttributeValues: {
        createMany: {
          data: values.map((val) => ({
            name: val.value,
          })),
        },
      },
    },
  });

  return attribute;
};

export const getAllUserAttributes = async (searchParams: { [key: string]: string }) => {
  const user = await getUserSession();
  const userId = user?.id;
  if (!userId) throw new ExpectedError('Unauthenticated!');

  const { search, from, to } = searchParams;
  const where: Prisma.ProductAttributeWhereInput = {
    AND: {
      name: {
        contains: search,
        mode: 'insensitive',
      },
      createdAt: {
        gte: from ? new Date(from) : undefined,
        lte: to ? new Date(to) : undefined,
      },
    },
    userId,
  };
  const include: Prisma.ProductAttributeInclude = {
    productAttributeValues: true,
  };

  const { data, count } = await new FilterApi<ProductAttributeWithValues, Prisma.ProductAttributeFindManyArgs>(
    'productAttribute',
    searchParams
  )
    .where(where)
    .sort()
    .paginate()
    .include(include)
    .execute();

  return { attributes: data, count };
};

export const updateAttribute = async (data: UpdateAttrSchemaType) => {
  const user = await getUserSession();
  const userId = user?.id;
  if (!userId) throw new ExpectedError('Unauthenticated!');

  const { id, name, values } = data;

  const existingUserAttr = await getUserAttrById(id, userId);
  if (!existingUserAttr) throw new ExpectedError('Unauthorized!');

  if (hasDuplicates(values.map((val) => val.value)))
    throw new ExpectedError('Duplicate values are not allowed! Please choose unique values.');

  const existingAttributes = values.filter((val) => val.fieldId);
  const newAttributes = values.filter((val) => !val.fieldId);

  const existingAttribute = await getUserAttrByName(name, userId);
  if (existingAttribute && existingAttribute.id !== id)
    throw new ExpectedError('Attribute name already exists! Please choose another name.');

  await db.productAttributeValue.deleteMany({
    where: {
      id: {
        notIn: existingAttributes.map((val) => val.fieldId!),
      },
      attributeId: id,
    },
  });

  await db.productAttribute.update({
    where: {
      id,
    },
    data: {
      name,
      productAttributeValues: {
        createMany: {
          data: newAttributes.map((val) => ({
            name: val.value,
          })),
        },
        updateMany: existingAttributes.map((val) => ({
          where: {
            id: val.fieldId,
          },
          data: {
            name: val.value,
          },
        })),
      },
    },
  });
};

export const deleteAttribute = async (id: string) => {
  const user = await getUserSession();
  const userId = user?.id;
  if (!userId) throw new ExpectedError('Unauthenticated!');

  const attribute = await db.productAttribute.findUnique({
    where: {
      id,
    },
    include: {
      productAttributeValues: {
        include: {
          firstProductVariants: true,
          secondProductVariants: true,
        },
      },
    },
  });

  if (!attribute) throw new ExpectedError('Attribute not found!');

  if (attribute.userId !== userId) throw new ExpectedError('You are not authorized to delete this attributes!');

  attribute.productAttributeValues.forEach((value) => {
    if (value.firstProductVariants.length !== 0 || value.secondProductVariants.length !== 0) {
      value.firstProductVariants.forEach(async (v) => {
        if (v.imageUrl) await deleteFromS3(v.imageUrl);
      });
      value.secondProductVariants.forEach(async (v) => {
        if (v.imageUrl) await deleteFromS3(v.imageUrl);
      });
    }
    return;
  });

  await db.productAttribute.delete({
    where: {
      id,
    },
  });
};

export const deleteManyAttributes = async (ids: string[]) => {
  const user = await getUserSession();
  const userId = user?.id;
  if (!userId) throw new ExpectedError('Unauthorized!');

  const attrs = await db.productAttribute.findMany({
    where: {
      id: {
        in: ids,
      },
    },
    include: {
      productAttributeValues: {
        include: {
          firstProductVariants: true,
          secondProductVariants: true,
        },
      },
    },
  });

  if (!attrs.length) throw new ExpectedError('Attributes not found!');

  if (attrs.some((attr) => attr.userId !== userId)) throw new ExpectedError('Unauthorized!');

  attrs.forEach((attribute) => {
    if (attribute.productAttributeValues.length === 0) return;
    attribute.productAttributeValues.forEach((value) => {
      if (value.firstProductVariants.length !== 0 || value.secondProductVariants.length !== 0) {
        value.firstProductVariants.forEach(async (v) => {
          if (v.imageUrl) await deleteFromS3(v.imageUrl);
        });
        value.secondProductVariants.forEach(async (v) => {
          if (v.imageUrl) await deleteFromS3(v.imageUrl);
        });
      }
      return;
    });
  });

  await db.productAttribute.deleteMany({
    where: {
      id: {
        in: ids,
      },
    },
  });
};

export const getUserAttrById = async (id: string, userId: string) => {
  const attribute = await db.productAttribute.findUnique({
    where: {
      id,
      userId,
    },
  });

  return attribute;
};

export const getUserAttrByName = async (name: string, userId: string) => {
  const attribute = await db.productAttribute.findUnique({
    where: {
      name_userId: {
        name,
        userId: userId!,
      },
    },
  });

  return attribute;
};
