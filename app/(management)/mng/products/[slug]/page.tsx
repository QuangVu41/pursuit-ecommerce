import Heading from '@/components/common/Heading';
import CateSelectItems from '@/components/management/categories/CateSelectItems';
import ProdForm from '@/components/management/products/ProdForm';
import { getAllAttributes } from '@/services/attributes';
import { getProductBySlug } from '@/services/products';
import { getProductReviews } from '@/services/reviews';
import { ProductWithPayLoad } from '@/types/products';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(decodeURIComponent(slug));

  return {
    title: `Edit Product ${product?.name}`,
  };
}

const EditProductPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  let { slug } = await params;
  slug = decodeURIComponent(slug);
  const product = await getProductBySlug(slug);
  const attributes = await getAllAttributes();
  const prodReviews = await getProductReviews(product?.id as string);

  if (!product) notFound();

  return (
    <>
      <Heading title='Edit Product' />
      <ProdForm
        mode='edit'
        product={product as ProductWithPayLoad}
        cateSelectItems={<CateSelectItems showSubCates />}
        attributes={attributes}
        prodReviews={prodReviews}
      />
    </>
  );
};

export default EditProductPage;
