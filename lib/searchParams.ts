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

export const adminDashboardSortBy = [
  {
    label: 'Last 3 months',
    query: '3',
    isDefault: true,
  },
  {
    label: 'Last 6 months',
    query: '6',
    isDefault: false,
  },
  {
    label: 'Last 9 months',
    query: '9',
    isDefault: false,
  },
];
