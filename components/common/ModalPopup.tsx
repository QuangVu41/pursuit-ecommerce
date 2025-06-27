'use client';

import { Dispatch, SetStateAction } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DialogDescription } from '@radix-ui/react-dialog';

interface ModalPopupProps {
  isOpen?: boolean;
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
  title: string;
  content: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  description?: string;
}

const ModalPopup = ({ children, title, content, isOpen, setIsOpen, className, description }: ModalPopupProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className={className}>
        <DialogHeader>
          <DialogTitle className='text-lg font-bold'>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
};

export default ModalPopup;
