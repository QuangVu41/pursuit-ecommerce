import ProfileAvatar from '@/components/home/profile/ProfileAvatar';
import ProfileNavList from '@/components/home/profile/ProfileNavList';

const ProfileNav = () => {
  return (
    <div className='rounded-lg overflow-hidden bg-muted'>
      <ProfileAvatar />
      <ProfileNavList />
    </div>
  );
};

export default ProfileNav;
