import { db } from '@/lib/db';
import { CreateCateSchemaType, UpdateCateSchemaType } from '@/schemas/categories';
import { ExpectedError } from '@/lib/errors';
import FilterApi from '@/lib/filter';
import { Prisma } from '@prisma/client';
import { CateWithParentCate } from '@/types/categories';

export const createCategory = async (data: CreateCateSchemaType) => {
  const { name, description, parentId } = data;

  const existingCategory = await db.category.findUnique({
    where: {
      name,
    },
  });

  if (existingCategory) throw new ExpectedError('Category already exists!');

  if (parentId) {
    const parent = await getCategoryById(parentId);

    if (parent?.parentId)
      throw new ExpectedError('Maximum nesting category level reached, please select another category!');
  }

  const category = await db.category.create({
    data: {
      name,
      description,
      parentId: parentId || null,
    },
  });

  return category;
};

export const getAllCategoriesWithNoParent = async (id?: string) => {
  const categories = await db.category.findMany({
    where: {
      parentId: null,
      id: {
        not: id,
      },
    },
    include: {
      subcategories: true,
    },
    orderBy: {
      name: 'asc',
    },
  });

  return categories;
};

export const getAllCategories = async (id?: string) => {
  const categories = await db.category.findMany({
    where: {
      id: {
        not: id,
      },
    },
    include: {
      subcategories: true,
    },
    orderBy: {
      name: 'asc',
    },
  });

  return categories;
};

export const filterAndCountCategories = async (searchParams: { [key: string]: string }) => {
  const { search, from, to } = searchParams;
  const where: Prisma.CategoryWhereInput = {
    name: {
      contains: search,
      mode: 'insensitive',
    },
    createdAt: {
      gte: from ? new Date(from) : undefined,
      lte: to ? new Date(to) : undefined,
    },
  };

  const include: Prisma.CategoryInclude = {
    parent: true,
  };

  const { data, count } = await new FilterApi<CateWithParentCate, Prisma.CategoryFindManyArgs>('category', searchParams)
    .where(where)
    .sort()
    .paginate()
    .include(include)
    .execute();

  return { categories: data, count };
};

export const getCategoryById = async (id: string) => {
  const category = await db.category.findUnique({
    where: {
      id,
    },
    include: {
      parent: true,
    },
  });

  return category;
};

export const updateCategory = async (data: UpdateCateSchemaType) => {
  const { id, name, description, parentId } = data;

  if (parentId) {
    const parent = await getCategoryById(parentId);

    if (parent?.parentId)
      throw new ExpectedError('Maximum nesting category level reached, please select another category!');
  }

  const category = await db.category.update({
    where: {
      id,
    },
    data: {
      name,
      description,
      parentId: parentId || null,
    },
  });

  return category;
};

export const deleteCategory = async (id: string) => {
  await db.category.delete({
    where: {
      id,
    },
  });
};

export const deleteManyCategories = async (ids: string[]) => {
  await db.category.deleteMany({
    where: {
      id: {
        in: ids,
      },
    },
  });
};
