import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Dispatch, SetStateAction } from 'react';
import { cn } from '@/lib/utils';

interface DrawerSlideUpProps {
  isOpen?: boolean;
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
  title: string;
  content: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  description?: string;
}

const DrawerSlideUp = ({ children, title, content, isOpen, setIsOpen, className, description }: DrawerSlideUpProps) => {
  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      {children && <DrawerTrigger asChild>{children}</DrawerTrigger>}
      <DrawerContent className={cn(className)}>
        <DrawerHeader>
          <DrawerTitle className='text-xl capitalize'>{title}</DrawerTitle>
          {description && <DrawerDescription>{description}</DrawerDescription>}
        </DrawerHeader>
        <div className='mx-auto'>{content}</div>
        <DrawerFooter className='items-center'>
          <DrawerClose asChild>
            <Button variant='outline'>Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default DrawerSlideUp;
