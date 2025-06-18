import HomeSectionContainer from '@/components/common/HomeSectionContainer';
import SectionContent from '@/components/common/SectionContent';
import { ProductWithCateAndImg } from '@/types/products';
import HomeSectionHeader from '@/components/common/HomeSectionHeader';
import ProdCarouselPreview from './ProdCarouselPreview';

interface ProdPreviewSectionProps {
  title: string;
  description?: string;
  buttonLink: string;
  products: ProductWithCateAndImg[];
}

const ProdPreviewSection = ({ title, description, buttonLink, products }: ProdPreviewSectionProps) => {
  return (
    !!products.length && (
      <HomeSectionContainer>
        <HomeSectionHeader title={title} description={description} buttonLink={buttonLink} />
        <SectionContent className='mt-10'>
          <ProdCarouselPreview products={products} buttonLink={buttonLink} />
        </SectionContent>
      </HomeSectionContainer>
    )
  );
};

export default ProdPreviewSection;
