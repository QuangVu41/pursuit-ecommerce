import { profileMenu } from '@/lib/links';
import Link from 'next/link';

const ProfileNavList = () => {
  return (
    <div className='p-4  flex flex-col gap-4'>
      {profileMenu.map((item) => (
        <ul key={item.label} className='flex flex-col gap-2'>
          <h3 className='text-base font-semibold text-foreground mb-1'>{item.label}</h3>
          {item.links.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className='flex items-center gap-2 text-base hover:text-home-primary transition-colors hover:font-semibold'
              >
                <link.icon className='size-5 stroke-[1.5]' />
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
};

export default ProfileNavList;
