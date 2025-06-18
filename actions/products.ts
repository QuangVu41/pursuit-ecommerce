'use server';

import { catchAsync } from '@/lib/catchAsync';
import { ProdFormSchema, ProdFormSchemaType } from '@/schemas/products';
import { createProduct, deleteManyProducts, deleteProduct, updateProduct } from '@/services/products';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export const createProd = catchAsync(async (data: ProdFormSchemaType) => {
  const validatedFields = ProdFormSchema.safeParse(data);

  if (!validatedFields.success)
    return { error: `Invalid Fields! ${validatedFields.error.errors.map((err) => err.message).join(', ')}` };

  await createProduct(validatedFields.data);

  redirect('/mng/products');
});

export const updateProd = catchAsync(async (data: ProdFormSchemaType) => {
  const validatedFields = ProdFormSchema.safeParse(data);

  if (!validatedFields.success)
    return { error: `Invalid Fields! ${validatedFields.error.errors.map((err) => err.message).join(', ')}` };

  await updateProduct(validatedFields.data);

  redirect('/mng/products');
});

export const deleteProd = catchAsync(async (id: string) => {
  await deleteProduct(id);

  revalidatePath('/mng/products');
  return { success: 'Product deleted successfully!' };
});

export const deleteManyProds = catchAsync(async (ids: string[]) => {
  await deleteManyProducts(ids);

  revalidatePath('/mng/products');
  return { success: 'Products deleted successfully!' };
});
