"use client";

import { useState, useDeferredValue, useEffect } from "react";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

type SearchBarProps = {
  placeholder?: string;
  onSearch?: (term: string) => void;
};

// Vercel Best Practice: rerender-use-deferred-value - Defer expensive renders to keep input responsive
import { useTranslation } from "react-i18next";
import "../../../lib/i18n";

export function SearchBar({ onSearch }: SearchBarProps) {
  const { t } = useTranslation();
  const placeholder = t('common.searchPlaceholder');
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams?.get("q") || "";
  
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const deferredSearchTerm = useDeferredValue(searchTerm);

  // Sync with URL when navigating back/forward
  useEffect(() => {
    setSearchTerm(searchParams?.get("q") || "");
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchTerm.trim() !== "") {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <div className="relative flex items-center w-full md:w-[500px] h-11 md:h-12 rounded-full bg-zinc-100 px-4 transition-all focus-within:ring-2 focus-within:ring-indigo-500">
      <Search className="w-5 h-5 md:w-6 md:h-6 text-zinc-400 shrink-0" />
      <input 
        type="text" 
        value={searchTerm}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="flex-1 bg-transparent border-none outline-none ml-2 text-sm md:text-base text-zinc-800 placeholder-zinc-400"
      />
    </div>
  );
}
