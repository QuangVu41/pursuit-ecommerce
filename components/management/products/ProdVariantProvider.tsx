import { usePersistedVariant } from '@/hooks/use-persisted-variant';
import { ProdFormSchemaType } from '@/schemas/products';
import { ProductAttributeWithValues } from '@/types/attributes';
import { ProdVariantWithIdType } from '@/types/products';
import { createContext, useContext } from 'react';
import { UseFieldArrayReturn } from 'react-hook-form';

interface InitialState {
  attributes: ProductAttributeWithValues[];
  fieldVariantArrUtils: UseFieldArrayReturn<ProdFormSchemaType, 'variants', 'id'>;
  currentVariants: string[];
  handleSelectAttr: (value: string[]) => void;
  handleAppendAllVariants: () => void;
  handleDisableAttr: () => boolean;
  handleAppendVariant: () => void;
  handleAppendSameVariantType: (variant: ProdVariantWithIdType) => void;
  isEnoughVariant: (variant: ProdVariantWithIdType) => boolean;
  isPending: boolean;
}

type ProdVariantProviderProps = {
  children: React.ReactNode;
  attributes: ProductAttributeWithValues[];
  fieldVariantArrUtils: UseFieldArrayReturn<ProdFormSchemaType, 'variants', 'id'>;
  isPending: boolean;
};

const ProdVariantContext = createContext<InitialState | undefined>(undefined);

const ProdVariantProvider = ({ children, fieldVariantArrUtils, attributes, isPending }: ProdVariantProviderProps) => {
  const {
    currentVariants,
    handleSelectAttr,
    handleAppendAllVariants,
    handleDisableAttr,
    handleAppendVariant,
    handleAppendSameVariantType,
    isEnoughVariant,
  } = usePersistedVariant(fieldVariantArrUtils, attributes);

  return (
    <ProdVariantContext.Provider
      value={{
        attributes,
        fieldVariantArrUtils,
        currentVariants,
        handleSelectAttr,
        handleAppendAllVariants,
        handleDisableAttr,
        handleAppendVariant,
        handleAppendSameVariantType,
        isEnoughVariant,
        isPending,
      }}
    >
      {children}
    </ProdVariantContext.Provider>
  );
};

const useProdVariantContext = () => {
  const context = useContext(ProdVariantContext);
  if (!context) {
    throw new Error('useProdVariantContext must be used within a ProdVariantProvider');
  }
  return context;
};

export default ProdVariantProvider;
export { useProdVariantContext };
