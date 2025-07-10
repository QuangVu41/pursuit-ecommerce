import HomeSectionContainer from '@/components/common/HomeSectionContainer';
import ProfileNav from '@/components/home/profile/ProfileNav';

interface ProfileLayoutProps {
  children: React.ReactNode;
}

const ProfileLayout = ({ children }: ProfileLayoutProps) => {
  return (
    <HomeSectionContainer className='mb-10 md:mt-[60px]'>
      <div className='grid grid-cols-12 gap-x-4'>
        <div className='col-span-3'>
          <ProfileNav />
        </div>
        <div className='col-span-9'>{children}</div>
      </div>
    </HomeSectionContainer>
  );
};

export default ProfileLayout;
