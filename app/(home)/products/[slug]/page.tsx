import HomeSectionContainer from '@/components/common/HomeSectionContainer';
import SectionContent from '@/components/common/SectionContent';
import ProdAddToCartProvider from '@/components/home/products/ProdAddToCartProvider';
import ProdBreadcrumbNav from '@/components/home/products/ProdBreadcrumbNav';
import ProdDescription from '@/components/home/products/ProdDescription';
import ProdImgPreviewProvider from '@/components/home/products/ProdImagePreviewProvider';
import ProdImgPreview from '@/components/home/products/ProdImgPreview';
import ProdReviewSection from '@/components/home/products/ProdReviewSection';
import ProdSimilarProducts from '@/components/home/products/ProdSimilarProducts';
import ProdSummary from '@/components/home/products/ProdSummary';
import { getProductBySlug, getSimilarProducts } from '@/services/products';
import { ProductWithPayLoad } from '@/types/products';
import 'react-quill-new/dist/quill.snow.css';

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
  const similarProducts = await getSimilarProducts(product?.categoryId, product?.id);

  return (
    <HomeSectionContainer>
      <ProdBreadcrumbNav prod={product as ProductWithPayLoad} />
      <ProdAddToCartProvider
        hasTwoAttrs={!!product?.productVariants.find((v) => v.firstAttrId && v.secondAttrId)}
        regularPrice={product?.regularPrice || 0}
      >
        <ProdImgPreviewProvider mainImg={{ imgUrl: mainImg!.imageUrl, altText: mainImg!.altText }}>
          <SectionContent className='!mt-5'>
            <div className='flex items-start justify-between gap-20'>
              <ProdImgPreview prodImgs={product!.productImages} />
              <ProdSummary prod={product as ProductWithPayLoad} />
            </div>
            <ProdDescription desc={product?.description} />
            <ProdReviewSection />
            <ProdSimilarProducts prods={similarProducts} />
          </SectionContent>
        </ProdImgPreviewProvider>
      </ProdAddToCartProvider>
    </HomeSectionContainer>
  );
};

export default ProductPage;
