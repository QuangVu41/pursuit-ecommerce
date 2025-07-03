import HomeSectionContainer from '@/components/common/HomeSectionContainer';
import HomeSectionHeader from '@/components/common/HomeSectionHeader';
import InfiniteTextBanner from '@/components/common/InfiniteTextBanner';
import SectionContent from '@/components/common/SectionContent';
import { ProductWithCateAndPrimaryImg } from '@/types/products';
import ProdCarouselPreview from './ProdCarouselPreview';
import ProdSaleBanner from '@/components/home/products/ProdSaleBanner';
import { getSaleBanner } from '@/services/banners';
interface ProdSaleSectionProps {
  products: ProductWithCateAndPrimaryImg[];
}

const ProdSaleSection = async ({ products }: ProdSaleSectionProps) => {
  const saleBanner = await getSaleBanner();

  return (
    !!products.length && (
      <>
        {saleBanner && <InfiniteTextBanner text={saleBanner.description} />}
        <HomeSectionContainer>
          <HomeSectionHeader
            title='Hurry, don’t miss out on this offer'
            buttonLink='/products'
            description={saleBanner?.description}
          />
          <SectionContent className='flex flex-col gap-6 lg:gap-[30px]'>
            {saleBanner && <ProdSaleBanner bannerImages={saleBanner.bannerImages} />}
            <ProdCarouselPreview products={products} buttonLink='/products' />
          </SectionContent>
        </HomeSectionContainer>
      </>
    )
  );
};

export default ProdSaleSection;
