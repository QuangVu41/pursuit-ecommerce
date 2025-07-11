'use server';

import { uploadToS3 } from '@/lib/upload';
import { UserEditSchema, UserEditSchemaType } from '@/schemas/user';
import { updateUserById } from '@/services/users';
import { revalidatePath } from 'next/cache';

export const updateUserInfoAct = async (data: UserEditSchemaType) => {
  const validatedFields = UserEditSchema.safeParse(data);

  if (!validatedFields.success)
    return { error: `Invalid Fields! ${validatedFields.error.errors.map((err) => err.message).join(', ')}` };

  const { id, name, birthOfDate, imageFile, phoneNumber } = validatedFields.data;
  let imageUrl: string | undefined;

  if (imageFile) imageUrl = await uploadToS3(imageFile, 'users/avatars');

  await updateUserById(id, {
    name,
    birthOfDate: birthOfDate ? new Date(birthOfDate) : undefined,
    phoneNumber,
    image: imageUrl,
  });

  revalidatePath('/profile');
  return { success: 'Information updated successfully!' };
};
