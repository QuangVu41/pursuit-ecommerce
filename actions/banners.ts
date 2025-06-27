'use server';

import { catchAsync } from '@/lib/catchAsync';
import { BannerFormSchemaType, BannerFormsSchema } from '@/schemas/banners';
import { createBanner, deleteBanner, deleteManyBanners, updateBanner } from '@/services/banners';
import { revalidatePath } from 'next/cache';

export const createBannerAct = catchAsync(async (data: BannerFormSchemaType) => {
  const validatedFields = BannerFormsSchema.safeParse(data);

  if (!validatedFields.success)
    return { error: `Invalid Fields! ${validatedFields.error.errors.map((err) => err.message).join(', ')}` };

  await createBanner(validatedFields.data);

  revalidatePath('/mng/banners');
  return { success: 'Banner created successfully!' };
});

export const updateBannerAct = catchAsync(async (data: BannerFormSchemaType) => {
  const validatedFields = BannerFormsSchema.safeParse(data);

  if (!validatedFields.success)
    return { error: `Invalid Fields! ${validatedFields.error.errors.map((err) => err.message).join(', ')}` };

  await updateBanner(validatedFields.data);

  revalidatePath('/mng/banners');
  return { success: 'Banner updated successfully!' };
});

export const deleteBannerAct = catchAsync(async (id: string) => {
  await deleteBanner(id);

  revalidatePath('/mng/banners');
  return { success: 'Category deleted successfully!' };
});

export const deleteManyBannersAct = catchAsync(async (ids: string[]) => {
  await deleteManyBanners(ids);

  revalidatePath('/mng/banners');
  return { success: 'Banners deleted successfully!' };
});
