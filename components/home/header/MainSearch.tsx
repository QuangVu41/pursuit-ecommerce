'use client';

import InputHome from '@/components/common/InputHome';
import { Button } from '@/components/ui/button';
import { useSuggestionStore } from '@/hooks/use-suggestion-store';
import { useUrl } from '@/hooks/use-url';
import { cn } from '@/lib/utils';
import { Loader2, Search, TrendingUp, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

const MainSearch = () => {
  const { router } = useUrl();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [query, setQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const { isLoading, error, originalQuery } = useSuggestionStore();
  const setOriginalQuery = useSuggestionStore((state) => state.setOriginalQuery);
  const suggestions = useSuggestionStore((state) => state.suggestions);
  const fetchSuggestions = useSuggestionStore((state) => state.fetchSuggestions);
  const clearSuggestions = useSuggestionStore((state) => state.clearSuggestions);

  useEffect(() => {
    if (selectedIndex >= 0 && suggestions.length > 0) {
      const selectedSuggestion = suggestions[selectedIndex].toLowerCase();
      setQuery(selectedSuggestion);
    }
  }, [selectedIndex, suggestions]);

  useEffect(() => {
    if (selectedIndex >= 0 && listRef.current) {
      const selectedItem = listRef.current.children[selectedIndex] as HTMLElement;
      selectedItem?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    } else if (selectedIndex === -1 && inputRef.current) {
      const selectedItem = listRef.current?.children[0] as HTMLElement;
      selectedItem?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [selectedIndex]);

  const handleSearchClick = () => {
    if (!query.trim()) return;
    router.push(`/products?query=${encodeURIComponent(query)}`);
    setIsDropdownOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.blur();
  };

  const handleInputChange = useDebouncedCallback((value: string) => {
    const query = value.trim();
    if (query) {
      fetchSuggestions(query);
      setOriginalQuery(value);
      setIsDropdownOpen(true);
    } else if (!query) {
      clearSuggestions();
      setIsDropdownOpen(false);
      setSelectedIndex(-1);
      setOriginalQuery('');
    }
  }, 300);

  const handleClearInput = () => {
    setQuery('');
    clearSuggestions();
    setIsDropdownOpen(false);
    setSelectedIndex(-1);
    setOriginalQuery('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isDropdownOpen || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        const nextIndex1 = selectedIndex < suggestions.length - 1 ? selectedIndex + 1 : -1;
        setSelectedIndex(nextIndex1);
        if (nextIndex1 === -1) setQuery(originalQuery);
        break;
      case 'ArrowUp':
        e.preventDefault();
        const nextIndex2 = selectedIndex > -1 ? selectedIndex - 1 : suggestions.length - 1;
        setSelectedIndex(nextIndex2);
        if (nextIndex2 === -1) setQuery(originalQuery);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          const selectedSuggestion = suggestions[selectedIndex];
          setOriginalQuery(query);
          router.push(`/products?query=${encodeURIComponent(selectedSuggestion)}`);
        } else if (query.trim()) {
          router.push(`/products?query=${encodeURIComponent(query.trim())}`);
        }
        setIsDropdownOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
      case 'Escape':
        setIsDropdownOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  return (
    <div className='flex items-center w-full col-span-2 md:col-span-1 relative'>
      <InputHome
        ref={inputRef}
        className='h-10 md:h-11'
        placeholder='Search products...'
        value={query}
        onKeyDown={handleKeyDown}
        onChange={(e) => {
          const value = e.target.value;
          setQuery(value);
          setSelectedIndex(-1);
          handleInputChange(value);
        }}
        onBlur={() => setIsDropdownOpen(false)}
        onFocus={() => query.trim() && setIsDropdownOpen(true)}
      />
      <span
        onClick={handleSearchClick}
        className='flex size-10 md:size-11 items-center justify-center bg-home-popup hover:bg-home-popup/90 transition- shrink-0 -ml-[1px]'
      >
        <Search className='text-home-primary' />
      </span>
      <div className='absolute inset-y-0 right-10 md:right-11 pr-4 flex items-center gap-2'>
        {isLoading && <Loader2 className='h-5 w-5 text-home-popup animate-spin' />}
        {query && !isLoading && (
          <Button
            variant='ghost'
            size='icon'
            onClick={handleClearInput}
            className='size-auto justify-center items-center hover:bg-transparent'
          >
            <X className='h-5 w-5 text-home-popup' />
          </Button>
        )}
      </div>

      {isDropdownOpen && (
        <div className='absolute top-full left-0 right-0 mt-2 bg-background shadow-xl z-50'>
          {error && (
            <div className='p-4 text-destructive text-sm border-b border-muted'>
              <span className='font-medium'>Error:</span> {error}
            </div>
          )}

          {suggestions.length > 0 && (
            <ul ref={listRef} className='max-h-80 overflow-y-auto'>
              {suggestions.map((suggestion, index) => (
                <li key={index}>
                  <button
                    className={cn(
                      'w-full px-4 py-3 text-left hover:bg-muted transition-colors flex items-center gap-3',
                      `${selectedIndex === index && 'bg-muted'}`
                    )}
                  >
                    <TrendingUp className='size-4 text-home-popup flex-shrink-0' />
                    <span
                      className='truncate'
                      dangerouslySetInnerHTML={{
                        __html: suggestion
                          .replace(/<script.*?>.*?<\/script>/g, '')
                          .toLowerCase()
                          .replace(
                            query.trim().toLowerCase(),
                            `<span class='font-semibold text-home-primary'>${query.trim().toLowerCase()}</span>`
                          ),
                      }}
                    ></span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {!isLoading && suggestions.length === 0 && query && (
            <div className='p-8 text-center text-muted-foreground'>
              <Search className='h-8 w-8 mx-auto mb-2 text-home-popup' />
              <p className='text-sm'>No products found for {`"${query}"`}</p>
            </div>
          )}

          {suggestions.length > 0 && (
            <div className='px-4 py-2 bg-muted text-xs text-muted-foreground border-t border-muted'>
              Use ↑↓ to navigate, Enter to select, Esc to close
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MainSearch;
