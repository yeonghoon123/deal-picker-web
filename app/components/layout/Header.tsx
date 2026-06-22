"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe, LogIn, Menu, LogOut, User as UserIcon } from "lucide-react";
import { SearchBar } from "../common/SearchBar";
import { useTranslation } from "react-i18next";
import "../../../lib/i18n";
import { Sidebar } from "./Sidebar";

interface UserProfile {
    id: string;
    email: string;
    name: string;
    role: string;
}

export function Header() {
    const { t, i18n } = useTranslation();
    const pathname = usePathname();
    const isLoginPage = pathname === "/login";
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // hydration error 방지를 위한 마운트 체크
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const fetchProfile = async () => {
            try {
                const apiUrl =
                    process.env.NEXT_PUBLIC_API_URL ||
                    "http://localhost:3001/api";
                const response = await fetch(`${apiUrl}/auth/profile`, {
                    credentials: "include",
                });
                if (response.ok) {
                    const data = await response.json();
                    setUser(data);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error("Failed to fetch profile", error);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleLogout = async () => {
        try {
            const apiUrl =
                process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
            await fetch(`${apiUrl}/auth/logout`, {
                method: "GET",
                credentials: "include",
            });
            setUser(null);
            setIsSidebarOpen(false); // 로그아웃 시 사이드바 닫기
        } catch (error) {
            console.error("Failed to logout", error);
        }
    };

    const toggleLanguage = () => {
        const nextLng = i18n.language.startsWith("ko") ? "en" : "ko";
        i18n.changeLanguage(nextLng);
    };

    const LanguageToggle = () => (
        <button
            onClick={toggleLanguage}
            className="inline-flex items-center justify-center gap-2 h-9 md:h-10 px-3 text-sm font-medium text-zinc-700 bg-white border border-zinc-200 rounded-full transition-colors hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2"
            aria-label="Toggle language"
        >
            <Globe className="w-4 h-4" />
            <span className="uppercase font-semibold">
                {mounted ? (i18n.language.startsWith("en") ? "EN" : "KR") : "KR"}
            </span>
        </button>
    );

    const LoginButton = () => (
        <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 h-9 md:h-10 px-4 md:px-6 text-sm font-medium text-white rounded-full bg-zinc-900 transition-colors hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2"
        >
            <LogIn className="w-4 h-4" />
            <span>{t("header.login")}</span>
        </Link>
    );

    const UserMenu = () => (
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-700">
                <UserIcon className="w-4 h-4" />
                <span className="hidden sm:inline-block">{t("header.welcome", { name: user?.name })}</span>
            </div>
            <button
                onClick={handleLogout}
                className="hidden md:inline-flex items-center justify-center gap-2 h-9 md:h-10 px-4 md:px-6 text-sm font-medium text-zinc-700 border border-zinc-200 rounded-full bg-white transition-colors hover:bg-zinc-50 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2"
            >
                <LogOut className="w-4 h-4" />
                <span>{t("header.logout")}</span>
            </button>
        </div>
    );

    return (
        <>
            <div className="sticky top-0 z-40 flex flex-col w-full shadow-sm">
                <header className="bg-white w-full border-b border-zinc-200">
                    <div className="max-w-screen-xl mx-auto px-4 py-4 md:px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-8">
                            <div className="flex items-center justify-between">
                                <h1 className="text-xl md:text-2xl font-bold text-zinc-900 tracking-tight shrink-0">
                                    <Link href="/">Deal Picker</Link>
                                </h1>
                                <div className="md:hidden flex items-center gap-2">
                                    <LanguageToggle />
                                    {!isLoading && (user ? <UserMenu /> : <LoginButton />)}
                                    <button
                                        onClick={() => setIsSidebarOpen(true)}
                                        className="p-2 text-zinc-700 hover:bg-zinc-100 rounded-full transition-colors ml-1"
                                        aria-label="Open menu"
                                    >
                                        <Menu className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>
                            {!isLoginPage && (
                                <div className="w-full md:flex-1 md:max-w-2xl">
                                    <Suspense
                                        fallback={
                                            <div className="w-full h-11 md:h-12 bg-zinc-100 animate-pulse rounded-full" />
                                        }
                                    >
                                        <SearchBar />
                                    </Suspense>
                                </div>
                            )}
                            <div className="hidden md:flex items-center gap-2 shrink-0">
                                <LanguageToggle />
                                {!isLoading && (user ? <UserMenu /> : <LoginButton />)}
                                <button
                                    onClick={() => setIsSidebarOpen(true)}
                                    className="p-2 text-zinc-700 hover:bg-zinc-100 rounded-full transition-colors ml-2"
                                    aria-label="Open menu"
                                >
                                    <Menu className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                    </div>
                </header>
            </div>

            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                user={user}
                onLogout={handleLogout}
            />
        </>
    );
}
