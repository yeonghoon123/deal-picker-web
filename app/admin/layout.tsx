"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Loader2, Users, Store } from "lucide-react";
import { useTranslation } from "react-i18next";
import "../../lib/i18n";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
        const response = await fetch(`${apiUrl}/auth/profile`, { credentials: "include" });
        if (response.ok) {
          const user = await response.json();
          if (user.role !== "ADMIN") {
            router.replace("/");
          } else {
            setIsChecking(false);
          }
        } else {
          router.replace("/");
        }
      } catch (error) {
        console.error("Admin verification failed", error);
        router.replace("/");
      }
    };
    checkAdmin();
  }, [router]);

  if (isChecking) {
    return (
      <div className="flex h-full min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
      </div>
    );
  }

  return (
    <div className="flex-1 w-full bg-zinc-50 p-4 md:p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-zinc-900 mb-6">{t("admin.dashboard")}</h1>
          <div className="flex items-center gap-2 border-b border-zinc-200">
            <Link
              href="/admin/users"
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                pathname === "/admin/users"
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-zinc-500 hover:text-zinc-700 hover:border-zinc-300"
              }`}
            >
              <Users className="w-4 h-4" />
              {t("admin.users.title")}
            </Link>
            <Link
              href="/admin/malls"
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                pathname === "/admin/malls"
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-zinc-500 hover:text-zinc-700 hover:border-zinc-300"
              }`}
            >
              <Store className="w-4 h-4" />
              {t("admin.malls.title")}
            </Link>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
