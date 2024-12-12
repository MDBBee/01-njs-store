import { FaTachographDigital } from 'react-icons/fa6';
import { Button } from '../ui/button';
import Link from 'next/link';
function Logo() {
  return (
    <Button size="icon" asChild>
      <Link href="/">
        <FaTachographDigital className="w-7 h-7 text-purple-900 hover:text-purple-500 hover:scale-125 hover:rotate-90 duration-500 " />
      </Link>
    </Button>
  );
}
export default Logo;
