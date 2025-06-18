import { cn } from '@/lib/utils';
import { Form } from '@/components/ui/form';
import { SubmitHandler, UseFormReturn } from 'react-hook-form';
import Social from '@/components/auth/Social';
import Link from 'next/link';

interface AuthFormProps<T extends Record<string, any>> {
  children: React.ReactNode;
  form: UseFormReturn<T>;
  title: string;
  description: string;
  buttonLinkLabel: string;
  buttonLinkHref: string;
  ctaQuestion: string;
  className?: string;
  showSocial?: boolean;
  handleSubmit: SubmitHandler<T>;
}

const AuthForm = <T extends Record<string, any>>({
  className,
  form,
  title,
  description,
  buttonLinkLabel,
  buttonLinkHref,
  ctaQuestion,
  children,
  handleSubmit,
  showSocial = true,
}: AuthFormProps<T>) => {
  return (
    <Form {...form}>
      <form className={cn('flex flex-col gap-5', className)} onSubmit={form.handleSubmit(handleSubmit)}>
        <div className='flex flex-col items-center gap-2 text-center'>
          <h1 className='text-2xl font-bold'>{title}</h1>
          <p className='text-balance text-sm text-muted-foreground'>{description}</p>
        </div>
        <div className='grid gap-5'>
          {children}
          {showSocial && <Social />}
        </div>
        <div className='text-center text-sm'>
          {ctaQuestion}{' '}
          <Link href={buttonLinkHref} className='underline underline-offset-4'>
            {buttonLinkLabel}
          </Link>
        </div>
      </form>
    </Form>
  );
};

export default AuthForm;
