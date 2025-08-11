import { getUserSession } from '@/auth';
import Heading from '@/components/common/Heading';
import CateSelectItems from '@/components/management/categories/CateSelectItems';
import ProdForm from '@/components/management/products/ProdForm';
import { getAllAttributes } from '@/services/attributes';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Create Product',
};

const CreateProductPage = async () => {
  const user = await getUserSession();
  if (user && !user.stripeConnectedLinked) redirect('/billing');

  const attributes = await getAllAttributes();

  return (
    <>
      <Heading title='Create Product' />
      <ProdForm mode='create' cateSelectItems={<CateSelectItems showSubCates />} attributes={attributes} />
    </>
  );
};

export default CreateProductPage;
