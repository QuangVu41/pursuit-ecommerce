import { ProductWithCateAndImg } from '@/types/products';
import { create } from 'zustand';

interface SuggestionStore {
  suggestions: string[];
  isLoading: boolean;
  error: string | null;
  originalQuery: string;
  setOriginalQuery: (query: string) => void;
  fetchSuggestions: (query: string) => Promise<void>;
  clearSuggestions: () => void;
}

export const useSuggestionStore = create<SuggestionStore>((set) => ({
  suggestions: [],
  isLoading: false,
  error: null,
  originalQuery: '',
  setOriginalQuery: (query: string) => set({ originalQuery: query }),
  fetchSuggestions: async (query: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`/api/products?query=${encodeURIComponent(query)}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = (await response.json()) as { data: ProductWithCateAndImg[] };

      const sortedSuggestions = data.data
        .sort((a, b) => {
          const aStartsWith = a.name.toLowerCase().startsWith(query.toLowerCase());
          const bStartsWith = b.name.toLowerCase().startsWith(query.toLowerCase());

          if (aStartsWith && !bStartsWith) return -1;
          if (!aStartsWith && bStartsWith) return 1;
          return 0;
        })
        .map((prod) => prod.name);

      set({ suggestions: sortedSuggestions, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch suggestions',
        isLoading: false,
        suggestions: [],
      });
    }
  },
  clearSuggestions: () => {
    set({ suggestions: [], error: null });
  },
}));
