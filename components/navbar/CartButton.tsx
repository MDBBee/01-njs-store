import Link from 'next/link';
import { Button } from '../ui/button';
import { LuShoppingCart } from 'react-icons/lu';

function CartButton() {
  const numItemsInCart = 9;

  return (
    <Button
      asChild
      variant="outline"
      size="icon"
      className="flex justify-center items-center relative"
    >
      <Link href="/cart" className="rounded-[4px] group">
        <LuShoppingCart />
        <span className="absolute -top-3 -right-3 text-white bg-purple-900 flex justify-center items-center h-6 w-6 rounded-full group-hover:bg-purple-400">
          {numItemsInCart}
        </span>
      </Link>
    </Button>
  );
}
export default CartButton;
