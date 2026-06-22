"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import "../../../lib/i18n";

interface User {
  id: string;
  email: string;
  name: string;
  role: "USER" | "ADMIN";
  createdAt: string;
}

export default function UsersPage() {
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
      const res = await fetch(`${apiUrl}/admin/users`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const changeRole = async (id: string, newRole: string) => {
    if (!confirm(`${t("admin.users.confirmRole").replace("{{role}}", newRole)}`)) {
      setUsers([...users]); // 롤백을 위해 강제 리렌더링
      return;
    }
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
      const res = await fetch(`${apiUrl}/admin/users/${id}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === id ? { ...u, role: newRole as "USER" | "ADMIN" } : u))
        );
      } else {
        alert(t("admin.users.roleFail"));
        setUsers([...users]);
      }
    } catch (err) {
      console.error(err);
      alert(t("admin.users.roleError"));
      setUsers([...users]);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">{t("admin.users.title")}</h1>
        <p className="text-sm text-zinc-500">{t("admin.users.desc")}</p>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-zinc-50/80 text-zinc-500 border-b border-zinc-200">
              <tr>
                <th className="px-6 py-4 font-medium">{t("admin.users.colName")}</th>
                <th className="px-6 py-4 font-medium">{t("admin.users.colEmail")}</th>
                <th className="px-6 py-4 font-medium">{t("admin.users.colRole")}</th>
                <th className="px-6 py-4 font-medium">{t("admin.users.colDate")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-zinc-400" />
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-zinc-500">
                    가입한 유저가 없습니다.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="bg-white hover:bg-zinc-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-zinc-900">{user.name}</td>
                    <td className="px-6 py-4 text-zinc-600">{user.email}</td>
                    <td className="px-6 py-4">
                      <select
                        value={user.role}
                        onChange={(e) => changeRole(user.id, e.target.value)}
                        className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold cursor-pointer border-0 outline-none focus:ring-2 focus:ring-offset-1 focus:ring-zinc-900 transition-colors appearance-none ${
                          user.role === "ADMIN"
                            ? "bg-zinc-900 text-white hover:bg-zinc-800"
                            : "bg-zinc-100 text-zinc-800 hover:bg-zinc-200"
                        }`}
                      >
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-zinc-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
