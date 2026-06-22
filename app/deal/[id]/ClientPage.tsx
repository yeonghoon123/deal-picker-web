"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Deal } from "../../page";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// 목업 데이터: 최근 7일간의 가격 추이 생성
const generatePriceHistory = (currentPrice: number) => {
  const history = [];
  const today = new Date();
  
  // 현재 가격을 기준으로 이전 7일 가격 생성 (등락률 랜덤 적용)
  let basePrice = currentPrice;
  
  // 마지막 날(오늘)은 현재 가격
  history.unshift({
    date: `${today.getMonth() + 1}/${today.getDate()}`,
    price: currentPrice
  });

  for (let i = 1; i <= 6; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    
    // 이전 날의 가격은 5% 내외로 변동이 있었다고 가정
    const variance = (Math.random() - 0.5) * 0.1;
    basePrice = Math.floor(basePrice * (1 + variance) / 100) * 100;
    
    history.unshift({
      date: `${d.getMonth() + 1}/${d.getDate()}`,
      price: basePrice
    });
  }
  
  return history;
};

export default function DealDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [deal, setDeal] = useState<Deal | null>(null);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (params.id) {
      const fetchDeal = async () => {
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
          const res = await fetch(`${apiUrl}/deals`);
          if (res.ok) {
            const deals: Deal[] = await res.json();
            const found = deals.find((d) => d.id === params.id);
            setDeal(found || null);
          }
        } catch (err) {
          console.error(err);
        }
      };
      fetchDeal();
    }
  }, [params.id]);

  const priceHistory = useMemo(() => {
    if (!deal) return [];
    return generatePriceHistory(deal.price);
  }, [deal]);

  if (!deal) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 pb-24">
      {/* Product Image */}
      <div className="w-full h-80 bg-white relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={deal.image} 
          alt={deal.title} 
          className="w-full h-full object-cover"
        />
        <button 
          onClick={() => router.back()}
          className="absolute top-4 left-4 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm"
        >
          <svg className="w-6 h-6 text-zinc-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Product Info */}
      <div className="bg-white p-5 mb-2 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-bold px-2 py-1 rounded bg-zinc-100 text-zinc-600">
            {deal.mall.name}
          </span>
          <div className="flex items-center gap-1 text-xs text-zinc-500">
            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="font-medium text-zinc-700">{deal.rating}</span>
            <span>({deal.reviewCount?.toLocaleString()})</span>
          </div>
        </div>
        
        <h1 className="text-xl md:text-2xl font-bold text-zinc-900 leading-snug mb-4">
          {deal.title}
        </h1>

        <div className="flex items-end gap-2 mb-1">
          <span className="text-2xl md:text-3xl font-bold text-red-500 leading-none">
            {deal.discount}%
          </span>
          <span className="text-2xl md:text-3xl font-bold text-zinc-900 leading-none">
            {deal.price.toLocaleString()}원
          </span>
        </div>
        <div className="text-sm text-zinc-400 line-through">
          {deal.originalPrice.toLocaleString()}원
        </div>
      </div>

      {/* Price Graph */}
      <div className="bg-white p-5 mb-2 shadow-sm">
        <h2 className="text-lg font-bold text-zinc-900 mb-4">최근 가격 추이</h2>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={priceHistory} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#71717a' }} 
                dy={10}
              />
              <YAxis 
                domain={['auto', 'auto']} 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#71717a' }}
                tickFormatter={(value) => `${(value / 10000).toFixed(0)}만`}
                dx={-10}
              />
              <Tooltip 
                formatter={(value: any) => [`${Number(value).toLocaleString()}원`, '가격']}
                labelStyle={{ color: '#18181b', fontWeight: 'bold', marginBottom: '4px' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#4f46e5" 
                strokeWidth={3} 
                dot={{ r: 4, fill: '#4f46e5', strokeWidth: 2, stroke: '#ffffff' }} 
                activeDot={{ r: 6 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-200 p-4 md:px-8 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50">
        <div className="max-w-screen-xl mx-auto flex items-center gap-3">
          <button 
            onClick={() => setIsLiked(!isLiked)}
            className="w-14 h-14 flex flex-col items-center justify-center shrink-0 border border-zinc-200 rounded-xl bg-white text-zinc-600 active:bg-zinc-50 transition-colors"
          >
            <svg 
              className={`w-6 h-6 mb-0.5 ${isLiked ? 'text-red-500 fill-current' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isLiked ? 0 : 2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="text-[10px] font-medium">{isLiked ? '찜됨' : '찜하기'}</span>
          </button>
          
          <button className="flex-1 h-14 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 active:bg-indigo-800 transition-colors shadow-sm flex items-center justify-center gap-2">
            <span>최저가 구매하기</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
