"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, Heart, MessageSquare, Users, Store, User as UserIcon, LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";
import "../../../lib/i18n";

interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  onLogout?: () => void;
}

export function Sidebar({ isOpen, onClose, user, onLogout }: SidebarProps) {
  const pathname = usePathname();
  const { t } = useTranslation();

  // Prevent scrolling when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[100] bg-black/50 transition-opacity backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar Panel */}
      <div className="fixed inset-y-0 right-0 z-[101] w-full max-w-sm bg-white shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
        {/* Header (Profile) */}
        <div className="flex items-start justify-between p-6 border-b border-zinc-100">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-zinc-100 text-zinc-600">
              <UserIcon className="w-6 h-6" />
            </div>
            {user ? (
              <div className="flex flex-col">
                <span className="font-semibold text-zinc-900">{user.name}</span>
                <span className="text-sm text-zinc-500">{user.email}</span>
              </div>
            ) : (
              <div className="flex flex-col">
                <span className="font-semibold text-zinc-900">로그인이 필요합니다</span>
                <Link href="/login" onClick={onClose} className="text-sm text-indigo-600 hover:underline mt-1">
                  로그인하러 가기
                </Link>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 -mr-2 text-zinc-400 hover:text-zinc-600 rounded-full hover:bg-zinc-100 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-4">
          <div className="px-4 mb-2">
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 px-2">마이페이지</h3>
            <ul className="space-y-1">
              <li>
                <button
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-zinc-600 rounded-lg hover:bg-zinc-50 transition-colors opacity-60 cursor-not-allowed"
                  disabled
                  title="추후 오픈 예정"
                >
                  <Heart className="w-5 h-5 text-zinc-400" />
                  <span>관심 핫딜</span>
                  <span className="ml-auto text-[10px] font-medium bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded-full">Coming Soon</span>
                </button>
              </li>
              <li>
                <button
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-zinc-600 rounded-lg hover:bg-zinc-50 transition-colors opacity-60 cursor-not-allowed"
                  disabled
                  title="추후 오픈 예정"
                >
                  <MessageSquare className="w-5 h-5 text-zinc-400" />
                  <span>1:1 문의 내역</span>
                  <span className="ml-auto text-[10px] font-medium bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded-full">Coming Soon</span>
                </button>
              </li>
            </ul>
          </div>

          {user?.role === "ADMIN" && (
            <div className="px-4 mt-8">
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 px-2">{t("admin.dashboard")}</h3>
              <ul className="space-y-1">
                <li>
                  <Link
                    href="/admin"
                    onClick={onClose}
                    className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                      pathname.startsWith("/admin")
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                    }`}
                  >
                    <Users className={`w-5 h-5 ${pathname.startsWith("/admin") ? "text-indigo-600" : "text-zinc-400"}`} />
                    {t("admin.dashboard")}
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Footer (Logout) */}
        {user && onLogout && (
          <div className="p-4 border-t border-zinc-100">
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-zinc-600 bg-zinc-50 rounded-lg hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              로그아웃
            </button>
          </div>
        )}
      </div>
    </>
  );
}
