'use client';

import { useUrl } from '@/hooks/use-url';
import { profileMenu } from '@/lib/links';
import Link from 'next/link';

const ProfileNavList = () => {
  const { pathname } = useUrl();

  return (
    <div className='p-2 flex flex-col gap-2'>
      {profileMenu.map((item) => (
        <ul key={item.label} className='flex flex-col gap-1'>
          <h3 className='text-base font-semibold text-foreground mb-1 pt-2 px-2 whitespace-nowrap'>{item.label}</h3>
          {item.links.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className={`flex items-center py-1 px-2 gap-2 text-base hover:bg-background whitespace-nowrap rounded-md transition-colors hover:font-semibold ${
                  pathname === link.href ? 'bg-background font-semibold' : ''
                }`}
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
