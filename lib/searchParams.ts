export const sortBy = [
  {
    label: 'Latest',
    query: 'latest',
    isDefault: true,
  },
  {
    label: 'Best Selling',
    query: 'best-selling',
    isDefault: false,
  },
  {
    label: 'Rated',
    query: 'rated',
    isDefault: false,
  },
];

export const sortCriteria: {
  label: string;
  order: 'asc' | 'desc';
}[] = [
  {
    label: 'Price: Low to High',
    order: 'asc',
  },
  {
    label: 'Price: High to Low',
    order: 'desc',
  },
];
