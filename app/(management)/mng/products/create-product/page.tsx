import Heading from '@/components/common/Heading';
import CateSelectItems from '@/components/management/categories/CateSelectItems';
import ProdForm from '@/components/management/products/ProdForm';
import { getAllAttributes } from '@/services/attributes';

const CreateProductPage = async () => {
  const attributes = await getAllAttributes();

  return (
    <>
      <Heading title='Create Product' />
      <ProdForm cateSelectItems={<CateSelectItems showSubCates />} attributes={attributes} />
    </>
  );
};

export default CreateProductPage;
