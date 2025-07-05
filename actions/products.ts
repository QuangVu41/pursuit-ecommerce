'use server';

import { catchAsync } from '@/lib/catchAsync';
import { AddToCartSchema, AddToCartSchemaType, ProdFormSchema, ProdFormSchemaType } from '@/schemas/products';
import {
  addToCart,
  createProduct,
  deleteCartItem,
  deleteManyProducts,
  deleteProduct,
  setCartItemQty,
  updateCartItemQty,
  updateProduct,
} from '@/services/products';
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

export const addToCartAction = catchAsync(async (data: AddToCartSchemaType) => {
  const validatedFields = AddToCartSchema.safeParse(data);

  if (!validatedFields.success)
    return { error: `Invalid Fields! ${validatedFields.error.errors.map((err) => err.message).join(', ')}` };

  await addToCart(validatedFields.data);

  revalidatePath('/');
  return { success: 'Item added to cart successfully!' };
});

export const increaseCartItemQty = catchAsync(async (id: string) => {
  await updateCartItemQty(id, 1);

  revalidatePath('/cart');
});

export const decreaseCartItemQty = catchAsync(async (id: string) => {
  await updateCartItemQty(id, -1);

  revalidatePath('/cart');
});

export const setCartItemQtyAct = catchAsync(async (id: string, quantity: number) => {
  await setCartItemQty(id, quantity);

  revalidatePath('/cart');
});

export const deleteCartItemAct = catchAsync(async (id: string) => {
  await deleteCartItem(id);

  revalidatePath('/cart');
});

export const deleteManyCartItemsAct = catchAsync(async (ids: string[]) => {
  await Promise.all(ids.map((id) => deleteCartItem(id)));

  revalidatePath('/cart');
});
