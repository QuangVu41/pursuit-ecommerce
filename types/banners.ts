import { BannerFormSchemaType } from '@/schemas/banners';
import { Prisma } from '@prisma/client';
import { FieldArrayWithId } from 'react-hook-form';

export type BannerImagesWithIdType = FieldArrayWithId<BannerFormSchemaType, 'images', 'id'>;
export type BannerWithImagesType = Prisma.BannerGetPayload<{
  include: {
    bannerImages: true;
  };
}>;
