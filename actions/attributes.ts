'use server';

import { AttrFormSchema, AttrFormSchemaType } from '@/schemas/attributes';
import { createAttribute, deleteAttribute, deleteManyAttributes, updateAttribute } from '@/services/attributes';
import { revalidatePath } from 'next/cache';
import { catchAsync } from '@/lib/catchAsync';

export const createAttrWithValues = catchAsync(async (data: AttrFormSchemaType) => {
  const validatedFields = AttrFormSchema.safeParse(data);

  if (!validatedFields.success)
    return { error: `Invalid Fields! ${validatedFields.error.errors.map((err) => err.message).join(', ')}` };

  await createAttribute(validatedFields.data);

  revalidatePath('/mng/products/attributes');
  return { success: 'Attribute created successfully!' };
});

export const updateAttWithValues = catchAsync(async (data: AttrFormSchemaType) => {
  const validatedFields = AttrFormSchema.safeParse(data);

  if (!validatedFields.success)
    return { error: `Invalid Fields! ${validatedFields.error.errors.map((err) => err.message).join(', ')}` };

  await updateAttribute(validatedFields.data);

  revalidatePath('/mng/products/attributes');
  return { success: 'Attribute updated successfully!' };
});

export const deleteAttr = catchAsync(async (id: string) => {
  await deleteAttribute(id);

  revalidatePath('/mng/products/attributes');
  return { success: 'Attribute deleted successfully!' };
});

export const deleteManyAttrs = catchAsync(async (id: string[]) => {
  await deleteManyAttributes(id);

  revalidatePath('/mng/products/attributes');
  return { success: 'Attributes deleted successfully!' };
});
