import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

interface Bookmark {
  blogId: string;
  slug: string;
  title: string;
  coverImage: string;
  savedAt: string;
}

interface ReadingListContextType {
  bookmarks: Bookmark[];
  addBookmark: (blog: Omit<Bookmark, 'savedAt'>) => void;
  removeBookmark: (blogId: string) => void;
  isBookmarked: (blogId: string) => boolean;
  clearBookmarks: () => void;
}

const READING_LIST_KEY = 'shoverhub_reading_list';

const ReadingListContext = createContext<ReadingListContextType | undefined>(undefined);

export const ReadingListProvider = ({ children }: { children: ReactNode }) => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(READING_LIST_KEY);
    if (stored) {
      try {
        setBookmarks(JSON.parse(stored));
      } catch {
        setBookmarks([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(READING_LIST_KEY, JSON.stringify(bookmarks));
  }, [bookmarks]);

  const addBookmark = (blog: Omit<Bookmark, 'savedAt'>) => {
    setBookmarks(prev => {
      if (prev.some(b => b.blogId === blog.blogId)) return prev;
      return [...prev, { ...blog, savedAt: new Date().toISOString() }];
    });
  };

  const removeBookmark = (blogId: string) => {
    setBookmarks(prev => prev.filter(b => b.blogId !== blogId));
  };

  const isBookmarked = (blogId: string) => {
    return bookmarks.some(b => b.blogId === blogId);
  };

  const clearBookmarks = () => {
    setBookmarks([]);
  };

  return (
    <ReadingListContext.Provider value={{ bookmarks, addBookmark, removeBookmark, isBookmarked, clearBookmarks }}>
      {children}
    </ReadingListContext.Provider>
  );
};

export const useReadingList = () => {
  const context = useContext(ReadingListContext);
  if (!context) {
    throw new Error('useReadingList must be used within ReadingListProvider');
  }
  return context;
};
