"use client";

import Link from 'next/link';
import { useTranslation, Trans } from 'react-i18next';
import '../../lib/i18n';

export default function LoginPage() {
  const { t } = useTranslation();

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 bg-zinc-50">
      <div className="w-full max-w-sm bg-white border border-zinc-200 rounded-2xl shadow-sm p-8 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">{t('login.welcome')}</h1>
          <p className="text-sm text-zinc-500">{t('login.desc')}</p>
        </div>
        
        <div className="space-y-3">
          <a
            href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/auth/kakao`}
            className="flex w-full items-center justify-center gap-3 rounded-md bg-[#FEE500] px-4 py-3 text-sm font-medium text-[#000000] shadow-sm transition-colors hover:bg-[#FEE500]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FEE500] focus-visible:ring-offset-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3c-5.523 0-10 3.51-10 7.84 0 2.802 1.83 5.253 4.545 6.452-.392 1.488-1.505 5.674-1.547 5.864-.055.234.084.238.188.169.135-.091 2.193-1.464 4.364-2.923 1.258.18 2.559.278 3.906.278 5.523 0 10-3.51 10-7.84S17.523 3 12 3z"/>
            </svg>
            {t('login.kakao')}
          </a>
          
          <a
            href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/auth/google`}
            className="flex w-full items-center justify-center gap-3 rounded-md border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-900 shadow-sm transition-colors hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            {t('login.google')}
          </a>
        </div>
        
        <div className="text-center text-xs text-zinc-500">
          <Trans 
            i18nKey="login.agreement"
            components={[
              <Link key="terms" href="/terms" className="underline underline-offset-4 hover:text-zinc-900">이용약관</Link>,
              <Link key="privacy" href="/privacy" className="underline underline-offset-4 hover:text-zinc-900">개인정보처리방침</Link>
            ]}
          />
        </div>
      </div>
    </div>
  );
}
