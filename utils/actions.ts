'use server';
import db from '@/utils/db';
import { redirect } from 'next/navigation';
import { actionFunction } from '@/utils/types';
import { currentUser } from '@clerk/nextjs/server';
import {
  imageSchema,
  productSchema,
  reviewSchema,
  validateWithZodSchema,
} from './schemas';
import { deleteImage, supabase, uploadImage } from './supabase';
import { revalidatePath } from 'next/cache';
import { string } from 'zod';

const getAuthUser = async () => {
  const user = await currentUser();
  if (!user) redirect('/');
  return user;
};

const getAdminUser = async () => {
  const user = await getAuthUser();
  if (user.id !== process.env.ADMIN_USER_ID) redirect('/');
  return user;
};

const renderError = (error: unknown): { message: string } => {
  return {
    message: error instanceof Error ? error.message : 'An error occured!',
  };
};

export const fetchFeaturedProducts = async () => {
  const products = await db.product.findMany({
    where: {
      featured: true,
    },
  });
  return products;
};

export const fetchAllProducts = async ({ search = '' }: { search: string }) => {
  return db.product.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    where: {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
      ],
    },
  });
};

export const fetchSingleProduct = async (productId: string) => {
  const product = await db.product.findUnique({
    where: {
      id: productId,
    },
  });

  if (!product) redirect('/products');
  return product;
};

export const createProductAction: actionFunction = async (
  prevState,
  formData
) => {
  const user = await getAuthUser();

  try {
    const rawData = Object.fromEntries(formData);

    const file = formData.get('image') as File;
    const validatedFields = validateWithZodSchema(productSchema, rawData);
    const validatedImageFile = validateWithZodSchema(imageSchema, {
      image: file,
    });

    const imagePath = await uploadImage(validatedImageFile.image);

    await db.product.create({
      data: {
        ...validatedFields,
        image: imagePath,
        clerkId: user.id,
      },
    });
  } catch (error) {
    return renderError(error);
  }
  redirect('/admin/products');
};

export const fetchAdminProducts = async () => {
  await getAdminUser();
  const products = await db.product.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return products;
};

export const deleteProduct = async (prevState: { productId: string }) => {
  await getAdminUser();

  const { productId } = prevState;

  try {
    const product = await db.product.delete({
      where: {
        id: productId,
      },
    });
    await deleteImage(product.image);
    revalidatePath('admin/products');
    return { message: 'Product removed!' };
  } catch (error) {
    renderError(error);
  }
};

export const fetchAdminProductDetails = async (productId: string) => {
  await getAdminUser();

  const product = db.product.findUnique({
    where: {
      id: productId,
    },
  });

  if (!product) redirect('/admin/products');
  return product;
};

export const updateProductAction = async (
  prevState: any,
  formData: FormData
) => {
  await getAdminUser();
  try {
    const productId = formData.get('id') as string;
    const rawData = Object.fromEntries(formData);
    const validatedFields = validateWithZodSchema(productSchema, rawData);

    await db.product.update({
      where: {
        id: productId,
      },
      data: {
        ...validatedFields,
      },
    });
    revalidatePath(`admin/products/${productId}/edit`);
    return { message: 'Product Updated Successfully...' };
  } catch (error) {
    return renderError(error);
  }
};

export const updateProductImageAction = async (
  prevState: any,
  formData: FormData
) => {
  await getAdminUser();
  try {
    const image = formData.get('image') as File;
    const productId = formData.get('id') as string;
    const prevImage = formData.get('url') as string;
    console.log('****', image, productId, prevImage);

    const validatedFile = validateWithZodSchema(imageSchema, { image });
    const imgPath = await uploadImage(validatedFile.image);

    await deleteImage(prevImage);
    await db.product.update({
      where: {
        id: productId,
      },
      data: {
        image: imgPath,
      },
    });
    revalidatePath(`admin/products/${productId}/edit`);
    return { message: 'Product Image Updated Successfully...' };
  } catch (error) {
    return renderError(error);
  }
};

export const fetchFavoriteId = async ({ productId }: { productId: string }) => {
  const user = await getAuthUser();
  const favorite = await db.favorite.findFirst({
    where: {
      productId,
      clerkId: user.id,
    },
    select: {
      id: true,
    },
  });
  return favorite?.id || null;
};

export const toggleFavoriteAction = async (
  prevState: { productId: string; favoriteId: string | null; pathname: string },
  formData: FormData
) => {
  const user = await getAuthUser();
  const { productId, favoriteId, pathname } = prevState;
  console.log('*****Actions******', pathname);

  try {
    if (favoriteId) {
      await db.favorite.delete({ where: { id: favoriteId } });
    } else {
      await db.favorite.create({
        data: {
          productId,
          clerkId: user.id,
        },
      });
    }
    revalidatePath(pathname);
    return { message: favoriteId ? 'Removed from faves' : 'Added to faves' };
  } catch (error) {
    return renderError(error);
  }
};

export const fetchUserFavorites = async () => {
  const user = await getAuthUser();
  const favorite = await db.favorite.findMany({
    where: { clerkId: user.id },
    include: {
      product: true,
    },
  });

  return favorite;
};

export const createReview = async (prevState: any, formData: FormData) => {
  const user = await getAuthUser();

  try {
    const rawData = Object.fromEntries(formData);
    const validatedFields = validateWithZodSchema(reviewSchema, rawData);
    await db.review.create({
      data: { ...validatedFields, clerkId: user.id },
    });
    revalidatePath(`/products/${validatedFields.productId}`);
    return { message: 'Review submitted successfully' };
  } catch (error) {
    return renderError(error);
  }
};

export const fetchProductReviews = async (productId: string) => {
  const reviews = db.review.findMany({
    where: {
      productId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  return reviews;
};

export const fetchProductReviewsByuser = async () => {
  const user = await getAuthUser();

  const reviews = await db.review.findMany({
    where: {
      clerkId: user.id,
    },
    select: {
      comment: true,
      id: true,
      rating: true,
      product: {
        select: {
          image: true,
          name: true,
        },
      },
    },
  });

  return { message: 'Review submitted successfully' };
};

export const deleteReview = async (prevState: { reviewId: string }) => {
  const { reviewId } = prevState;
  const user = await getAuthUser();

  try {
    await db.review.delete({
      where: {
        id: reviewId,
        clerkId: user.id,
      },
    });

    revalidatePath('/reviews');
  } catch (error) {
    renderError(error);
  }

  return { message: 'Review submitted successfully' };
};

export const findExistingReview = async (
  prevState: any,
  formData: FormData
) => {
  return { message: 'Review submitted successfully' };
};

export const fetchProductRating = async (productId: string) => {
  const result = await db.review.groupBy({
    by: ['productId'],
    _avg: {
      rating: true,
    },
    _count: {
      rating: true,
    },
    where: { productId },
  });

  return {
    rating: result[0]?._avg?.rating?.toFixed(1) ?? 0,
    count: result[0]?._count?.rating ?? 0,
  };
};
