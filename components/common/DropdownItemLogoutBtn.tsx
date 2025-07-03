'use client';

import { logout } from '@/actions/auth';
import { Loader2, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useTransition } from 'react';

interface DropdownItemLogoutBtnProps {
  className?: string;
}

const DropdownItemLogoutBtn = ({ className }: DropdownItemLogoutBtnProps) => {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(() =>
      logout().then((res) => {
        if (res?.error) toast.error(res.error);
      })
    );
  };

  return (
    <DropdownMenuItem onClick={handleLogout} className={cn('text-foreground', className)} disabled={isPending}>
      <LogOut className='text-inherit' />
      Log out
      {isPending && <Loader2 className='animate-spin text-muted' />}
    </DropdownMenuItem>
  );
};

export default DropdownItemLogoutBtn;
