'use client';

import { ProductVariantWithPayLoad } from '@/types/products';
import { useProdImgPreviewStore } from '@/components/home/products/ProdImagePreviewProvider';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useProdAddToCartStore } from './ProdAddToCartProvider';
import { Check } from 'lucide-react';

interface ProdSummaryVariantProps {
  productVariants: ProductVariantWithPayLoad[];
}

const ProdSummaryVariant = ({ productVariants }: ProdSummaryVariantProps) => {
  const setFirstAttrId = useProdAddToCartStore((state) => state.setFirstAttrId);
  const setSecondAttrId = useProdAddToCartStore((state) => state.setSecondAttrId);
  const firstAttrId = useProdAddToCartStore((state) => state.firstAttrId);
  const secondAttrId = useProdAddToCartStore((state) => state.secondAttrId);
  const setVariantPrice = useProdAddToCartStore((state) => state.setVariantPrice);
  const setHasError = useProdAddToCartStore((state) => state.setHasError);
  const hasTwoAttrs = useProdAddToCartStore((state) => state.hasTwoAttrs);
  const setVariantImg = useProdImgPreviewStore((state) => state.setVariantImg);
  const firstVariant = Object.entries(Object.groupBy(productVariants, (variant) => variant.firstAttr.attribute.name));
  const secondVariant = productVariants.every((variant) => variant.secondAttr)
    ? Object.entries(
        Object.groupBy(productVariants, (variant) => (variant.secondAttr ? variant.secondAttr.attribute.name : ''))
      )
    : null;

  return (
    <div className='flex flex-col gap-y-5 mt-2'>
      {firstVariant.map(([attrName, variants]) => (
        <div key={attrName} className='flex items-start'>
          <h2 className='text-base w-[100px] text-muted-foreground capitalize shrink-0'>{attrName}</h2>
          <div className='flex flex-wrap items-center gap-2'>
            {variants
              ?.reduce((res, variant) => {
                const hasImg = variants.some((v) => v.firstAttr.name === variant.firstAttr.name && v.imageUrl);
                if (res.some((v) => v.firstAttr.name === variant.firstAttr.name)) return res;
                if (hasImg && !variant.imageUrl) return res;
                return [...res, variant];
              }, [] as ProductVariantWithPayLoad[])
              .map((variant) => (
                <Button
                  key={variant.id}
                  variant='outlineHover'
                  className={`capitalize rounded-none items-center h-auto !px-4 relative ${
                    firstAttrId === variant.firstAttrId ? 'border-home-primary text-home-primary' : ''
                  }`}
                  onMouseOver={() =>
                    variant.imageUrl &&
                    variant.altText &&
                    setVariantImg({ imgUrl: variant.imageUrl, altText: variant.altText })
                  }
                  onTouchStart={() =>
                    variant.imageUrl &&
                    variant.altText &&
                    setVariantImg({ imgUrl: variant.imageUrl, altText: variant.altText })
                  }
                  onMouseOut={() => setVariantImg({ imgUrl: '', altText: '' })}
                  onTouchEnd={() => setVariantImg({ imgUrl: '', altText: '' })}
                  onClick={() => {
                    setFirstAttrId(variant.firstAttr.id);
                    if (hasTwoAttrs && secondAttrId) setHasError(false);
                    if (!hasTwoAttrs) setHasError(false);
                    if (hasTwoAttrs && firstAttrId === variant.firstAttrId) {
                      setFirstAttrId('');
                      setVariantPrice(0);
                      return;
                    }
                    if (!hasTwoAttrs && firstAttrId === variant.firstAttrId) {
                      setFirstAttrId('');
                      setVariantPrice(0);
                      return;
                    }
                    if (hasTwoAttrs && secondAttrId) {
                      const v = variants.find(
                        (v) => v.firstAttrId === variant.firstAttrId && v.secondAttrId === secondAttrId && v.stock !== 0
                      );
                      if (v) {
                        return setVariantPrice(v.price);
                      }
                    }
                    if (!hasTwoAttrs) setVariantPrice(variant.price);
                  }}
                  disabled={
                    secondAttrId
                      ? !variants.find(
                          (v) =>
                            v.firstAttrId === variant.firstAttrId && v.secondAttrId === secondAttrId && v.stock !== 0
                        )
                      : variants.filter((v) => v.firstAttrId === variant.firstAttrId).every((v) => v.stock === 0)
                  }
                >
                  {variant.imageUrl && (
                    <figure className='size-6 relative'>
                      <Image
                        src={variant.imageUrl}
                        alt='Variant img'
                        className='absolute top-0 left-0 bottom-0 right-0 w-full h-full object-cover'
                        width={24}
                        height={24}
                      />
                    </figure>
                  )}
                  {variant.firstAttr.name}
                  {firstAttrId === variant.firstAttrId && (
                    <>
                      <div className='w-0 h-0 border-b-[16px] border-b-home-primary border-l-[16px] border-l-transparent absolute bottom-0 right-0'></div>
                      <Check className='size-[10px] stroke-white absolute bottom-0 right-0 z-10' />
                    </>
                  )}
                </Button>
              ))}
          </div>
        </div>
      ))}
      {secondVariant &&
        secondVariant.map(([attrName, variants]) => (
          <div key={attrName} className='flex items-start'>
            <h2 className='text-base w-[100px] text-muted-foreground capitalize shrink-0'>{attrName}</h2>
            <div className='flex flex-wrap items-center gap-2'>
              {variants
                ?.reduce((res, variant) => {
                  if (res.some((v) => v.secondAttr?.name === variant.secondAttr?.name)) return res;
                  return [...res, variant];
                }, [] as ProductVariantWithPayLoad[])
                .map((variant) => (
                  <Button
                    key={variant.id}
                    variant='outlineHover'
                    className={`capitalize rounded-none items-center h-auto relative !px-4 ${
                      secondAttrId === variant.secondAttrId ? 'border-home-primary text-home-primary' : ''
                    }`}
                    onClick={() => {
                      setSecondAttrId(variant.secondAttr?.id);
                      if (hasTwoAttrs && firstAttrId) setHasError(false);
                      if (hasTwoAttrs && secondAttrId === variant.secondAttrId) {
                        setSecondAttrId('');
                        setVariantPrice(0);
                        return;
                      }
                      if (hasTwoAttrs && firstAttrId) {
                        const v = variants.find(
                          (v) =>
                            v.firstAttrId === firstAttrId && v.secondAttrId === variant.secondAttrId && v.stock !== 0
                        );
                        if (v) {
                          return setVariantPrice(v.price);
                        }
                      }
                    }}
                    disabled={
                      firstAttrId
                        ? !variants.find(
                            (v) =>
                              v.firstAttrId === firstAttrId && v.secondAttrId === variant.secondAttrId && v.stock !== 0
                          )
                        : variants.filter((v) => v.secondAttrId === variant.secondAttrId).every((v) => v.stock === 0)
                    }
                  >
                    {variant.secondAttr?.name}
                    {secondAttrId === variant.secondAttrId && (
                      <>
                        <div className='w-0 h-0 border-b-[16px] border-b-home-primary border-l-[16px] border-l-transparent absolute bottom-0 right-0'></div>
                        <Check className='size-[10px] stroke-white absolute bottom-0 right-0 z-10' />
                      </>
                    )}
                  </Button>
                ))}
            </div>
          </div>
        ))}
    </div>
  );
};

export default ProdSummaryVariant;
