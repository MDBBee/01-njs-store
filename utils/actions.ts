'use server';
import db from '@/utils/db';
import { redirect } from 'next/navigation';
import { actionFunction } from '@/utils/types';
import { currentUser } from '@clerk/nextjs/server';

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
    const name = formData.get('name') as string;
    const company = formData.get('company') as string;
    const price = Number(formData.get('price') as string);
    const image = formData.get('image') as File;
    const description = formData.get('description') as string;
    const featured = Boolean(formData.get('featured') as string);

    await db.product.create({
      data: {
        name,
        company,
        price,
        image: '/images/product-1.jpg',
        description,
        featured,
        clerkId: user.id,
      },
    });
    return { message: 'Product created' };
  } catch (error) {
    return renderError(error);
  }
};
