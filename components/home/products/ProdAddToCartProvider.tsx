'use client';

import { createContext, useContext, useState } from 'react';
import { createStore, StoreApi, useStore } from 'zustand';

interface ProdAddToCartStore {
  productId: string;
  regularPrice: number;
  variantPrice?: number;
  hasTwoAttrs: boolean;
  quantity: number;
  firstAttrId: string;
  secondAttrId?: string;
  hasError: boolean;
  setHasError: (hasError: boolean) => void;
  increaseQty: (totalQty: number) => void;
  decreaseQty: () => void;
  setFirstAttrId: (id: string) => void;
  setSecondAttrId: (id?: string) => void;
  setVariantPrice: (newPrice: number) => void;
  setQty: (newQty: number) => void;
}

interface ProdAddToCartProviderProps {
  children: React.ReactNode;
  hasTwoAttrs: boolean;
  regularPrice: number;
  productId: string;
}

const ProdAddToCartContext = createContext<StoreApi<ProdAddToCartStore> | undefined>(undefined);

const ProdAddToCartProvider = ({ children, hasTwoAttrs, regularPrice, productId }: ProdAddToCartProviderProps) => {
  const [store] = useState(() =>
    createStore<ProdAddToCartStore>((set) => ({
      productId,
      regularPrice,
      hasTwoAttrs,
      quantity: 1,
      firstAttrId: '',
      secondAttrId: undefined,
      hasError: false,
      setHasError: (hasError: boolean) => set(() => ({ hasError })),
      setVariantPrice: (newPrice: number) => set({ variantPrice: newPrice }),
      setQty: (newQty: number) => set({ quantity: Math.max(1, newQty) }),
      increaseQty: (totalQty: number) => set((state) => ({ quantity: Math.min(state.quantity + 1, totalQty) })),
      decreaseQty: () => set((state) => ({ quantity: Math.max(1, state.quantity - 1) })),
      setFirstAttrId: (id: string) => set((state) => ({ firstAttrId: id !== state.firstAttrId ? id : '' })),
      setSecondAttrId: (id?: string) => set((state) => ({ secondAttrId: id !== state.secondAttrId ? id : '' })),
    }))
  );

  return <ProdAddToCartContext.Provider value={store}>{children}</ProdAddToCartContext.Provider>;
};

function useProdAddToCartStore<T>(selector: (state: ProdAddToCartStore) => T) {
  const context = useContext(ProdAddToCartContext);

  if (!context) throw new Error('useProdAddToCartStore must be used within a ProdAddToCartProvider');

  return useStore(context, selector);
}

export { useProdAddToCartStore };
export default ProdAddToCartProvider;
