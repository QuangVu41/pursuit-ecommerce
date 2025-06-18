'use server';

import { CreateCateSchema, CreateCateSchemaType, UpdateCateSchema, UpdateCateSchemaType } from '@/schemas/categories';
import { createCategory, deleteCategory, deleteManyCategories, updateCategory } from '@/services/categories';
import { revalidatePath } from 'next/cache';
import { catchAsync } from '../lib/catchAsync';

export const createCate = catchAsync(async (data: CreateCateSchemaType) => {
  const validatedFields = CreateCateSchema.safeParse(data);

  if (!validatedFields.success)
    return { error: `Invalid Fields! ${validatedFields.error.errors.map((err) => err.message).join(', ')}` };

  await createCategory(validatedFields.data);

  revalidatePath('/mng/products/categories');
  return { success: 'Category created successfully!' };
});

export const updateCate = catchAsync(async (data: UpdateCateSchemaType) => {
  const validatedFields = UpdateCateSchema.safeParse(data);

  if (!validatedFields.success)
    return { error: `Invalid Fields! ${validatedFields.error.errors.map((err) => err.message).join(', ')}` };

  await updateCategory(validatedFields.data);

  revalidatePath('/mng/products/categories');
  return { success: 'Category updated successfully!' };
});

export const deleteCate = catchAsync(async (id: string) => {
  await deleteCategory(id);

  revalidatePath('/mng/products/categories');
  return { success: 'Category deleted successfully!' };
});

export const deleteManyCates = catchAsync(async (ids: string[]) => {
  await deleteManyCategories(ids);

  revalidatePath('/mng/products/categories');
  return { success: 'Categories deleted successfully!' };
});
