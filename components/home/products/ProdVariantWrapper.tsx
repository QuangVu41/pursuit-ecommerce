'use client';

import { Button } from '@/components/ui/button';
import { useProdAddToCartStore } from '@/components/home/products/ProdAddToCartProvider';
import { useTransition } from 'react';
import { addToCartAction } from '@/actions/products';
import { toast } from 'sonner';
import { purchaseProduct } from '@/actions/payment';
import { useUserSession } from '@/hooks/use-user-session';
import { useUrl } from '@/hooks/use-url';

interface ProdVariantWrapperProps {
  children: React.ReactNode;
}

const ProdVariantWrapper = ({ children }: ProdVariantWrapperProps) => {
  const user = useUserSession();
  const { router, pathname } = useUrl();
  const [isPending, startTransition] = useTransition();
  const productId = useProdAddToCartStore((state) => state.productId);
  const firstAttrId = useProdAddToCartStore((state) => state.firstAttrId);
  const secondAttrId = useProdAddToCartStore((state) => state.secondAttrId);
  const quantity = useProdAddToCartStore((state) => state.quantity);
  const hasTwoAttrs = useProdAddToCartStore((state) => state.hasTwoAttrs);
  const hasError = useProdAddToCartStore((state) => state.hasError);
  const setHasError = useProdAddToCartStore((state) => state.setHasError);

  const handleAddToCart = () => {
    if (!user) {
      router.push(`/auth/signin?callbackUrl=${pathname}`);
      return;
    }
    if (hasTwoAttrs && (!firstAttrId || !secondAttrId)) return setHasError(true);
    if (!hasTwoAttrs && !firstAttrId) return setHasError(true);
    startTransition(() => {
      addToCartAction({
        productId,
        firstAttrId,
        secondAttrId,
        quantity,
      }).then((res) => {
        if (res?.success) toast.success(res.success);
        else if (res?.error) toast.error(res.error);
      });
    });
  };

  const handlePurchaseNow = () => {
    if (!user) {
      router.push(`/auth/signin?callbackUrl=${pathname}`);
      return;
    }
    if (hasTwoAttrs && (!firstAttrId || !secondAttrId)) return setHasError(true);
    if (!hasTwoAttrs && !firstAttrId) return setHasError(true);
    startTransition(() => {
      purchaseProduct({
        productId,
        firstAttrId,
        secondAttrId,
        quantity,
      }).then((res) => {
        if (res?.error) return toast.error(res.error);
      });
    });
  };

  return (
    <>
      <div className={`p-2 flex flex-col gap-y-5 ${hasError ? 'bg-destructive/5' : ''}`}>
        {children}
        {hasError && <p className='text-sm text-destructive'>Please, chose product variant!</p>}
      </div>
      <div className='flex items-center gap-x-2 2md:gap-x-4 mt-3'>
        <Button
          variant='outlinePrimary'
          size='homeDefault'
          className='rounded-none px-7 py-3 text-base flex-1 2md:flex-none lg:text-lg cursor-pointer'
          onClick={handleAddToCart}
          disabled={isPending}
        >
          Add to Cart
        </Button>
        <Button
          size='homeDefault'
          className='rounded-none px-7 py-3 text-base flex-1 2md:flex-none lg:text-lg cursor-pointer'
          onClick={handlePurchaseNow}
          disabled={isPending}
        >
          Purchase now
        </Button>
      </div>
    </>
  );
};

export default ProdVariantWrapper;
