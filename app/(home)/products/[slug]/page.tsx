import HomeSectionContainer from '@/components/common/HomeSectionContainer';
import SectionContent from '@/components/common/SectionContent';
import ProdAddToCartProvider from '@/components/home/products/ProdAddToCartProvider';
import ProdBreadcrumbNav from '@/components/home/products/ProdBreadcrumbNav';
import ProdImgPreviewProvider from '@/components/home/products/ProdImagePreviewProvider';
import ProdImgPreview from '@/components/home/products/ProdImgPreview';
import ProdSummary from '@/components/home/products/ProdSummary';
import { getProductBySlug } from '@/services/products';
import { ProductWithPayLoad } from '@/types/products';

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const ProductPage = async ({ params }: ProductPageProps) => {
  let { slug } = await params;
  slug = decodeURIComponent(slug);
  const product = await getProductBySlug(slug);
  const mainImg = product?.productImages.find((img) => img.isPrimary);

  return (
    <HomeSectionContainer>
      <ProdBreadcrumbNav prod={product as ProductWithPayLoad} />
      <ProdAddToCartProvider hasTwoAttrs={!!product?.productVariants.find((v) => v.firstAttrId && v.secondAttrId)}>
        <ProdImgPreviewProvider mainImg={{ imgUrl: mainImg!.imageUrl, altText: mainImg!.altText }}>
          <SectionContent className='!mt-5'>
            <div className='flex items-start justify-between gap-20'>
              <ProdImgPreview prodImgs={product!.productImages} />
              <ProdSummary prod={product as ProductWithPayLoad} />
            </div>
          </SectionContent>
        </ProdImgPreviewProvider>
      </ProdAddToCartProvider>
    </HomeSectionContainer>
  );
};

export default ProductPage;
