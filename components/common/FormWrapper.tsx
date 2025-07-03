'use client';

import { Form } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { useRef } from 'react';
import { cn } from '@/lib/utils';
import { SheetClose } from '@/components/ui/sheet';

interface FormWrapperProps<T extends Record<string, any>> {
  form: UseFormReturn<T>;
  handleSubmit: (data: T, btnCloseRef?: HTMLButtonElement | null) => void;
  children: React.ReactNode;
  className?: string;
  isModal?: boolean;
}

const FormWrapper = <T extends Record<string, any>>({
  form,
  handleSubmit,
  children,
  className,
  isModal = true,
}: FormWrapperProps<T>) => {
  const ref = useRef<HTMLButtonElement>(null);

  const handleFormSubmit = async (data: T) => {
    handleSubmit(data, ref.current);
  };

  return (
    <Form {...form}>
      <form className={cn('space-y-3 !px-4', className)} onSubmit={form.handleSubmit(handleFormSubmit)}>
        {children}
        {isModal && (
          <SheetClose asChild>
            <button type='button' ref={ref} hidden></button>
          </SheetClose>
        )}
      </form>
    </Form>
  );
};

export default FormWrapper;
