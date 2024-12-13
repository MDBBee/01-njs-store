import { FaHeart } from 'react-icons/fa6';
import { Button } from '../ui/button';

function FavoriteToggleButton({
  productId,
  className = '',
}: {
  productId: string;
  className?: string;
}) {
  return (
    <Button
      size="icon"
      variant="outline"
      className={`p-2 cursor-pointer ${className}`}
    >
      <FaHeart />
    </Button>
  );
}
export default FavoriteToggleButton;
