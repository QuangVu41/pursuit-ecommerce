import Link from 'next/link';

interface FooterNavListProps {
  title: string;
  items: { label: string; href: string }[];
}

const FooterNavList = ({ title, items }: FooterNavListProps) => {
  return (
    <ul className='flex flex-col gap-y-4 text-base text-muted'>
      <h5 className='text-lg font-bold mt-2 whitespace-nowrap'>{title}</h5>
      {items.map((item) => (
        <li key={item.label}>
          <Link className='hover:underline' href={item.href}>
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default FooterNavList;
