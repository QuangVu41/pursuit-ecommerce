'use client';

import { Form } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { DialogClose } from '@/components/ui/dialog';
import { useRef } from 'react';
import { cn } from '@/lib/utils';

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
      <form className={cn('space-y-3 px-4', className)} onSubmit={form.handleSubmit(handleFormSubmit)}>
        {children}
        {isModal && (
          <DialogClose asChild>
            <button type='button' ref={ref} hidden></button>
          </DialogClose>
        )}
      </form>
    </Form>
  );
};

export default FormWrapper;
