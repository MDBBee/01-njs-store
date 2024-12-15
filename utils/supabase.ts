import { createClient } from '@supabase/supabase-js';

const bucket = 'main-bucket';

export const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_KEY as string
);

export const uploadImage = async (image: File) => {
  const timeStamp = Date.now();
  const imageNewName = `${timeStamp}-${image.name}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(imageNewName, image, {
      cacheControl: '3600',
    });

  if (!data) throw new Error('Image upload was unsuccessful !!');

  return supabase.storage.from(bucket).getPublicUrl(imageNewName).data
    .publicUrl;
};

export const deleteImage = (url: string) => {
  const imageName = url.split('/').pop();
  if (!imageName) throw new Error('Invalid URL');
  return supabase.storage.from(bucket).remove([imageName]);
};
