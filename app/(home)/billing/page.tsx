import { getUserSession } from '@/auth';
import HomeSectionContainer from '@/components/common/HomeSectionContainer';
import HomeSectionHeader from '@/components/common/HomeSectionHeader';
import SectionContent from '@/components/common/SectionContent';
import BtnCreateAccountLink from '@/components/home/payment/BtnCreateAccountLink';
import BtnViewDashboard from '@/components/home/payment/BtnViewDashboard';
import { getUserById } from '@/services/users';
import { notFound } from 'next/navigation';

const BillingPage = async () => {
  const user = await getUserSession();

  if (!user) notFound();

  const userPayload = await getUserById(user.id!);

  return (
    <HomeSectionContainer className='mb-10 md:mb-[60px]'>
      <HomeSectionHeader title='Billing' description='Find all your details regarding your payments' />
      <SectionContent>
        {userPayload?.stripeConnectedLinked === false && <BtnCreateAccountLink />}
        {userPayload?.stripeConnectedLinked === true && <BtnViewDashboard />}
      </SectionContent>
    </HomeSectionContainer>
  );
};

export default BillingPage;
