import Heading from '@/components/common/Heading';
import CateSelectItems from '@/components/management/categories/CateSelectItems';
import ProdForm from '@/components/management/products/ProdForm';
import { getAllAttributes } from '@/services/attributes';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Product',
};

const CreateProductPage = async () => {
  const attributes = await getAllAttributes();

  return (
    <>
      <Heading title='Create Product' />
      <ProdForm mode='create' cateSelectItems={<CateSelectItems showSubCates />} attributes={attributes} />
    </>
  );
};

export default CreateProductPage;
