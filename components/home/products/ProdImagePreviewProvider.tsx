'use client';

import { createContext, useContext, useState } from 'react';
import { createStore, StoreApi, useStore } from 'zustand';

interface ImgUrlType {
  imgUrl: string;
  altText: string;
}

interface ProdImgPreviewStore {
  mainImg: ImgUrlType;
  variantImg: ImgUrlType;
  setMainImg: (arg: ImgUrlType) => void;
  setVariantImg: (arg: ImgUrlType) => void;
}

interface ProdImgPreviewProviderProps {
  children: React.ReactNode;
  mainImg: ImgUrlType;
}

const ProdImgPreviewContext = createContext<StoreApi<ProdImgPreviewStore> | undefined>(undefined);

const ProdImgPreviewProvider = ({ children, mainImg }: ProdImgPreviewProviderProps) => {
  const [store] = useState(() =>
    createStore<ProdImgPreviewStore>((set) => ({
      mainImg,
      variantImg: {
        imgUrl: '',
        altText: '',
      },
      setMainImg: ({ imgUrl, altText }) => set({ mainImg: { imgUrl, altText } }),
      setVariantImg: ({ imgUrl, altText }) => set({ variantImg: { imgUrl, altText } }),
    }))
  );

  return <ProdImgPreviewContext.Provider value={store}>{children}</ProdImgPreviewContext.Provider>;
};

function useProdImgPreviewStore<T>(selector: (state: ProdImgPreviewStore) => T) {
  const context = useContext(ProdImgPreviewContext);

  if (!context) throw new Error('useProdImgPreviewStore must be used within an ProdImgPreviewProvider');

  return useStore(context, selector);
}

export { useProdImgPreviewStore };

export default ProdImgPreviewProvider;
