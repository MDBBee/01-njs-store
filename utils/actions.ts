'use server';
import db from '@/utils/db';
import { redirect } from 'next/navigation';
import { actionFunction } from '@/utils/types';
import { currentUser } from '@clerk/nextjs/server';
import { imageSchema, productSchema, validateWithZodSchema } from './schemas';
import { uploadImage } from './supabase';

const getAuthUser = async () => {
  const user = await currentUser();
  if (!user) redirect('/');
  return user;
};

const renderError = (error: unknown): { message: string } => {
  console.log(error);
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
