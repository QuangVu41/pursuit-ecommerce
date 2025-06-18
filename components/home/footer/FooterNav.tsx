import { footerLinks } from '@/lib/links';
import FooterNavList from './FooterNavList';
import FooterSocial from './FooterSocial';

const FooterNav = () => {
  return (
    <div className='grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-5 items-start'>
      {footerLinks.map((list) => (
        <FooterNavList key={list.title} title={list.title} items={list.items} />
      ))}
      <FooterSocial />
    </div>
  );
};

export default FooterNav;
