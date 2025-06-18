import Heading from '@/components/common/Heading';
import CateSelectItems from '@/components/management/categories/CateSelectItems';
import ProdForm from '@/components/management/products/ProdForm';
import { getAllAttributes } from '@/services/attributes';
import { getProductBySlug } from '@/services/products';
import { ProductWithPayLoad } from '@/types/products';
import { notFound } from 'next/navigation';

const EditProductPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  let { slug } = await params;
  slug = decodeURIComponent(slug);
  const product = await getProductBySlug(slug);
  const attributes = await getAllAttributes();

  if (!product) notFound();

  return (
    <>
      <Heading title='Edit Product' />
      <ProdForm
        mode='edit'
        product={product as ProductWithPayLoad}
        cateSelectItems={<CateSelectItems showSubCates />}
        attributes={attributes}
      />
    </>
  );
};

export default EditProductPage;
