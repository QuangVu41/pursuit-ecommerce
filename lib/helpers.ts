import { formatDistanceToNow } from 'date-fns';

export const flattenNestedArray = <T>(items: T[], nestedKey: keyof T): T[] => {
  const result: T[] = [];

  const flatten = (elements: T[]) => {
    elements.forEach((element) => {
      result.push(element);
      if (element[nestedKey] && Array.isArray(element[nestedKey])) {
        flatten(element[nestedKey] as T[]);
      }
    });
  };

  flatten(items);
  return result;
};

export const getUniqueBy = <T, K extends keyof T>(array: T[], key: K): T[] => {
  const seen = new Set<T[K]>();
  return array.filter((item) => {
    if (seen.has(item[key])) {
      return false;
    }
    seen.add(item[key]);
    return true;
  });
};

export const capitalizeFirstLetter = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const formatDistanceFromNow = (date: Date | string): string => {
  const parsedDate = typeof date === 'string' ? new Date(date) : date;
  const distance = formatDistanceToNow(parsedDate, { addSuffix: true });
  return capitalizeFirstLetter(distance); // Capitalize the first letter of the result
};

export const getUsernameFallback = (name: string): string => {
  if (!name) return '';
  const words = name.trim().split(' ');
  const initials = words
    .slice(0, 2) // Take the first two words
    .map((word) => word.charAt(0).toUpperCase()) // Get the first letter of each word and capitalize it
    .join('');
  return initials;
};

export const hasDuplicates = <T>(array: T[]): boolean => {
  const uniqueValues = new Set(array);
  return uniqueValues.size !== array.length;
};

export function slugToName(slug: string): string {
  return slug.split('-').join(' ');
}

export function nameToSlug(name: string): string {
  return name
    .trim() // Remove leading/trailing spaces
    .replace(/\s+/g, '-') // Replace one or more spaces with hyphens
    .replace(/--+/g, '-') // Replace multiple consecutive hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

export function getDateInPast(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

export const formatCurrency = (code: string, number: number) => {
  return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: code }).format(number);
};

export const generateOrQueryForSearch = <T>(searchTerms: string, field: keyof T) => {
  if (!searchTerms) return;

  return searchTerms.split(' ').map((q) => ({
    [field]: {
      contains: q,
      mode: 'insensitive',
    },
  }));
};
