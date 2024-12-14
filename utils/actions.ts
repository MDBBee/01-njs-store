'use server';
import db from '@/utils/db';
import { redirect } from 'next/navigation';
import { actionFunction } from '@/utils/types';

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
  return { message: 'hi' };
};
