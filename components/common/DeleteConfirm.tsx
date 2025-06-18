import { useRef, useTransition } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';

interface DeleteConfirmProps {
  setIsDeleteOpen?: (isOpen: boolean) => void;
  id?: string;
  serverAction?: (id: string) => Promise<{ success?: string; error?: string } | void>;
  confirmText: string;
  clientAction?: () => void;
}

const DeleteConfirm = ({ id, serverAction, confirmText, setIsDeleteOpen, clientAction }: DeleteConfirmProps) => {
  const [isPending, startTransition] = useTransition();
  const btnCloseRef = useRef<HTMLButtonElement>(null);

  const handleDelete = () => {
    startTransition(() => {
      if (id && serverAction)
        serverAction(id).then((res) => {
          if (res?.error) {
            toast.error(res?.error);
          } else {
            toast.success(res?.success);
          }
          setIsDeleteOpen?.(false);
        });
      else {
        clientAction?.();
        btnCloseRef.current?.click();
      }
    });
  };

  return (
    <div className='space-y-4'>
      <p>{confirmText}</p>
      <div className='flex items-center gap-x-4'>
        <Button
          variant='outline'
          size='lg'
          className='flex-1 text-lg'
          onClick={() => (setIsDeleteOpen ? setIsDeleteOpen(false) : btnCloseRef.current?.click())}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button variant='destructive' size='lg' className='flex-1 text-lg' onClick={handleDelete} disabled={isPending}>
          Delete
        </Button>
        <DialogClose asChild>
          <button ref={btnCloseRef} hidden></button>
        </DialogClose>
      </div>
    </div>
  );
};

export default DeleteConfirm;
