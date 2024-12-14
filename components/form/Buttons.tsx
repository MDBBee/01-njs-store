'use client';

import { ReloadIcon } from '@radix-ui/react-icons';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SignInButton } from '@clerk/nextjs';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { LuTrash2, LuPen } from 'react-icons/lu';
import { TooltipInfo } from '@/components/form/ToolTip';

type btnSize = 'default' | 'lg' | 'sm';

type SubmitButtonProps = {
  className?: string;
  text?: string;
  size?: btnSize;
};

export function SubmitButton({
  className = '',
  text = 'submit',
  size = 'lg',
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className={cn('capitalize', className)}
      size={size}
    >
      {pending ? (
        <>
          <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
          Please wait...
        </>
      ) : (
        text
      )}
    </Button>
  );
}

type actionType = 'edit' | 'delete';

export function IconButton({
  actionType,
  name,
}: {
  actionType: actionType;
  name: string;
}) {
  const { pending } = useFormStatus();
  const renderIcon = () => {
    switch (actionType) {
      case 'edit':
        return <LuPen />;
      case 'delete':
        return <LuTrash2 />;
      default:
        const never: never = actionType;
        throw new Error(`Unkown action type!`);
    }
  };

  return (
    <TooltipInfo text={`${actionType}  "${name}"  product`}>
      <Button type="submit" size="icon" variant="outline">
        {pending ? <ReloadIcon className="animate-spin" /> : renderIcon()}
      </Button>
    </TooltipInfo>
  );
}
