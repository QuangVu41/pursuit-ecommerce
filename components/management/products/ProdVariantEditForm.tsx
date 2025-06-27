import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProdVariantWithIdType } from '@/types/products';
import { useProdVariantContext } from './ProdVariantProvider';
import { useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import FieldWithLabel from '@/components/common/FieldWithLabel';
import { Button } from '@/components/ui/button';
import { FilePenLine, FilePlus2 } from 'lucide-react';
import Image from 'next/image';
import { MAX_IMAGE_SIZE, MAX_PRODUCT_PRICE, MAX_PRODUCT_STOCK } from '@/lib/constants';
import { toast } from 'sonner';

interface ProdVariantEditFormProps {
  variant: ProdVariantWithIdType;
}

const ProdVariantEditForm = ({ variant }: ProdVariantEditFormProps) => {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [imgPreUrl, setImgPreUrl] = useState('');
  const {
    fieldVariantArrUtils: { fields, update },
    attributes,
    isPending,
  } = useProdVariantContext();
  const [fieldValues, setFieldValues] = useState({
    firstAttrId: variant.firstAttrId,
    secondAttrId: variant.secondAttrId,
    imageFile: variant.imageFile,
    price: variant.price,
    stock: variant.stock,
  });
  const fieldIndex = fields.findIndex((field) => field.id === variant.id);
  const firstAttrArr = attributes.find((attr) =>
    attr.productAttributeValues.some((value) => value.id === variant.firstAttrId)
  );
  const secondAttrArr = attributes.find((attr) =>
    attr.productAttributeValues.some((value) => value.id === variant.secondAttrId)
  );

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    const file = files?.[0];
    if (file) {
      if (file.size > MAX_IMAGE_SIZE) return toast.error(`Image size cannot exceed ${MAX_IMAGE_SIZE / 1024 / 1024}MB!`);

      if (imgPreUrl) URL.revokeObjectURL(imgPreUrl);
      const imageUrl = URL.createObjectURL(file);
      setImgPreUrl(imageUrl);
      return setFieldValues((prev) => ({ ...prev, [name]: file }));
    }
    setFieldValues((prev) => ({ ...prev, [name]: value }));
    if (inputFileRef.current) inputFileRef.current.value = '';
  };

  const handleSaveChanges = () => {
    if (imgPreUrl && variant.imageUrl) URL.revokeObjectURL(variant.imageUrl);
    if (fieldValues.price > MAX_PRODUCT_PRICE) return toast.error(`Price cannot exceed ${MAX_PRODUCT_PRICE}!`);
    if (fieldValues.stock > MAX_PRODUCT_STOCK) return toast.error(`Stock cannot exceed ${MAX_PRODUCT_STOCK}!`);

    const updatedVariant = {
      ...variant,
      ...fieldValues,
      imageUrl: imgPreUrl || variant.imageUrl,
      variantName: `${
        firstAttrArr?.productAttributeValues.find((value) => value.id === fieldValues.firstAttrId)?.name
      }${
        fieldValues.secondAttrId
          ? ' - ' + secondAttrArr?.productAttributeValues.find((value) => value.id === fieldValues.secondAttrId)?.name
          : ''
      }`,
    };
    update(fieldIndex, updatedVariant);
  };

  return (
    <div className='flex flex-col gap-y-3'>
      <div className='flex items-center gap-x-2'>
        <FieldWithLabel htmlFor='select-attr1' label={firstAttrArr!.name + '*'} className='flex-1'>
          <Select
            defaultValue={fieldValues.firstAttrId}
            onValueChange={(value) =>
              handleFieldChange({ target: { name: 'firstAttrId', value } } as React.ChangeEvent<HTMLInputElement>)
            }
            disabled={isPending}
          >
            <SelectTrigger className='w-full font-manrope' id='select-attr1'>
              <SelectValue placeholder='Attributes' />
            </SelectTrigger>
            <SelectContent>
              {firstAttrArr?.productAttributeValues.map((value) => (
                <SelectItem key={value.id} value={value.id} className='font-manrope'>
                  {value.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FieldWithLabel>
        {variant.secondAttrId && (
          <FieldWithLabel htmlFor='select-attr2' label={secondAttrArr!.name} className='flex-1'>
            <Select
              defaultValue={fieldValues.secondAttrId}
              onValueChange={(value) =>
                handleFieldChange({ target: { name: 'secondAttrId', value } } as React.ChangeEvent<HTMLInputElement>)
              }
              disabled={isPending}
            >
              <SelectTrigger className='w-full font-manrope' id='select-attr2'>
                <SelectValue placeholder='Attributes' />
              </SelectTrigger>
              <SelectContent>
                {secondAttrArr?.productAttributeValues.map((value) => (
                  <SelectItem key={value.id} value={value.id} className='font-manrope'>
                    {value.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FieldWithLabel>
        )}
      </div>
      <FieldWithLabel htmlFor='price' label='Price (Default to the Regular Price above)'>
        <Input
          id='price'
          value={fieldValues.price}
          type='number'
          maxLength={10}
          name='price'
          placeholder='₫ 70000'
          onChange={handleFieldChange}
          disabled={isPending}
        />
      </FieldWithLabel>
      <FieldWithLabel htmlFor='stock' label='Stock'>
        <Input
          id='stock'
          value={fieldValues.stock}
          type='number'
          name='stock'
          placeholder='100'
          onChange={handleFieldChange}
          disabled={isPending}
        />
      </FieldWithLabel>
      <FieldWithLabel htmlFor='image' label='Image'>
        <figure
          className='group h-52 max-w-52 relative flex flex-col items-center justify-center bg-muted rounded-lg shadow-md cursor-pointer p-2 overflow-hidden'
          onClick={() => !isPending && inputFileRef.current?.click()}
        >
          {(imgPreUrl || variant.imageUrl) && (
            <>
              <Image
                src={imgPreUrl || variant.imageUrl!}
                alt={`${variant.altText || `Product variant image ${variant.id}`}`}
                height={208}
                width={208}
                className='object-cover absolute inset-0 w-full h-full'
              />
              <FilePenLine className='w-5 h-5 text-foreground/70 group-hover:text-foreground top-2 right-2 absolute' />
            </>
          )}
          {!imgPreUrl && !variant.imageUrl && (
            <>
              <FilePlus2 className='w-5 h-5 text-primary/70 group-hover:text-primary top-2 right-2 absolute' />
              <p className='font-manrope text-xl font-bold text-foreground/70 group-hover:text-foreground'>870 X 870</p>
              <p className='text-foreground/70 group-hover:text-foreground text-center text-sm w-9/10'>
                Upload an image according to the expected ratio
              </p>
            </>
          )}
          <input ref={inputFileRef} type='file' id='image' hidden onChange={handleFieldChange} name='imageFile' />
        </figure>
      </FieldWithLabel>
      <Button
        className='w-full lg:h-[52px] h-12 text-lg'
        type='button'
        onClick={handleSaveChanges}
        disabled={isPending}
      >
        Save Changes
      </Button>
    </div>
  );
};

export default ProdVariantEditForm;
