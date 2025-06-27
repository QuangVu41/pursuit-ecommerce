import { ProdFormSchemaType, ProdVariantSchemaType } from '@/schemas/products';
import { ProductAttributeWithValues } from '@/types/attributes';
import { ProdVariantWithIdType } from '@/types/products';
import { useReducer } from 'react';
import { UseFieldArrayReturn } from 'react-hook-form';

interface InitialState {
  currentVariants: string[];
}

interface Action {
  type: string;
  payload: string[];
}

const reducer = (state: InitialState, action: Action) => {
  if (action.type === 'SELECT_VARIANT') return { ...state, currentVariants: action.payload };
  if (action.type === 'RESET_VARIANT') return { ...state, currentVariants: [] };
  return state;
};

const usePersistedVariant = (
  fieldVariantArrUtils: UseFieldArrayReturn<ProdFormSchemaType, 'variants', 'id'>,
  attributes: ProductAttributeWithValues[]
) => {
  const { append, fields, insert } = fieldVariantArrUtils;
  const [{ currentVariants }, dispatch] = useReducer(reducer, {
    currentVariants: [],
  });

  const determineAttrValArr = (variants: string[] | string) => {
    return attributes.filter((attr) => variants.includes(attr.id)).map((attr) => attr.productAttributeValues);
  };

  const isEnoughVariant = (variant: ProdVariantWithIdType) => {
    const attrValArr = determineAttrValArr(variant.parentVariantId);
    const numExistingVariant = fields.filter((field) => field.parentVariantId === variant.parentVariantId).length;
    if (attrValArr.length === 2) {
      return attrValArr[0].length * attrValArr[1].length === numExistingVariant;
    } else {
      return attrValArr[0].length === numExistingVariant;
    }
  };

  const handleSelectAttr = (value: string[]) => {
    console.log(value);
    if (value.length > 2) {
      value.shift();
    }
    dispatch({ type: 'SELECT_VARIANT', payload: value });
  };

  const handleDisableAttr = (): boolean => {
    return fields.some((field) => field.parentVariantId) ? true : false;
  };

  const handleAppendSameVariantType = (variant: ProdVariantWithIdType) => {
    const fieldIndex = fields.findIndex((field) => field.id === variant.id);
    const existingVariant = fields
      .filter((field) => field.parentVariantId === variant.parentVariantId)
      .map((f) => `${f.firstAttrId}`);
    const attrValArr = determineAttrValArr(variant.parentVariantId);
    if (attrValArr.length === 2) {
      const firstArr = attrValArr[0];
      const secondArr = attrValArr[1];
      const newVariant = {
        firstAttrId: firstArr[0].id,
        secondAttrId: secondArr[0].id,
        variantName: `${firstArr[0].name} - ${secondArr[0].name}`,
        parentVariantId: variant.parentVariantId,
        price: 0,
        stock: 0,
      };
      if (!fields.length) append(newVariant);
      else insert(fieldIndex + 1, newVariant);
    } else {
      const attrVal = attrValArr[0].filter((val) => !existingVariant.includes(val.id));
      if (attrVal.length === 0) return;
      const newVariant = {
        firstAttrId: attrVal[0].id,
        variantName: attrVal[0].name,
        parentVariantId: variant.parentVariantId,
        price: 0,
        stock: 0,
      };
      if (!fields.length) append(newVariant);
      else insert(fieldIndex + 1, newVariant);
    }
  };

  const handleAppendVariant = () => {
    const attrValArr = determineAttrValArr(currentVariants);
    console.log(attrValArr);
    if (attrValArr.length === 2) {
      const firstArr = attrValArr[0];
      const secondArr = attrValArr[1];
      const variant = {
        firstAttrId: firstArr[0].id,
        secondAttrId: secondArr[0].id,
        variantName: `${firstArr[0].name} - ${secondArr[0].name}`,
        parentVariantId: currentVariants.join(','),
        price: 0,
        stock: 0,
      };
      append(variant);
    } else {
      const attrVal = attrValArr[0];
      const variant = {
        firstAttrId: attrVal[0].id,
        variantName: attrVal[0].name,
        parentVariantId: currentVariants.join(','),
        price: 0,
        stock: 0,
      };
      append(variant);
    }
    dispatch({ type: 'RESET_VARIANT', payload: [] });
  };

  const handleAppendAllVariants = () => {
    const attrValArr = determineAttrValArr(currentVariants);
    const appendageArr: ProdVariantSchemaType[] = [];
    if (attrValArr.length === 2) {
      const firstArr = attrValArr[0];
      const secondArr = attrValArr[1];
      for (let i = 0; i < firstArr.length; i++) {
        for (let j = 0; j < secondArr.length; j++) {
          const variant = {
            firstAttrId: firstArr[i].id,
            secondAttrId: secondArr[j].id,
            variantName: `${firstArr[i].name} - ${secondArr[j].name}`,
            parentVariantId: currentVariants.join(','),
            price: 0,
            stock: 0,
          };
          appendageArr.push(variant);
        }
      }
    } else {
      const attrVal = attrValArr[0];
      for (let i = 0; i < attrVal.length; i++) {
        const variant = {
          firstAttrId: attrVal[i].id,
          variantName: attrVal[i].name,
          parentVariantId: currentVariants.join(','),
          price: 0,
          stock: 0,
        };
        appendageArr.push(variant);
      }
    }
    append(appendageArr);
    dispatch({ type: 'RESET_VARIANT', payload: [] });
  };

  return {
    currentVariants,
    handleSelectAttr,
    handleDisableAttr,
    handleAppendAllVariants,
    handleAppendVariant,
    handleAppendSameVariantType,
    isEnoughVariant,
  };
};

export { usePersistedVariant };
