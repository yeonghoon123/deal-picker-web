"use client";

import { useTranslation } from "react-i18next";
import "../../lib/i18n";
import { useEffect, useState } from "react";

export default function TermsPage() {
  const { t, i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isEn = mounted && i18n.language.startsWith('en');

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8 font-sans">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 mb-8 sm:mb-12 border-b border-zinc-200 pb-6">
          {t('footer.terms')}
        </h1>
        
        {isEn ? (
          <div className="text-center py-20 text-zinc-500 text-lg">
            {t('policy.temporaryNotice')}
          </div>
        ) : (
          <div className="space-y-12">
          <section>
            <p className="text-base sm:text-lg text-zinc-800 leading-relaxed sm:leading-8">
              본 약관은 <strong className="text-black font-semibold">Deal Picker</strong>(이하 "회사")가 제공하는 특가 및 핫딜 정보 모아보기 서비스(이하 "서비스")의 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 mb-4">
              제 1 조 (서비스의 성질 및 한계)
            </h2>
            <ul className="list-disc pl-6 space-y-3 text-base sm:text-lg text-zinc-800 leading-relaxed sm:leading-8 marker:text-zinc-400">
              <li>회사는 제휴 쇼핑몰 및 외부 사이트의 상품 특가 정보를 수집하여 링크 형태로 제공하는 <strong>통신판매중개자 및 정보 제공자</strong>일 뿐, 통신판매의 당사자가 아닙니다.</li>
              <li>상품의 주문, 결제, 배송, 교환, 환불 등 실제 거래에 관한 모든 책임은 해당 상품을 판매하는 외부 쇼핑몰에 있으며, 회사는 이에 대해 어떠한 보증이나 책임도 지지 않습니다.</li>
              <li>회사가 제공하는 상품의 가격 및 상세 정보는 쇼핑몰의 실시간 변동에 따라 차이가 발생할 수 있으며, 이로 인한 분쟁에 대해 회사는 책임지지 않습니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 mb-4">
              제 2 조 (회원의 의무)
            </h2>
            <ul className="list-disc pl-6 space-y-3 text-base sm:text-lg text-zinc-800 leading-relaxed sm:leading-8 marker:text-zinc-400">
              <li>회원은 회사가 제공하는 특가 및 핫딜 정보를 개인적인 용도로만 사용하여야 하며, 회사의 사전 승낙 없이 영리 목적으로 복제, 가공, 크롤링(무단 스크래핑)하여 타 사이트에 배포할 수 없습니다.</li>
              <li>회원은 소셜 로그인 계정을 안전하게 관리할 의무가 있으며, 본인의 부주의로 발생한 계정 도용 및 피해에 대해 회사는 책임지지 않습니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 mb-4">
              제 3 조 (서비스의 변경 및 중단)
            </h2>
            <div className="space-y-4 text-base sm:text-lg text-zinc-800 leading-relaxed sm:leading-8">
              <p>
                회사는 수집 대상 쇼핑몰의 정책 변경, 시스템 점검, 기타 운영상의 이유로 서비스의 일부 또는 전부를 사전 공지 없이 변경하거나 중단할 수 있습니다.
              </p>
            </div>
          </section>
          </div>
        )}
      </div>
    </div>
  );
}
