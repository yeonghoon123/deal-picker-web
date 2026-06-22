"use client";

import { useState, useEffect } from "react";
import { Loader2, Plus, Edit2, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import "../../../lib/i18n";

interface Mall {
  id: number;
  name: string;
  code: string;
  apiType: string;
  apiConfig: any;
}

export default function MallsPage() {
  const { t } = useTranslation();
  const [malls, setMalls] = useState<Mall[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMall, setEditingMall] = useState<Mall | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [apiType, setApiType] = useState("DIRECT");
  const [apiConfig, setApiConfig] = useState("");

  const fetchMalls = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
      const res = await fetch(`${apiUrl}/admin/malls`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setMalls(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMalls();
  }, []);

  const openModal = (mall?: Mall) => {
    if (mall) {
      setEditingMall(mall);
      setName(mall.name);
      setCode(mall.code);
      setApiType(mall.apiType || "DIRECT");
      setApiConfig(mall.apiConfig ? JSON.stringify(mall.apiConfig, null, 2) : "");
    } else {
      setEditingMall(null);
      setName("");
      setCode("");
      setApiType("DIRECT");
      setApiConfig("");
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isSubmitting) return;
    setIsModalOpen(false);
    setEditingMall(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
      const method = editingMall ? "PATCH" : "POST";
      const url = editingMall ? `${apiUrl}/admin/malls/${editingMall.id}` : `${apiUrl}/admin/malls`;

      let parsedConfig = undefined;
      if (apiConfig.trim()) {
        try {
          parsedConfig = JSON.parse(apiConfig);
        } catch (err) {
          alert("API 설정은 유효한 JSON 형식이어야 합니다.");
          setIsSubmitting(false);
          return;
        }
      }

      const payload = {
        name,
        code,
        apiType,
        ...(parsedConfig !== undefined && { apiConfig: parsedConfig }),
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        await fetchMalls();
        closeModal();
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(`저장에 실패했습니다: ${errData.message || res.statusText}`);
      }
    } catch (err) {
      console.error(err);
      alert("요청 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">{t("admin.malls.title")}</h1>
          <p className="text-sm text-zinc-500">{t("admin.malls.desc")}</p>
        </div>
        <button
          onClick={() => openModal()}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2"
        >
          <Plus className="h-4 w-4" />
          {t("admin.malls.addBtn")}
        </button>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-zinc-50/80 text-zinc-500 border-b border-zinc-200">
              <tr>
                <th className="px-6 py-4 font-medium">{t("admin.malls.colName")}</th>
                <th className="px-6 py-4 font-medium">{t("admin.malls.colCode")}</th>
                <th className="px-6 py-4 font-medium">{t("admin.malls.colType")}</th>
                <th className="px-6 py-4 font-medium">{t("admin.malls.colConfig")}</th>
                <th className="px-6 py-4 font-medium text-right">{t("admin.malls.colManage")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-zinc-400" />
                  </td>
                </tr>
              ) : malls.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                    등록된 쇼핑몰이 없습니다.
                  </td>
                </tr>
              ) : (
                malls.map((mall) => (
                  <tr key={mall.id} className="bg-white hover:bg-zinc-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-zinc-900">{mall.name}</td>
                    <td className="px-6 py-4 text-zinc-600 font-mono text-xs">{mall.code}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600 ring-1 ring-inset ring-zinc-500/10">
                        {mall.apiType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-zinc-500">
                      {mall.apiConfig ? "있음" : "없음"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => openModal(mall)}
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:text-zinc-900 text-zinc-500 hover:bg-zinc-100 p-2"
                        title="수정"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 sm:p-0 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4 shrink-0">
              <h2 className="text-lg font-semibold text-zinc-900">
                {editingMall ? t("admin.malls.modalEdit") : t("admin.malls.modalAdd")}
              </h2>
              <button
                onClick={closeModal}
                className="rounded-full p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="overflow-y-auto p-6">
              <form id="mall-form" onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-zinc-900">
                    쇼핑몰명
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                    placeholder="예: 쿠팡"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="code" className="text-sm font-medium text-zinc-900">
                    식별 코드
                  </label>
                  <input
                    id="code"
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                    placeholder="예: COUPANG (영문 대문자 권장)"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="apiType" className="text-sm font-medium text-zinc-900">
                    API 연동 타입
                  </label>
                  <select
                    id="apiType"
                    value={apiType}
                    onChange={(e) => setApiType(e.target.value)}
                    className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                  >
                    <option value="DIRECT">DIRECT (직접 연동)</option>
                    <option value="LINKPRICE">LINKPRICE (링크프라이스)</option>
                    <option value="COUPANG_PARTNERS">COUPANG_PARTNERS</option>
                    <option value="ALIE_EXPRESS">ALIE_EXPRESS</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="apiConfig" className="text-sm font-medium text-zinc-900">
                    API 설정 (JSON)
                  </label>
                  <textarea
                    id="apiConfig"
                    rows={5}
                    value={apiConfig}
                    onChange={(e) => setApiConfig(e.target.value)}
                    className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 font-mono placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent resize-y"
                    placeholder='{"apiKey": "...", "endpoint": "..."}'
                  />
                  <p className="text-xs text-zinc-500">
                    인증키나 엔드포인트 등 연동에 필요한 설정을 JSON 형식으로 입력하세요.
                  </p>
                </div>
              </form>
            </div>
            
            <div className="border-t border-zinc-100 bg-zinc-50 px-6 py-4 flex justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={closeModal}
                disabled={isSubmitting}
                className="rounded-md px-4 py-2.5 text-sm font-medium text-zinc-700 bg-white border border-zinc-300 hover:bg-zinc-50 transition-colors"
              >
                취소
              </button>
              <button
                type="submit"
                form="mall-form"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {t("admin.malls.save")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
