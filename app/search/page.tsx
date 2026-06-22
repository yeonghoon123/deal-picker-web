"use client";

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { DealCard } from "../components/common/DealCard";
import { AffiliateDisclosure } from "../components/common/AffiliateDisclosure";
import type { Deal } from "../page";
import { Loader2 } from "lucide-react";
import { useTranslation, Trans } from "react-i18next";
import "../../lib/i18n";

function SearchContent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  
  const [deals, setDeals] = useState<Deal[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const [initialLoad, setInitialLoad] = useState(true);

  const observerRef = useRef<HTMLDivElement | null>(null);

  const fetchResults = useCallback(async (pageNum: number, keyword: string) => {
    if (!keyword) return;
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
      const res = await fetch(`${apiUrl}/deals`);
      if (res.ok) {
        const data = await res.json();
        const keywordLower = keyword.toLowerCase();
        let filteredDeals = data.filter((d: Deal) => 
          d.title.toLowerCase().includes(keywordLower) || 
          d.mall.name.toLowerCase().includes(keywordLower)
        );
        
        if (pageNum === 1) {
          setDeals(filteredDeals);
        } else {
          // Pagination can be implemented later
        }
        setHasMore(false);
        setTotal(filteredDeals.length);
      }
    } catch (err) {
      console.error("Failed to fetch search results", err);
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  }, []);


  useEffect(() => {
    // Reset scroll position when search keyword changes
    window.scrollTo({ top: 0, behavior: "smooth" });

    setDeals([]);
    setPage(1);
    setHasMore(true);
    setInitialLoad(true);
    fetchResults(1, q);
  }, [q, fetchResults]);

  useEffect(() => {
    if (loading || !hasMore || initialLoad) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage(prev => {
            const nextPage = prev + 1;
            fetchResults(nextPage, q);
            return nextPage;
          });
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [loading, hasMore, initialLoad, fetchResults, q]);

  return (
    <div className="w-full min-h-screen bg-zinc-50 pb-20 font-sans">
      <main className="max-w-screen-xl mx-auto p-4 md:p-6 lg:p-8 w-full mt-4">
        {!initialLoad && (
          <div className="mb-6">
            <h2 className="text-lg md:text-xl font-medium text-zinc-800 mb-4">
              <span className="font-bold text-zinc-900">&quot;{q}&quot;</span> {t('search.result', { count: total })}
            </h2>
            <AffiliateDisclosure />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {deals.map((deal, index) => (
            <DealCard key={`${deal.id}-${index}`} deal={deal} />
          ))}
        </div>

        {/* Loading Indicator & Infinite Scroll Anchor */}
        <div ref={observerRef} className="w-full py-12 flex items-center justify-center">
          {loading && (
            <div className="flex items-center gap-2 text-zinc-500">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>{t('search.loading')}</span>
            </div>
          )}
          {!hasMore && deals.length > 0 && !loading && (
            <div className="text-zinc-400 text-sm">{t('search.end')}</div>
          )}
          {!initialLoad && deals.length === 0 && !loading && (
            <div className="text-zinc-500 text-sm">{t('search.noResult')}</div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="w-full min-h-screen bg-zinc-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
