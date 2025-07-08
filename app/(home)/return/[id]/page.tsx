import HomeSectionContainer from '@/components/common/HomeSectionContainer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getUserByConnectedAccountId } from '@/services/users';
import { Check, XCircle } from 'lucide-react';
import Link from 'next/link';

interface ReturnPageProps {
  params: Promise<{ id: string }>;
}

const ReturnPage = async ({ params }: ReturnPageProps) => {
  const { id } = await params;
  const user = await getUserByConnectedAccountId(id);
  const isAccountLinked = user && user.stripeConnectedLinked;

  return (
    <HomeSectionContainer className='flex items-center justify-center mb-10 md:mb-[60px]'>
      <Card className='w-[350px] rounded-none'>
        <div className='p-6'>
          <div className='w-full flex justify-center'>
            {isAccountLinked ? (
              <Check className='size-12 rounded-full bg-green-500/30 text-green-500 p-2' />
            ) : (
              <XCircle className='size-12 rounded-full bg-destructive/30 text-destructive p-2' />
            )}
          </div>
          <div className='mt-3 text-center sm:mt-5 w-full'>
            <h3 className='text-lg leading-6 font-medium'>
              {isAccountLinked ? 'Linking was Successful' : 'Linking was failed'}
            </h3>
            <p className='mt-2 text-sm text-muted-foreground'>
              {isAccountLinked
                ? 'Congrats on linking your account to Pursuit. You can now start selling your products.'
                : 'Unfortunately, we could not link your account. Please try again later.'}
            </p>
            <Button variant='homeDefault' className='mt-5 sm:mt-6 w-full rounded-none' asChild>
              {isAccountLinked ? (
                <Link href='/'>Back to Home page</Link>
              ) : (
                <Link href='/billing'>Back to Billing page</Link>
              )}
            </Button>
          </div>
        </div>
      </Card>
    </HomeSectionContainer>
  );
};

export default ReturnPage;
