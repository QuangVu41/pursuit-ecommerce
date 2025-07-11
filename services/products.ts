import { getUserSession } from '@/auth';
import { NUM_DAYS_PRODUCT_NEW } from '@/lib/constants';
import { db } from '@/lib/db';
import { ExpectedError } from '@/lib/errors';
import FilterApi from '@/lib/filter';
import { generateOrQueryForSearch, getDateInPast, nameToSlug } from '@/lib/helpers';
import { deleteFromS3, uploadToS3 } from '@/lib/upload';
import { AddToCartSchemaType, ProdFormSchemaType, ProdVariantSchemaType } from '@/schemas/products';
import { ProductWithCateAndImg, ProductWithCateAndPrimaryImg, ProductWithCateAndPrImg } from '@/types/products';
import { Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';

export const getProductBySlug = async (slug: string) => {
  const product = await db.product.findUnique({
    where: {
      slug,
    },
    include: {
      category: {
        include: {
          parent: true,
        },
      },
      productImages: true,
      productVariants: {
        include: {
          firstAttr: {
            include: {
              attribute: true,
            },
          },
          secondAttr: {
            include: {
              attribute: true,
            },
          },
        },
      },
    },
  });

  return product;
};

export const getBestSellingProductImages = async () => {
  const product = await db.product.findUnique({
    where: {
      slug: 'Converse-Chuck-70-Low',
    },
    include: {
      productImages: true,
      productVariants: true,
    },
  });

  if (product) {
    const images = product.productImages.map((img) => ({
      imageUrl: img.imageUrl,
      altText: img.altText,
    }));
    const variants = product.productVariants.map((variant) => ({
      imageUrl: variant.imageUrl,
      altText: variant.altText,
    }));
    return [...images, ...variants];
  }

  return [];
};

export const getRatedProducts = async () => {
  const reviews = await db.review.findMany({
    include: {
      product: {
        include: {
          productImages: {
            where: {
              isPrimary: true,
            },
          },
          category: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      rating: 'desc',
    },
  });

  return reviews
    .map((review) => review.product)
    .reduce<ProductWithCateAndPrimaryImg[]>((acc, prod) => {
      if (!acc.some((p) => p.id === prod.id)) {
        acc.push(prod);
        return acc;
      }
      return acc;
    }, []);
};

export const getBestSellingProducts = async () => {
  const bestSellingProducts = await db.product.findMany({
    include: {
      productVariants: {
        include: {
          orderItems: true,
        },
      },
      productImages: {
        where: {
          isPrimary: true,
        },
      },
      category: {
        select: {
          name: true,
        },
      },
    },
  });

  // Calculate total sales for each product
  const productsWithSales = bestSellingProducts.map((product) => {
    const totalQuantitySold = product.productVariants.reduce((total, variant) => {
      return (
        total +
        variant.orderItems.reduce((variantTotal, orderItem) => {
          return variantTotal + orderItem.quantity;
        }, 0)
      );
    }, 0);

    return {
      ...product,
      totalQuantitySold,
    };
  });

  // Sort by quantity sold and return top products
  return productsWithSales.sort((a, b) => b.totalQuantitySold - a.totalQuantitySold).map((prod) => prod);
};

export const getNewProducts = async () => {
  const thirtyDaysAgo = getDateInPast(NUM_DAYS_PRODUCT_NEW);

  const products = await db.product.findMany({
    where: {
      createdAt: {
        gte: thirtyDaysAgo,
      },
    },
    include: {
      productImages: {
        where: {
          isPrimary: true,
        },
      },
      category: true,
    },
  });

  return products;
};

export const getAllFilteredProducts = async (searchParams: { [key: string]: string }) => {
  let { minPrice, maxPrice, category, query, sortBy } = searchParams;

  const where: Prisma.ProductWhereInput = {
    OR: generateOrQueryForSearch(query, 'name'),
    category: category
      ? {
          OR: [
            {
              id: category ? category : undefined,
            },
            {
              parentId: category ? category : undefined,
            },
          ],
        }
      : undefined,
    regularPrice: {
      gte: minPrice ? parseInt(minPrice) : undefined,
      lte: maxPrice ? parseInt(maxPrice) : undefined,
    },
  };
  const include: Prisma.ProductInclude = {
    category: true,
    productImages: {
      where: {
        isPrimary: true,
      },
    },
    productVariants: {
      include: {
        orderItems: {
          select: {
            quantity: true,
          },
        },
      },
    },
    reviews: {
      select: {
        rating: true,
      },
    },
  };

  let { data, count } = await new FilterApi<ProductWithCateAndImg, Prisma.ProductFindManyArgs>('product', searchParams)
    .where(where)
    .sort()
    .paginate()
    .include(include)
    .execute();

  if (sortBy === 'best-selling') {
    data = data
      .map((product) => {
        const totalQuantitySold = product.productVariants.reduce((total, variant) => {
          return (
            total +
            variant.orderItems.reduce((variantTotal, orderItem) => {
              return variantTotal + orderItem.quantity;
            }, 0)
          );
        }, 0);

        return {
          ...product,
          totalQuantitySold,
        };
      })
      .sort((a, b) => b.totalQuantitySold - a.totalQuantitySold)
      .map((prod) => prod);
  } else if (sortBy === 'rated') {
    data = data
      .map((product) => {
        const totalRating = product.reviews.reduce((total, review) => total + review.rating, 0);
        const averageRating = totalRating / (product.reviews.length || 1);
        return {
          ...product,
          averageRating,
        };
      })
      .sort((a, b) => b.averageRating - a.averageRating)
      .map((prod) => prod);
  }

  return { products: data, count };
};

export const getProductByName = async (name: string) => {
  const product = await db.product.findUnique({
    where: {
      name,
    },
  });

  return product;
};

export const getSimilarProducts = async (categoryId?: string, productId?: string) => {
  const products = await db.product.findMany({
    where: {
      OR: [
        {
          categoryId,
        },
        {
          category: {
            parentId: categoryId,
          },
        },
      ],
      id: {
        not: productId,
      },
    },
    include: {
      productImages: {
        where: {
          isPrimary: true,
        },
      },
      category: true,
    },
  });

  return products;
};

export const getAllUserFilteredProducts = async (searchParams: { [key: string]: string }) => {
  const user = await getUserSession();
  const userId = user?.id;
  if (!userId) throw new ExpectedError('Unauthenticated!');

  const { search, from, to, item } = searchParams;
  const where: Prisma.ProductWhereInput = {
    OR: search ? generateOrQueryForSearch(search, 'name') : undefined,
    createdAt: {
      gte: from ? new Date(from) : undefined,
      lte: to ? new Date(to) : undefined,
    },
    category: {
      OR: item ? [{ name: item }, { parentId: item }] : undefined,
    },
    userId,
  };
  const include: Prisma.ProductInclude = {
    category: true,
    productImages: {
      where: {
        isPrimary: true,
      },
    },
  };

  const { data, count } = await new FilterApi<ProductWithCateAndPrImg, Prisma.ProductFindManyArgs>(
    'product',
    searchParams
  )
    .where(where)
    .sort()
    .paginate()
    .include(include)
    .execute();

  return { products: data, count };
};

export const createProduct = async (data: ProdFormSchemaType) => {
  const user = await getUserSession();
  const userId = user?.id;
  if (!userId) throw new ExpectedError('Unauthenticated!');

  const { name, categoryId, regularPrice, description, summary, images, variants } = data;

  if (variants.length === 0) throw new ExpectedError('Your product has to have at least one variant!');

  if (Object.keys(Object.groupBy(variants, (variant) => variant.parentVariantId)).length > 1)
    throw new ExpectedError('You can only create product with one variant type!');

  let prodVariants: Omit<ProdVariantSchemaType, 'variantName' | 'parentVariantId' | 'imageFile'>[] = [];

  const existingProd = await getProductByName(name);
  if (existingProd) throw new ExpectedError('Product with this name already exists, please choose another name!');

  const prodImages = await Promise.all(
    images.map(async (image, idx) => {
      const imageUrl = await uploadToS3(image.imageFile, 'products');

      return {
        imageUrl,
        isPrimary: image.isPrimary,
        altText: `Product image ${name} ${idx + 1}`,
      };
    })
  );

  prodVariants = await Promise.all(
    variants.map(async (variant, idx) => {
      let variantImageUrl: string | undefined;
      if (variant.imageFile) variantImageUrl = await uploadToS3(variant.imageFile, 'products');
      else variantImageUrl = undefined;

      return {
        firstAttrId: variant.firstAttrId,
        secondAttrId: variant.secondAttrId,
        price: variant.price || regularPrice,
        stock: variant.stock,
        imageUrl: variantImageUrl,
        altText: variantImageUrl && `Product variant image ${name} ${idx + 1}`,
      };
    })
  );

  const slug = nameToSlug(name);

  await db.product.create({
    data: {
      userId,
      name,
      categoryId,
      description,
      regularPrice,
      summary,
      slug,
      productImages: {
        createMany: {
          data: prodImages,
        },
      },
      productVariants: {
        createMany: {
          data: prodVariants,
        },
      },
    },
  });
};

export const updateProduct = async (data: ProdFormSchemaType) => {
  if (data.mode === 'edit') {
    const user = await getUserSession();
    const userId = user?.id;
    if (!userId) throw new ExpectedError('Unauthenticated!');

    const { id, name, categoryId, regularPrice, description, summary, images, variants } = data;

    if (!id) throw new ExpectedError('Product ID is required!');

    if (variants.length === 0) throw new ExpectedError('Your product has to have at least one variant!');

    if (Object.keys(Object.groupBy(variants, (variant) => variant.parentVariantId)).length > 1)
      throw new ExpectedError('You can only update product with one variant type!');

    let existProdVariants: Omit<ProdVariantSchemaType, 'variantName' | 'parentVariantId'>[] = [];
    let newProdVariants: Omit<ProdVariantSchemaType, 'variantName' | 'parentVariantId'>[] = [];
    let deletingProdVariants: string[] = [];

    const existingUserProd = await getUserProductById(id, userId);
    if (!existingUserProd) throw new ExpectedError('Unauthorized!');

    const existingProd = await getProductByName(name);
    if (existingProd && existingProd.id !== id)
      throw new ExpectedError('Product with this name already exists, please choose another name!');

    const existingProdImages = images.filter((img) => img.imgId);
    const deletingProdImages = await Promise.all(
      (
        await getManyProductImages(
          id,
          existingProdImages.map((img) => img.imgId!)
        )
      ).map(async (img) => {
        await deleteFromS3(img.imageUrl);
        return img.id;
      })
    );

    const newProdImages = await Promise.all(
      images
        .filter((img) => !img.imgId)
        .map(async (img, idx) => {
          const imageUrl = await uploadToS3(img.imageFile, 'products');

          return {
            imageUrl,
            isPrimary: img.isPrimary,
            altText: `Product image ${name} ${idx + 1}`,
          };
        })
    );

    existProdVariants = variants.filter((variant) => variant.variantId);
    deletingProdVariants = await Promise.all(
      (
        await getManyProductVariants(
          id,
          existProdVariants.map((variant) => variant.variantId!)
        )
      ).map(async (variant) => {
        if (variant.imageUrl) await deleteFromS3(variant.imageUrl);
        return variant.id;
      })
    );
    existProdVariants = await Promise.all(
      existProdVariants.map(async (variant) => {
        let variantImageUrl: string | undefined;
        if (variant.imageFile) {
          variantImageUrl = await uploadToS3(variant.imageFile, 'products');
          const oldVariant = await db.productVariant.findUnique({
            where: {
              id: variant.variantId,
            },
          });
          if (oldVariant && oldVariant.imageUrl) await deleteFromS3(oldVariant.imageUrl);
        } else variantImageUrl = variant.imageUrl;

        return {
          variantId: variant.variantId,
          firstAttrId: variant.firstAttrId,
          secondAttrId: variant.secondAttrId,
          price: variant.price,
          stock: variant.stock,
          imageUrl: variantImageUrl,
          altText: variantImageUrl && `Product variant image ${name} ${randomUUID()}`,
        };
      })
    );

    newProdVariants = await Promise.all(
      variants
        .filter((variant) => !variant.variantId)
        .map(async (variant) => {
          let variantImageUrl: string | undefined;
          if (variant.imageFile) variantImageUrl = await uploadToS3(variant.imageFile, 'products');
          else variantImageUrl = undefined;

          return {
            firstAttrId: variant.firstAttrId,
            secondAttrId: variant.secondAttrId,
            price: variant.price || regularPrice,
            stock: variant.stock,
            imageUrl: variantImageUrl,
            altText: variantImageUrl && `Product variant image ${name} ${randomUUID()}`,
          };
        })
    );

    const slug = nameToSlug(name);

    await db.product.update({
      where: {
        id,
      },
      data: {
        name,
        categoryId,
        description,
        regularPrice,
        summary,
        slug,
        productImages: {
          deleteMany: {
            id: {
              in: deletingProdImages,
            },
          },
          updateMany: existingProdImages.map((img) => ({
            where: {
              id: img.imgId!,
            },
            data: {
              isPrimary: img.isPrimary,
            },
          })),
          createMany: {
            data: newProdImages,
          },
        },
        productVariants: {
          deleteMany: {
            id: {
              in: deletingProdVariants,
            },
          },
          updateMany: existProdVariants.map((variant) => ({
            where: {
              id: variant.variantId!,
            },
            data: {
              firstAttrId: variant.firstAttrId,
              secondAttrId: variant.secondAttrId,
              price: variant.price,
              stock: variant.stock,
              imageUrl: variant.imageUrl,
            },
          })),
          createMany: {
            data: newProdVariants,
          },
        },
      },
    });
  }
};

export const getManyProductImages = async (productId: string, ids?: string[]) => {
  const images = await db.productImage.findMany({
    where: {
      id: {
        notIn: ids,
      },
      productId,
    },
  });

  return images;
};

export const getManyProductVariants = async (productId: string, ids: string[]) => {
  const variants = await db.productVariant.findMany({
    where: {
      id: {
        notIn: ids,
      },
      productId,
    },
  });

  return variants;
};

export const deleteProduct = async (id: string) => {
  const user = await getUserSession();
  const userId = user?.id;
  if (!userId) throw new ExpectedError('Unauthorized!');

  const product = await db.product.findUnique({
    where: {
      id,
    },
    include: {
      productImages: true,
      productVariants: {
        include: {
          firstAttr: true,
          secondAttr: true,
        },
      },
    },
  });

  if (!product) throw new ExpectedError('Product not found!');

  if (product.userId !== userId) throw new ExpectedError('Unauthorized!');

  product.productImages.forEach(async (image) => {
    await deleteFromS3(image.imageUrl);
  });

  product.productVariants.forEach(async (variant) => {
    if (variant.imageUrl) await deleteFromS3(variant.imageUrl);
  });

  await db.product.delete({
    where: {
      id,
      userId,
    },
  });
};

export const deleteManyProducts = async (ids: string[]) => {
  const user = await getUserSession();
  const userId = user?.id;
  if (!userId) throw new ExpectedError('Unauthorized!');

  await Promise.all(ids.map(deleteProduct));
};

export const getUserProductById = async (id: string, userId: string) => {
  const product = await db.product.findUnique({
    where: {
      id,
      userId,
    },
  });

  return product;
};

export const addToCart = async (data: AddToCartSchemaType) => {
  const user = await getUserSession();
  const userId = user?.id;
  if (!userId) throw new ExpectedError('Unauthenticated!');

  const { firstAttrId, secondAttrId, quantity, productId } = data;

  if (!firstAttrId) throw new ExpectedError('Please choose product variant!');

  const variant = await getProdVariantByAttrIds(productId, firstAttrId, secondAttrId);

  const userCart = await getUserCartByUserId(userId);
  const existingCartItem = userCart?.cartItems.find(
    (item) => item.productVariantId === variant.id && item.cartId === userCart.id
  );

  await db.cart.upsert({
    where: {
      userId,
    },
    update: {
      cartItems: {
        update: existingCartItem
          ? {
              where: {
                id: existingCartItem.id,
              },
              data: {
                quantity: existingCartItem.quantity + quantity,
              },
            }
          : undefined,
        create: existingCartItem
          ? undefined
          : {
              productVariantId: variant.id,
              quantity,
            },
      },
    },
    create: {
      userId,
      cartItems: {
        create: {
          productVariantId: variant.id,
          quantity,
        },
      },
    },
  });
};

export const numItemsInUserCart = async () => {
  const user = await getUserSession();
  const userId = user?.id;
  if (!userId) return 0;

  const numItems = await db.cartItem.count({
    where: {
      cart: {
        userId,
      },
    },
  });

  return numItems;
};

export const getUserCartItems = async () => {
  const user = await getUserSession();
  const userId = user?.id;
  if (!userId) return [];

  const cartItems = await db.cartItem.findMany({
    where: {
      cart: {
        userId,
      },
    },
    include: {
      productVariant: {
        include: {
          product: {
            include: {
              productImages: {
                where: {
                  isPrimary: true,
                },
              },
            },
          },
          firstAttr: {
            select: {
              name: true,
            },
          },
          secondAttr: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  return cartItems;
};

export const getProdVariantByAttrIds = async (productId: string, firstAttrId: string, secondAttrId?: string) => {
  let variant: Prisma.ProductVariantGetPayload<{
    include: {
      product: {
        include: {
          productImages: {
            where: {
              isPrimary: true;
            };
          };
          user: {
            select: {
              connectedAccountId: true;
            };
          };
        };
      };
    };
  }> | null = null;

  if (secondAttrId)
    variant = await db.productVariant.findUnique({
      where: {
        productId_firstAttrId_secondAttrId: {
          productId,
          firstAttrId,
          secondAttrId,
        },
      },
      include: {
        product: {
          include: {
            productImages: {
              where: {
                isPrimary: true,
              },
            },
            user: {
              select: {
                connectedAccountId: true,
              },
            },
          },
        },
      },
    });
  else {
    variant = await db.productVariant.findFirst({
      where: {
        firstAttrId,
        secondAttrId: null,
        productId,
      },
      include: {
        product: {
          include: {
            productImages: {
              where: {
                isPrimary: true,
              },
            },
            user: {
              select: {
                connectedAccountId: true,
              },
            },
          },
        },
      },
    });
  }

  if (!variant) throw new ExpectedError('Product variant not found!');

  return variant;
};

export const getUserCartByUserId = async (userId: string) => {
  const cart = await db.cart.findUnique({
    where: {
      userId,
    },
    include: {
      cartItems: true,
    },
  });

  return cart;
};

export const getUserCartWithPayloadByUserId = async () => {
  const user = await getUserSession();
  const userId = user?.id;
  if (!userId) return;

  const cart = await db.cart.findUnique({
    where: {
      userId,
    },
    include: {
      cartItems: {
        include: {
          productVariant: {
            include: {
              product: {
                include: {
                  productImages: {
                    where: {
                      isPrimary: true,
                    },
                  },
                },
              },
              firstAttr: {
                select: {
                  name: true,
                  attribute: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
              secondAttr: {
                select: {
                  name: true,
                  attribute: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  return cart;
};

export const deleteCartItem = async (id: string) => {
  const cartItem = await db.cartItem.findUnique({
    where: {
      id,
    },
  });

  if (!cartItem) throw new ExpectedError('Cart item not found!');

  await db.cartItem.delete({
    where: {
      id,
    },
  });
};

export const updateCartItemQty = async (id: string, quantity: number) => {
  const cartItem = await db.cartItem.findUnique({
    where: {
      id,
    },
    include: {
      productVariant: true,
    },
  });

  if (!cartItem) throw new ExpectedError('Cart item not found!');

  const newQty =
    quantity > 0
      ? Math.min(cartItem.quantity + quantity, cartItem.productVariant.stock)
      : Math.max(cartItem.quantity + quantity, 0);

  if (newQty === 0) {
    await deleteCartItem(id);
    return;
  }

  await db.cartItem.update({
    where: {
      id,
    },
    data: {
      quantity: newQty,
    },
  });
};

export const setCartItemQty = async (id: string, quantity: number) => {
  const cartItem = await db.cartItem.findUnique({
    where: {
      id,
    },
    include: {
      productVariant: true,
    },
  });

  if (!cartItem) throw new ExpectedError('Cart item not found!');

  const newQty = Math.min(quantity, cartItem.productVariant.stock);

  if (newQty === 0) {
    await deleteCartItem(id);
    return;
  }

  await db.cartItem.update({
    where: {
      id,
    },
    data: {
      quantity: newQty,
    },
  });
};

export const getNumProductsSold = async (productId: string) => {
  const numSold = await db.orderItem.aggregate({
    where: {
      productVariant: {
        productId,
      },
    },
    _sum: {
      quantity: true,
    },
  });

  return numSold._sum.quantity || 0;
};

export const checkIfUserHasPurchasedProduct = async (productId: string) => {
  const user = await getUserSession();
  const userId = user?.id;
  if (!userId) return false;

  const orderItems = await db.orderItem.findMany({
    where: {
      productVariant: {
        productId,
      },
      order: {
        userId,
      },
    },
  });

  return orderItems.length > 0;
};
