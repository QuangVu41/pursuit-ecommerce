import HomeSectionContainer from '@/components/common/HomeSectionContainer';
import HomeSectionHeader from '@/components/common/HomeSectionHeader';
import InfiniteTextBanner from '@/components/common/InfiniteTextBanner';
import SectionContent from '@/components/common/SectionContent';
import { ProductWithCateAndImg } from '@/types/products';
import ProdCarouselPreview from './ProdCarouselPreview';
import bannerImg from '@/public/banner.png';
import Image from 'next/image';

interface ProdSaleSectionProps {
  products: ProductWithCateAndImg[];
}

const ProdSaleSection = ({ products }: ProdSaleSectionProps) => {
  return (
    !!products.length && (
      <>
        <InfiniteTextBanner text='🔥GET 50% OFF IN THE BELOW PRODUCT' />
        <HomeSectionContainer>
          <HomeSectionHeader title='Hurry, don’t miss out on this offer' buttonLink='/products' />
          <SectionContent className='mt-10 flex flex-col gap-6 lg:gap-[30px]'>
            <div>
              <figure className='overflow-hidden relative w-full h-[220px] md:h-[360px] bg-home-banner '>
                <Image src={bannerImg} alt='banner' fill className='object-contain' />
              </figure>
            </div>
            <ProdCarouselPreview products={products} buttonLink='/products' />
          </SectionContent>
        </HomeSectionContainer>
      </>
    )
  );
};

export default ProdSaleSection;
