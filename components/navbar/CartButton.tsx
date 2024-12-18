import Link from 'next/link';
import { Button } from '../ui/button';
import { LuShoppingCart } from 'react-icons/lu';
import { fetchCartItems } from '@/utils/actions';

async function CartButton() {
  const numItemsInCart = await fetchCartItems();

  return (
    <Button
      asChild
      variant="outline"
      size="icon"
      className="flex justify-center items-center relative"
    >
      <Link href="/cart" className="rounded-[4px] group">
        <LuShoppingCart />
        <span className="absolute -top-3 -right-3 text-white bg-primary flex justify-center items-center h-6 w-6 rounded-full group-hover:bg-purple-400 duration-300">
          {numItemsInCart}
        </span>
      </Link>
    </Button>
  );
}
export default CartButton;
