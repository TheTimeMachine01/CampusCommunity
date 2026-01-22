import { useMemo } from 'react';
import { NewsItem } from '../constants/types';

/**
 * useSearch Hook
 * Performs case-insensitive search on news items
 */
export function useSearch(items: NewsItem[], searchQuery: string): NewsItem[] {
  return useMemo(() => {
    if (!searchQuery.trim()) {
      return items;
    }

    const query = searchQuery.toLowerCase().trim();

    return items.filter((item) => {
      const title = item.title.toLowerCase();
      const description = item.description.toLowerCase();
      const author = item.author.toLowerCase();

      return (
        title.includes(query) ||
        description.includes(query) ||
        author.includes(query)
      );
    });
  }, [items, searchQuery]);
}
