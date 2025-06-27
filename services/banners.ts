import { db } from '@/lib/db';
import { ExpectedError } from '@/lib/errors';
import FilterApi from '@/lib/filter';
import { generateOrQueryForSearch } from '@/lib/helpers';
import { deleteFromS3, uploadToS3 } from '@/lib/upload';
import { BannerFormSchemaType } from '@/schemas/banners';
import { BannerWithImagesType } from '@/types/banners';
import { BannerType, Prisma } from '@prisma/client';

export const getFilteredBanners = async (searchParams: { [key: string]: string }) => {
  const { search, from, to } = searchParams;
  const where: Prisma.BannerWhereInput = {
    OR: generateOrQueryForSearch(search, 'title'),
    createdAt: {
      gte: from ? new Date(from) : undefined,
      lte: to ? new Date(to) : undefined,
    },
  };
  const include: Prisma.BannerInclude = {
    bannerImages: true,
  };

  const { data, count } = await new FilterApi<BannerWithImagesType, Prisma.BannerFindManyArgs>('banner', searchParams)
    .where(where)
    .sort()
    .include(include)
    .paginate()
    .execute();

  return { banners: data, count };
};

export const getAllBanners = async () => {
  const banners = await db.banner.findMany({
    include: {
      bannerImages: true,
    },
  });

  return banners;
};

export const createBanner = async (data: BannerFormSchemaType) => {
  const { title, description, images, type } = data;

  if (images.length === 0) return { error: 'Banner has to have at least 1 image!' };

  const bannerImages = await Promise.all(
    images.map(async (img, idx) => {
      const imageUrl = await uploadToS3(img.imageFile, 'banners');

      return {
        imageUrl,
        altText: `Banner image ${title} ${idx + 1}`,
      };
    })
  );

  await db.banner.create({
    data: {
      title,
      description,
      type,
      bannerImages: {
        createMany: {
          data: bannerImages,
        },
      },
    },
  });
};

export const updateBanner = async (data: BannerFormSchemaType) => {
  if (data.mode === 'edit') {
    const { id, title, description, type, images } = data;

    if (!id) throw new ExpectedError('Banner ID is required!');

    if (images.length === 0) return { error: 'Banner has to have at least 1 image!' };

    const existingBannerImages = images.filter((img) => img.imgId);
    const deletingBannerImages = await Promise.all(
      (
        await getManyBannerImages(
          id,
          existingBannerImages.map((img) => img.imgId!)
        )
      ).map(async (img) => {
        await deleteFromS3(img.imageUrl);
        return img.id;
      })
    );

    const newBannerImages = await Promise.all(
      images
        .filter((img) => !img.imgId)
        .map(async (img, idx) => {
          const imageUrl = await uploadToS3(img.imageFile, 'banners');

          return {
            imageUrl,
            altText: `Product image ${title} ${idx + 1}`,
          };
        })
    );

    await db.banner.update({
      where: { id },
      data: {
        title,
        description,
        type,
        bannerImages: {
          deleteMany: {
            id: { in: deletingBannerImages },
          },
          createMany: {
            data: newBannerImages,
          },
        },
      },
    });
  }
};

export const getHeroBanner = async () => {
  const heroBanner = await db.banner.findFirst({
    where: {
      type: BannerType.hero,
    },
    include: {
      bannerImages: true,
    },
  });

  return heroBanner;
};

export const getSaleBanner = async () => {
  const saleBanner = await db.banner.findFirst({
    where: {
      type: BannerType.sale,
    },
    include: {
      bannerImages: true,
    },
  });

  return saleBanner;
};

export const getManyBannerImages = async (bannerId: string, ids?: string[]) => {
  const images = await db.bannerImage.findMany({
    where: {
      id: {
        notIn: ids,
      },
      bannerId,
    },
  });

  return images;
};

export const deleteBanner = async (id: string) => {
  const banner = await db.banner.findUnique({
    where: {
      id,
    },
    include: {
      bannerImages: true,
    },
  });

  if (!banner) throw new ExpectedError('Banner not found!');

  banner.bannerImages.forEach(async (image) => {
    await deleteFromS3(image.imageUrl);
  });

  await db.banner.delete({
    where: {
      id,
    },
  });
};

export const deleteManyBanners = async (ids: string[]) => {
  await Promise.all(ids.map(deleteBanner));
};
