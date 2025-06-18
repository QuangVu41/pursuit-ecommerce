import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Ellipsis, SquarePen, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface DropdownActionsProps {
  setIsEditOpen: (isOpen: boolean) => void;
  setIsDeleteOpen: (isOpen: boolean) => void;
  editLink?: string;
}

const DropdownActions = ({ setIsEditOpen, setIsDeleteOpen, editLink }: DropdownActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='lighterGhost' size='icon'>
          <Ellipsis className='size-6' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem
          className='flex items-center gap-2'
          onClick={() => !editLink && setIsEditOpen(true)}
          asChild={!!editLink}
        >
          {editLink ? (
            <Link href={editLink} className='flex items-center gap-2 w-full'>
              <SquarePen className='text-foreground' />
              Edit
            </Link>
          ) : (
            <>
              <SquarePen className='text-foreground' />
              Edit
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className='flex items-center gap-2 text-destructive focus:text-destructive'
          onClick={() => setIsDeleteOpen(true)}
        >
          <Trash2 className='text-destructive' />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropdownActions;
