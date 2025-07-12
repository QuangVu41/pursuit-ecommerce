import {
  BadgeCheck,
  BadgeDollarSign,
  CircleUserRound,
  LayoutDashboard,
  Megaphone,
  Settings,
  ShoppingBag,
  Truck,
} from 'lucide-react';

export const sidebarMenu = [
  {
    label: 'Dashboard',
    href: '/mng/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Products',
    href: '/mng/products',
    icon: ShoppingBag,
    subMenu: [
      {
        label: 'Create Product',
        href: '/mng/products/create-product',
      },
      {
        label: 'Categories',
        href: '/mng/products/categories',
      },
      {
        label: 'Attributes',
        href: '/mng/products/attributes',
      },
    ],
  },
  {
    label: 'Banners',
    href: '/mng/banners',
    icon: Megaphone,
  },
  // {
  //   label: 'Sales',
  //   href: '/mng/sales',
  //   icon: BadgeDollarSign,
  // },
  // {
  //   label: 'Settings',
  //   href: '/mng/settings',
  //   icon: Settings,
  // },
];

export const userMenu = [
  {
    label: 'Profile',
    href: '/profile',
    icon: BadgeCheck,
  },
];

export const profileMenu = [
  {
    label: 'Manage Account',
    links: [
      {
        label: 'Personal info',
        href: '/profile',
        icon: CircleUserRound,
      },
    ],
  },
  {
    label: 'My Items',
    links: [
      {
        label: 'My orders',
        href: '/profile/orders',
        icon: Truck,
      },
    ],
  },
];

export const footerLinks = [
  {
    title: 'Customer Service',
    items: [
      { label: 'Contact Us', href: '#' },
      { label: 'FAQs', href: '#' },
      { label: 'Order Lookup', href: '#' },
      { label: 'Returns', href: '#' },
      { label: 'Shipping & Delivery', href: '#' },
    ],
  },
  {
    title: 'About Us',
    items: [
      { label: 'Careers', href: '#' },
      { label: 'News & Blog', href: '#' },
      { label: 'Press Center', href: '#' },
      { label: 'Investors', href: '#' },
      { label: 'Suppliers', href: '#' },
      { label: 'Terms & Conditions', href: '#' },
      { label: 'Privacy Policy', href: '#' },
    ],
  },
  {
    title: 'Credit Card',
    items: [
      { label: 'Gift Cards', href: '#' },
      { label: 'Gift Cards Balance', href: '#' },
      { label: 'Shop with Points', href: '#' },
      { label: 'Reload Your Balance', href: '#' },
    ],
  },
  {
    title: 'Sell',
    items: [
      { label: 'Start Selling', href: '#' },
      { label: 'Learn to Sell', href: '#' },
      { label: 'Affiliates & Partners', href: '#' },
    ],
  },
];

export const dashboardLinks = [...sidebarMenu];
