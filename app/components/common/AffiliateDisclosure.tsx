import { Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function AffiliateDisclosure() {
  const { t } = useTranslation();

  return (
    <div className="w-full flex justify-center mb-6 px-4">
      <div className="inline-flex items-start sm:items-center gap-2.5 px-5 py-3 bg-white border border-zinc-200 rounded-2xl text-[11px] sm:text-xs text-zinc-500 shadow-sm max-w-2xl text-left leading-relaxed">
        <Info className="w-4 h-4 shrink-0 text-indigo-400 mt-0.5 sm:mt-0" />
        <span>{t("common.affiliateDisclosure")}</span>
      </div>
    </div>
  );
}
