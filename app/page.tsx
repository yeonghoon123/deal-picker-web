"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { DealCard } from "./components/common/DealCard";
import { AffiliateDisclosure } from "./components/common/AffiliateDisclosure";
export interface Deal {
  id: string;
  title: string;
  price: number;
  originalPrice: number;
  discount: number;
  mall: { name: string; name_translations?: any };
  image: string;
  url: string;
}
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import "../lib/i18n";
export default function Home() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("종합 할인 랭킹");
  const [activeMall, setActiveMall] = useState("전체");

  // Infinite Scroll States
  const [deals, setDeals] = useState<Deal[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);

  // Malls & Today Picks States
  const [malls, setMalls] = useState<string[]>([]);
  const [todayPicks, setTodayPicks] = useState<Deal[]>([]);

  // Fetch initial data (Malls, Today Picks)
  useEffect(() => {
    const fetchInitialData = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
      try {
        const [mallsRes, picksRes] = await Promise.all([
          fetch(`${apiUrl}/deals/malls`),
          fetch(`${apiUrl}/deals/today-picks`)
        ]);
        if (mallsRes.ok) {
          const mallsData = await mallsRes.json();
          const parsedMalls = Array.isArray(mallsData) && mallsData.length > 0 && typeof mallsData[0] === 'object' 
            ? mallsData.map((m: any) => m.name || m.mall_name) 
            : mallsData;
          setMalls(parsedMalls || []);
        }
        if (picksRes.ok) {
          const picksData = await picksRes.json();
          setTodayPicks(picksData);
        }
      } catch (err) {
        console.error("Failed to fetch initial data", err);
      }
    };
    fetchInitialData();
  }, []);
  
  const observerRef = useRef<HTMLDivElement | null>(null);

  const fetchDeals = useCallback(async (pageNum: number, mall: string) => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
      const res = await fetch(`${apiUrl}/deals`);
      if (res.ok) {
        const data = await res.json();
        
        let filteredDeals = data;
        if (mall !== '전체') {
          filteredDeals = data.filter((d: Deal) => d.mall.name === mall);
        }
        
        if (pageNum === 1) {
          setDeals(filteredDeals);
        } else {
          // 추후 백엔드에서 페이지네이션 지원 시 추가
        }
        setHasMore(false); // 현재는 전체를 한 번에 불러오므로 무한스크롤 임시 비활성화
      }
    } catch (err) {
      console.error("Failed to fetch deals", err);
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  }, []);

  // When mall changes, reset and fetch page 1
  useEffect(() => {
    if (activeTab !== "종합 할인 랭킹") return;
    
    // Reset scroll position to top when changing filters
    window.scrollTo({ top: 0, behavior: "smooth" });
    
    setDeals([]);
    setPage(1);
    setHasMore(true);
    setInitialLoad(true);
    fetchDeals(1, activeMall);
  }, [activeMall, activeTab, fetchDeals]);

  // Intersection Observer for Infinite Scroll
  useEffect(() => {
    if (activeTab !== "종합 할인 랭킹" || loading || !hasMore || initialLoad) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage(prev => {
            const nextPage = prev + 1;
            fetchDeals(nextPage, activeMall);
            return nextPage;
          });
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [loading, hasMore, initialLoad, activeTab, activeMall, fetchDeals]);

  return (
    <div className="w-full min-h-screen bg-zinc-50 pb-20 font-sans">
      <div className="sticky top-[73px] md:top-[81px] z-20 flex flex-col w-full shadow-sm">
        {/* Tabs */}
        <nav className="bg-white border-b border-zinc-200 w-full">
          <div className="flex max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8">
            <button 
              onClick={() => setActiveTab("종합 할인 랭킹")}
              className={`flex-1 py-4 text-center text-sm md:text-base font-semibold border-b-2 transition-colors ${activeTab === "종합 할인 랭킹" ? "border-zinc-900 text-zinc-900" : "border-transparent text-zinc-400 hover:text-zinc-700"}`}
            >
              {t('home.tabs.ranking')}
            </button>
            <button 
              onClick={() => setActiveTab("투데이 Pick")}
              className={`flex-1 py-4 text-center text-sm md:text-base font-semibold border-b-2 transition-colors ${activeTab === "투데이 Pick" ? "border-zinc-900 text-zinc-900" : "border-transparent text-zinc-400 hover:text-zinc-700"}`}
            >
              {t('home.tabs.today')}
            </button>
          </div>
        </nav>

        {/* Filters (Only show when "종합 할인 랭킹" is active) */}
        {activeTab === "종합 할인 랭킹" && (
          <div className="bg-white w-full border-b border-zinc-100 overflow-x-auto scrollbar-hide">
            <div className="flex max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8 py-3 gap-2">
              {["전체", ...malls].map((mall) => (
                <button
                  key={mall}
                  onClick={() => setActiveMall(mall)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    activeMall === mall 
                    ? "bg-zinc-900 text-white" 
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                  }`}
                >
                  {mall === "전체" ? t('home.allMalls') : mall}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <main className="max-w-screen-xl mx-auto p-4 md:p-6 lg:p-8 w-full mt-2">
        <AffiliateDisclosure />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {activeTab === "종합 할인 랭킹" ? (
            deals.map((deal, index) => (
              <DealCard key={`${deal.id}-${index}`} deal={deal} />
            ))
          ) : (
            todayPicks.map((deal, index) => (
              <DealCard key={`${deal.id}-today-${index}`} deal={deal} />
            ))
          )}
        </div>

        {/* Loading Indicator & Infinite Scroll Anchor */}
        {activeTab === "종합 할인 랭킹" && (
          <div ref={observerRef} className="w-full py-12 flex items-center justify-center">
            {loading && (
              <div className="flex items-center gap-2 text-zinc-500">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{t('home.loading')}</span>
              </div>
            )}
            {!hasMore && deals.length > 0 && !loading && (
              <div className="text-zinc-400 text-sm">{t('home.end')}</div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
