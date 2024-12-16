import { FaHeart } from 'react-icons/fa6';
import { Button } from '../ui/button';
import { auth } from '@clerk/nextjs/server';
import { CardSignInButton } from '../form/Buttons';
import { fetchFavoriteId } from '@/utils/actions';
import FavoriteToggleForm from './FavoriteToggleForm';

async function FavoriteToggleButton({
  productId,
  className = '',
}: {
  productId: string;
  className?: string;
}) {
  const { userId } = auth();
  if (!userId) return <CardSignInButton />;

  const favoriteId = await fetchFavoriteId({ productId });

  return (
    <FavoriteToggleForm
      favoriteId={favoriteId}
      productId={productId}
      className={className}
    />
  );
  // return (
  //   <Button
  //     size="icon"
  //     variant="outline"
  //     className={`p-2 cursor-pointer ${className}`}
  //   >
  //     <FaHeart />
  //   </Button>
  // );
}
export default FavoriteToggleButton;
