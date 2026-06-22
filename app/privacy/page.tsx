"use client";

import { useTranslation } from "react-i18next";
import "../../lib/i18n";
import { useEffect, useState } from "react";

export default function PrivacyPage() {
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
          {t('footer.privacy')}
        </h1>
        
        {isEn ? (
          <div className="text-center py-20 text-zinc-500 text-lg">
            {t('policy.temporaryNotice')}
          </div>
        ) : (
          <div className="space-y-12">
          <section>
            <p className="text-base sm:text-lg text-zinc-800 leading-relaxed sm:leading-8">
              <strong className="text-black font-semibold">Deal Picker</strong> (이하 "회사")는 특가 및 핫딜 정보 모아보기 서비스를 제공함에 있어, 이용자의 개인정보를 안전하게 보호하고 관련 법령을 준수하기 위해 다음과 같이 개인정보처리방침을 수립·공개합니다.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 mb-4">
              제 1 조 (수집하는 개인정보 항목 및 수집 방법)
            </h2>
            <p className="text-base sm:text-lg text-zinc-800 leading-relaxed sm:leading-8 mb-4">
              회사는 비밀번호를 직접 수집하지 않으며, 안전하고 간편한 구글(Google) 및 카카오(Kakao) 소셜 로그인을 통해서만 서비스를 제공합니다. 또한 보안 강화를 위해 접속 환경 정보를 수집합니다.
            </p>
            <ul className="list-disc pl-6 space-y-3 text-base sm:text-lg text-zinc-800 leading-relaxed sm:leading-8 marker:text-zinc-400">
              <li><strong>소셜 로그인 시 수집항목:</strong> 이메일, 이름, 소셜 식별자(Provider ID)</li>
              <li><strong>보안 및 서비스 이용 시 자동 수집항목:</strong> 접속 IP 주소, 브라우저 정보(User-Agent), 서비스 이용 기록</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 mb-4">
              제 2 조 (개인정보의 처리 목적 및 보호 조치)
            </h2>
            <ul className="list-disc pl-6 space-y-3 text-base sm:text-lg text-zinc-800 leading-relaxed sm:leading-8 marker:text-zinc-400">
              <li><strong>처리 목적:</strong> 회원 식별 및 가입 의사 확인, 중복 로그인 및 비정상적 세션 접근 차단, 개인화된 핫딜 추천 및 서비스 개선</li>
              <li><strong>암호화 조치:</strong> 회사는 수집된 이메일, 이름 등 민감한 개인정보를 데이터베이스에 저장할 때 <strong>AES-256-GCM 방식의 강력한 양방향 암호화</strong>를 적용하여 안전하게 보관합니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 mb-4">
              제 3 조 (개인정보의 보유 및 파기)
            </h2>
            <p className="text-base sm:text-lg text-zinc-800 leading-relaxed sm:leading-8">
              회사는 회원이 탈퇴를 요청하거나 개인정보 수집 및 이용 목적이 달성된 경우, 해당 개인정보를 복구 불가능한 방법으로 지체 없이 파기합니다. 단, 관계 법령에 따라 일정 기간 보존해야 하는 정보는 해당 기간 동안만 안전하게 분리 보관합니다.
            </p>
          </section>
          </div>
        )}
      </div>
    </div>
  );
}
