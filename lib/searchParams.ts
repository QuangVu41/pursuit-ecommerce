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

export const dashboardSortBy = [
  {
    label: 'Last 7 days',
    query: '7',
    isDefault: true,
  },
  {
    label: 'Last 30 days',
    query: '30',
    isDefault: false,
  },
  {
    label: 'Last 90 days',
    query: '90',
    isDefault: false,
  },
];
