import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { APP_FEE_AMOUNT } from '@/lib/constants';
import { formatCurrency } from '@/lib/helpers';
import { getLatestTransactions } from '@/services/orders';
import Image from 'next/image';

interface LatestTransactionsStatProps {
  searchParams: { [key: string]: string };
}

const LatestTransactionsStat = async ({ searchParams }: LatestTransactionsStatProps) => {
  const transactions = await getLatestTransactions(searchParams);

  return (
    <Card className='xl:col-span-3 row-span-2 gap-4 lg:col-span-6 col-span-12'>
      <CardHeader>
        <CardTitle>Latest Transactions</CardTitle>
      </CardHeader>
      <CardContent className='flex flex-col gap-2 px-4'>
        {transactions.map((trans) => (
          <div key={trans.id} className='flex items-start justify-between border rounded-md p-2'>
            <div className='flex items-start gap-2'>
              <figure className='size-12 relative'>
                <Image
                  src={trans.user.image || '/default-avatar.png'}
                  alt={trans.user.name || 'User Name'}
                  width={48}
                  height={48}
                  className='absolute inset-0 w-full h-full object-cover rounded-sm'
                />
              </figure>
              <div className='flex flex-col items-start gap-1'>
                <span className='leading-none text-sm'>Order payment</span>
                <Badge variant='outline' className='text-xs font-manrope'>
                  {trans.user.name}
                </Badge>
              </div>
            </div>
            <Badge variant='outline' className='border-green-500 bg-green-500/10 text-green-500 font-manrope'>
              {formatCurrency('VND', trans.total * APP_FEE_AMOUNT)}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default LatestTransactionsStat;
