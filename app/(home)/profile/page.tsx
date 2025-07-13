import { getUserSession } from '@/auth';
import Heading from '@/components/common/Heading';
import NotFound from '@/components/common/NotFound';
import ChangePasswordForm from '@/components/home/profile/ChangePasswordForm';
import ProfileForm from '@/components/home/profile/ProfileForm';
import { Separator } from '@/components/ui/separator';
import { checkIfUserUsedOauthProvider } from '@/services/users';
import { getUserById } from '@/lib/user-queries';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profile',
};

const ProfilePage = async () => {
  const user = await getUserSession();

  if (!user) NotFound();

  const userData = await getUserById(user!.id as string);

  if (!userData) NotFound();

  const isUsedOauthProvider = await checkIfUserUsedOauthProvider();

  return (
    <div className='bg-muted rounded-lg p-4 flex flex-col gap-4'>
      <Heading title='Personal information' />
      <Separator />
      <ProfileForm userData={userData!} />
      {!isUsedOauthProvider && (
        <>
          <h2 className='text-lg font-bold'>Change Password</h2>
          <Separator />
          <ChangePasswordForm />
        </>
      )}
    </div>
  );
};

export default ProfilePage;
