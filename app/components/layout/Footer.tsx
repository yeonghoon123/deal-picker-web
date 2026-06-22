"use client";

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import '../../../lib/i18n';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="w-full bg-zinc-50 border-t border-zinc-200 py-8 mt-auto">
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-zinc-500">
          {t('footer.rights', { year: new Date().getFullYear() })}
        </div>
        <div className="flex items-center gap-6 text-sm text-zinc-600">
          <Link href="/terms" className="hover:text-zinc-900 transition-colors">
            {t('footer.terms')}
          </Link>
          <Link href="/privacy" className="hover:text-zinc-900 transition-colors">
            {t('footer.privacy')}
          </Link>
        </div>
      </div>
    </footer>
  );
}
