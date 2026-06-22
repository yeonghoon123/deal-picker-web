"use client";

import { memo, useEffect, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import "../../../lib/i18n";
import type { Deal } from "../../page";

type DealCardProps = {
  deal: Deal & {
    mall: string | { name: string; name_translations?: { en?: string } };
  };
  rank?: number;
};

// Vercel Best Practice: rerender-memo - Extract expensive work into memoized components
function DealCardComponent({ deal, rank }: DealCardProps) {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const { t, i18n } = useTranslation();
  // hydration error 방지를 위해 마운트 상태 추가
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // 임의의 만료 시간을 현재 시간 + 1시간~24시간으로 설정 (id 기반 시드 또는 랜덤)
    const numericId = parseInt(deal.id.replace(/\D/g, "")) || deal.title.length;
    const seed = numericId * 10000;
    const expiryDate = new Date(Date.now() + (seed % (24 * 60 * 60 * 1000)) + 3600000);

    const updateTimer = () => {
      const now = new Date();
      const diff = expiryDate.getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeLeft(t('deal.closed'));
        return;
      }

      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeLeft(t('deal.left', { time: `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}` }));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [deal.id, t]);

  const isEn = mounted && i18n.language.startsWith('en');
  const mallObj = typeof deal.mall === 'string' ? { name: deal.mall, name_translations: undefined as { en?: string } | undefined } : deal.mall;
  const mallName = isEn && mallObj.name_translations?.en ? mallObj.name_translations.en : mallObj.name;

  return (
    <Link href={`/deal/${deal.id}`} className="group flex flex-row md:flex-col gap-4 p-3 md:p-4 bg-white rounded-xl md:rounded-2xl shadow-sm border border-zinc-100 hover:shadow-md hover:border-zinc-200 transition-all cursor-pointer active:scale-[0.98] h-full block">
      <div className="relative w-24 h-24 md:w-full md:h-52 shrink-0 rounded-lg md:rounded-xl overflow-hidden bg-zinc-100 border border-zinc-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={deal.image} 
          alt={deal.title}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
        />
        {rank && (
          <div className="absolute top-0 left-0 bg-zinc-900 text-white w-6 h-6 md:w-8 md:h-8 flex items-center justify-center rounded-br-lg md:rounded-br-xl text-xs md:text-sm font-bold shadow-sm z-10">
            {rank}
          </div>
        )}
        {timeLeft && (
          <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs font-medium py-1 px-2 rounded-md text-center z-10 truncate">
            ⏳ {timeLeft}
          </div>
        )}
      </div>
      
      <div className="flex flex-col flex-1 justify-between py-0.5 md:py-1">
        <div>
          <div className="flex items-center gap-1.5 mb-1.5 md:mb-2.5">
            <span className="text-[10px] md:text-xs font-bold px-1.5 py-0.5 md:px-2 md:py-1 rounded bg-zinc-100 text-zinc-600">
              {mallName}
            </span>
          </div>
          <h3 className="text-sm md:text-base font-medium text-zinc-900 line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors">
            {deal.title}
          </h3>
        </div>
        
        <div className="mt-3 md:mt-4">
          <div className="flex items-center gap-1 mb-0.5">
            <span className="text-xs md:text-sm text-zinc-400 line-through">
              {deal.originalPrice.toLocaleString()}{t('deal.currency')}
            </span>
          </div>
          <div className="flex items-end gap-1.5">
            <span className="text-lg md:text-xl font-bold text-red-500 leading-none">
              {deal.discount}%
            </span>
            <span className="text-lg md:text-xl font-bold text-zinc-900 leading-none">
              {deal.price.toLocaleString()}{t('deal.currency')}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export const DealCard = memo(DealCardComponent);
