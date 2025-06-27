import { db } from '@/lib/db';
import { CateFormSchemaType } from '@/schemas/categories';
import { ExpectedError } from '@/lib/errors';
import FilterApi from '@/lib/filter';
import { Prisma } from '@prisma/client';
import { CateWithParentCate } from '@/types/categories';
import { generateOrQueryForSearch } from '@/lib/helpers';
import { deleteFromS3, uploadToS3 } from '@/lib/upload';

export const createCategory = async (data: CateFormSchemaType) => {
  const { name, description, parentId, imageFile } = data;

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

  if (!imageFile) throw new ExpectedError('Category image is required!');

  const imageUrl = await uploadToS3(imageFile, 'categories');
  const altText = `Category image ${name}`;

  const category = await db.category.create({
    data: {
      name,
      description,
      parentId: parentId || null,
      imageUrl,
      altText,
    },
  });

  return category;
};

export const getAllCatesWithNoParentCates = async (id?: string) => {
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

export const getFilteredCategories = async (searchParams: { [key: string]: string }) => {
  const { search, from, to } = searchParams;
  const where: Prisma.CategoryWhereInput = {
    OR: generateOrQueryForSearch(search, 'name'),
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

export const updateCategory = async (data: CateFormSchemaType) => {
  if (data.mode === 'edit') {
    const { id, name, description, parentId, imageFile } = data;
    let imageUrl: string | undefined;

    if (!id) throw new ExpectedError('Category ID is required for update!');

    if (parentId) {
      const parent = await getCategoryById(parentId);

      if (parent?.parentId)
        throw new ExpectedError('Maximum nesting category level reached, please select another category!');
    }

    const existingCate = await db.category.findUnique({
      where: {
        id,
      },
      select: {
        imageUrl: true,
      },
    });

    if (existingCate && imageFile) {
      await deleteFromS3(existingCate?.imageUrl);
      imageUrl = await uploadToS3(imageFile, 'categories');
    }

    const altText = `Category image ${name}`;

    const category = await db.category.update({
      where: {
        id,
      },
      data: {
        name,
        description,
        parentId: parentId || null,
        imageUrl,
        altText,
      },
    });
    return category;
  }
};

export const deleteCategory = async (id: string) => {
  const category = await db.category.findUnique({
    where: {
      id,
    },
    include: {
      products: {
        include: {
          productImages: true,
          productVariants: true,
        },
      },
    },
  });

  if (category) {
    await deleteFromS3(category.imageUrl);

    await Promise.all(
      category.products.map(async (prod) => {
        await Promise.all(
          prod.productImages.map(async (img) => {
            await deleteFromS3(img.imageUrl);
          })
        );
        await Promise.all(
          prod.productVariants.map(async (variant) => {
            if (variant.imageUrl) await deleteFromS3(variant.imageUrl);
          })
        );
      })
    );

    await db.category.delete({
      where: {
        id: category.id,
      },
    });
  }
};

export const deleteManyCategories = async (ids: string[]) => {
  await Promise.all(ids.map(deleteCategory));
};
