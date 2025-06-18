'use client';

import { logout } from '@/actions/auth';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface DropdownItemLogoutBtnProps {
  className?: string;
}

const DropdownItemLogoutBtn = ({ className }: DropdownItemLogoutBtnProps) => {
  const handleLogout = () => {
    logout().then((res) => {
      if (res?.error) toast.error(res.error);
    });
  };

  return (
    <DropdownMenuItem onClick={handleLogout} className={cn('text-foreground', className)}>
      <LogOut className='text-inherit' />
      Log out
    </DropdownMenuItem>
  );
};

export default DropdownItemLogoutBtn;
