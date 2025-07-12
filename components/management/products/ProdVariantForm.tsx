import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useRef } from 'react';
import { useProdVariantContext } from './ProdVariantProvider';
import Link from 'next/link';
import { MoveRight } from 'lucide-react';
import { useHasNoVariants } from '@/components/management/products/ProdForm';

const ProdVariantForm = () => {
  const {
    attributes,
    currentVariants,
    handleSelectAttr,
    handleAppendAllVariants,
    handleDisableAttr,
    handleAppendVariant,
    isPending,
  } = useProdVariantContext();
  const btnCloseRef = useRef<HTMLButtonElement>(null);
  const setHasNoVariants = useHasNoVariants((state) => state.setHasNoVariants);

  return attributes.length ? (
    <>
      <ToggleGroup
        type='multiple'
        variant='outline'
        className='w-full flex items-stretch sm:items-center flex-col sm:flex-row flex-wrap'
        value={currentVariants}
        onValueChange={(value) => {
          handleSelectAttr(value);
        }}
      >
        {attributes.map((attr) => (
          <ToggleGroupItem
            key={attr.id}
            value={attr.id}
            className='capitalize text-lg sm:basis-1/3'
            disabled={handleDisableAttr()}
          >
            {attr.name}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <div className='flex items-center gap-x-3'>
        <Button
          variant='outlinePrimary'
          className='flex-1  text-base md:text-lg'
          disabled={currentVariants.length === 0 || isPending}
          onClick={() => {
            handleAppendVariant();
            setHasNoVariants(false);
            btnCloseRef.current?.click();
          }}
        >
          Add variant
        </Button>
        <Button
          className='flex-1  text-base md:text-lg'
          disabled={currentVariants.length === 0 || isPending}
          onClick={() => {
            handleAppendAllVariants();
            setHasNoVariants(false);
            btnCloseRef.current?.click();
          }}
        >
          Add all variants
        </Button>
        <DialogClose asChild>
          <button ref={btnCloseRef} hidden></button>
        </DialogClose>
      </div>
    </>
  ) : (
    <Button variant='link' asChild className='text-base group' disabled={isPending}>
      <Link href='/mng/products/attributes'>
        You have no attributes yet. Create one
        <MoveRight />
      </Link>
    </Button>
  );
};

export default ProdVariantForm;
