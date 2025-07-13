import HomeSectionContainer from '@/components/common/HomeSectionContainer';
import HomeSectionHeader from '@/components/common/HomeSectionHeader';
import SectionContent from '@/components/common/SectionContent';
import CartItemsProvider from '@/components/home/cart/CartItemsProvider';
import CartTable from '@/components/home/cart/CartTable';
import { getUserCartWithPayloadByUserId } from '@/services/products';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cart',
};

const CartPage = async () => {
  const userCart = await getUserCartWithPayloadByUserId();

  return (
    <HomeSectionContainer className='mb-10 md:mb-[60px]'>
      <HomeSectionHeader title='Your Cart' />
      <CartItemsProvider cartItems={userCart?.cartItems || []}>
        <SectionContent className='flex flex-col gay-y-4'>
          <CartTable />
        </SectionContent>
      </CartItemsProvider>
    </HomeSectionContainer>
  );
};

export default CartPage;
