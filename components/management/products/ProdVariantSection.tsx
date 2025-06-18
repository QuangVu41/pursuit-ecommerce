import Empty from '@/components/common/Empty';
import ModalPopup from '@/components/common/ModalPopup';
import SectionContainer from '@/components/common/SectionContainer';
import SectionHeader from '@/components/common/SectionHeader';
import SectionTitle from '@/components/common/SectionTitle';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import ProdVariantTable from './ProdVariantTable';
import { useProdVariantContext } from './ProdVariantProvider';
import { useHasNoVariants } from '@/components/management/products/ProdForm';

interface ProdVariantSectionProps {
  prodVariantForm: React.ReactNode;
}

const ProdVariantSection = ({ prodVariantForm }: ProdVariantSectionProps) => {
  const {
    fieldVariantArrUtils: { fields },
    isPending,
  } = useProdVariantContext();
  const hasNoVariants = useHasNoVariants((state) => state.hasNoVariants);

  return (
    <SectionContainer className={`${hasNoVariants ? 'border border-destructive' : ''}`}>
      <SectionHeader>
        <SectionTitle title='Product Variants*' />
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
    </SectionContainer>
  );
};

export default ProdVariantSection;
