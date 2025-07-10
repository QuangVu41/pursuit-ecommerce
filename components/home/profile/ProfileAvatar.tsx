import { getUserSession } from '@/auth';
import Image from 'next/image';
import { notFound } from 'next/navigation';

const ProfileAvatar = async () => {
  const user = await getUserSession();

  if (!user) notFound();

  return (
    <div className='flex flex-col items-center gap-4 p-4 bg-[url(/avatar-bg.png)] bg-center'>
      <figure className='relative size-20 border-5 border-background/30 rounded-full overflow-hidden'>
        <Image
          src={user.image || '/default-avatar.png'}
          alt={user.name as string}
          width={80}
          height={80}
          className='absolute inset-0 w-full h-full object-cover'
        />
      </figure>
      <div>
        <h2 className='text-lg font-bold text-muted'>{user.name}</h2>
      </div>
    </div>
  );
};

export default ProfileAvatar;
