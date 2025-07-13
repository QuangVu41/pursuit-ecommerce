import { getUserSession } from '@/auth';
import Heading from '@/components/common/Heading';
import NotFound from '@/components/common/NotFound';
import ProfileForm from '@/components/home/profile/ProfileForm';
import { getUserById } from '@/services/users';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profile',
};

const ProfilePage = async () => {
  const user = await getUserSession();

  if (!user) NotFound();

  const userData = await getUserById(user!.id as string);

  if (!userData) NotFound();

  return (
    <div className='bg-muted rounded-lg p-4 flex flex-col gap-4'>
      <Heading title='Personal information' />
      <ProfileForm userData={userData!} />
    </div>
  );
};

export default ProfilePage;
