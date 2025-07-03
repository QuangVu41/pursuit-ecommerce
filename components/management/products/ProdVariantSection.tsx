import Empty from '@/components/common/Empty';
import ModalPopup from '@/components/common/ModalPopup';
import SectionContainer from '@/components/common/SectionContainer';
import SectionHeader from '@/components/common/SectionHeader';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import ProdVariantTable from './ProdVariantTable';
import { useProdVariantContext } from './ProdVariantProvider';
import { UseFormReturn } from 'react-hook-form';
import { ProdFormSchemaType } from '@/schemas/products';
import SectionContent from '@/components/common/SectionContent';

interface ProdVariantSectionProps {
  form: UseFormReturn<ProdFormSchemaType>;
  prodVariantForm: React.ReactNode;
}

const ProdVariantSection = ({ prodVariantForm, form }: ProdVariantSectionProps) => {
  const {
    fieldVariantArrUtils: { fields },
    isPending,
  } = useProdVariantContext();

  return (
    <SectionContainer>
      <FormField
        control={form.control}
        name='variants'
        render={() => (
          <FormItem className='block'>
            <FormControl>
              <SectionContent className='!mt-0'>
                <SectionHeader className='mb-2'>
                  <FormLabel className='font-medium text-base'>Product Variants*</FormLabel>
                  <ModalPopup
                    content={prodVariantForm}
                    title='Add Product Variant'
                    description='You can choose maximum 2 attributes and 1 variant type!'
                  >
                    <Button variant='outline' type='button' disabled={isPending}>
                      <Plus /> Add Variant
                    </Button>
                  </ModalPopup>
                </SectionHeader>
                {!fields.length ? <Empty title='Add your product variants.' /> : <ProdVariantTable />}
              </SectionContent>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </SectionContainer>
  );
};

export default ProdVariantSection;
