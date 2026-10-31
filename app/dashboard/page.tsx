"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  LogOut,
  Search,
  FileText,
  Edit,
  Trash2,
  ExternalLink,
  Activity,
  MapPin,
  TrendingUp,
} from "lucide-react";
import { SurveyRecord } from "@/types/survey";

export default function DashboardPage() {
  const router = useRouter();

  const [surveys, setSurveys] = useState<SurveyRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadSurveys() {
      const token = localStorage.getItem("token");

      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const res = await fetch("/api/getSurveys", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });

        const data: SurveyRecord[] = await res.json();

        if (Array.isArray(data)) {
          // Sort newest survey first
          setSurveys(data.sort((a, b) => Number(b.surveyno || 0) - Number(a.surveyno || 0)));
        } else {
          setSurveys([]);
        }
      } catch (err) {
        console.error("Dashboard load surveys error:", err);
        setSurveys([]);
      } finally {
        setLoading(false);
      }
    }

    loadSurveys();
  }, [router]);

  function handleLogout() {
    localStorage.removeItem("token");
    router.replace("/login");
  }

  async function handleDelete(surveyNo: number, customerName: string) {
    const confirmDelete = confirm(
      `Are you sure you want to delete Survey #${surveyNo} for "${customerName || "Customer"}"? This action cannot be undone.`
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/deleteSurvey?surveyno=${surveyNo}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setSurveys((prev) => prev.filter((s) => s.surveyno !== surveyNo));
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err.message || "Failed to delete survey");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete survey");
    }
  }

  // Filter surveys based on search query
  const filteredSurveys = useMemo(() => {
    if (!searchQuery.trim()) return surveys;
    const q = searchQuery.toLowerCase();
    return surveys.filter(
      (s) =>
        String(s.surveyno).includes(q) ||
        (s.customer && s.customer.toLowerCase().includes(q)) ||
        (s.village && s.village.toLowerCase().includes(q))
    );
  }, [surveys, searchQuery]);

  // Aggregate stats
  const totalCount = surveys.length;
  const avgHead =
    totalCount > 0
      ? (
          surveys.reduce((sum, s) => sum + Number(s.totalHead || 0), 0) / totalCount
        ).toFixed(2)
      : "0.00";

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Header */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-600 animate-pulse" />
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
                Agri Pipeline Dashboard
              </h1>
            </div>
            <p className="text-xs md:text-sm text-gray-600 mt-1">
              Manage agricultural pipeline surveys, calculate friction losses, and generate reports
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/survey/new")}
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white px-4 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition"
            >
              <Plus size={18} />
              New Survey
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 px-3.5 py-2.5 rounded-lg text-sm font-medium transition shadow-sm"
              title="Sign out of account"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </header>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Total Surveys
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {totalCount}
                </p>
              </div>
              <div className="p-3 bg-green-100 text-green-700 rounded-xl">
                <FileText size={22} />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Recorded in your pipeline database
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Average Pump Head
                </p>
                <p className="text-2xl font-bold text-green-700 mt-1">
                  {avgHead} <span className="text-sm font-normal text-gray-500">meters</span>
                </p>
              </div>
              <div className="p-3 bg-blue-100 text-blue-700 rounded-xl">
                <Activity size={22} />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Across all calculated installations
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  System Status
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  Active
                </p>
              </div>
              <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl">
                <TrendingUp size={22} />
              </div>
            </div>
            <p className="text-xs text-green-600 font-medium mt-3">
              • Auto-friction calculation online
            </p>
          </div>
        </div>

        {/* Survey Table Card */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
          {/* Card Header & Search */}
          <div className="p-4 md:p-5 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-gray-50/50">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Your Pipeline Surveys
              </h2>
              <p className="text-xs text-gray-500">
                Click on any customer name to view full report and download PDF
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search customer, village..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg pl-9 pr-3.5 py-2 text-xs md:text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
              />
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-16 text-gray-600">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-green-600 border-t-transparent mb-4" />
              <p className="text-sm font-medium">Loading survey reports...</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredSurveys.length === 0 && (
            <div className="text-center py-16 px-4">
              <div className="inline-flex p-3 bg-gray-100 text-gray-500 rounded-full mb-3">
                <FileText size={28} />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-1">
                {searchQuery ? "No matching surveys found" : "No surveys created yet"}
              </h3>
              <p className="text-xs md:text-sm text-gray-500 max-w-sm mx-auto mb-5">
                {searchQuery
                  ? "Try adjusting your search query or clear the filter."
                  : "Get started by creating your first agricultural pipeline survey report."}
              </p>
              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery("")}
                  className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100 transition"
                >
                  Clear Search
                </button>
              ) : (
                <button
                  onClick={() => router.push("/survey/new")}
                  className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow transition"
                >
                  <Plus size={16} />
                  Create First Survey
                </button>
              )}
            </div>
          )}

          {/* Table */}
          {!loading && filteredSurveys.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-100 border-b border-gray-200 text-gray-700 text-xs uppercase font-semibold">
                  <tr>
                    <th className="p-3.5">Survey #</th>
                    <th className="p-3.5">Customer</th>
                    <th className="p-3.5">Village / Location</th>
                    <th className="p-3.5">Discharge</th>
                    <th className="p-3.5">Total Head</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {filteredSurveys.map((s, index) => (
                    <tr
                      key={s.surveyno || index}
                      className="hover:bg-green-50/40 transition"
                    >
                      <td className="p-3.5 font-mono font-bold text-gray-900 text-xs">
                        #{s.surveyno}
                      </td>

                      <td className="p-3.5 font-semibold">
                        <button
                          type="button"
                          onClick={() => router.push(`/survey/${s.surveyno}`)}
                          className="inline-flex items-center gap-1.5 text-green-700 hover:text-green-900 hover:underline font-semibold text-left"
                        >
                          {s.customer || "Unnamed Customer"}
                          <ExternalLink size={13} className="text-gray-400" />
                        </button>
                      </td>

                      <td className="p-3.5 text-gray-700">
                        <span className="inline-flex items-center gap-1 text-gray-700">
                          <MapPin size={13} className="text-gray-400" />
                          {s.village || "-"}
                        </span>
                      </td>

                      <td className="p-3.5 text-gray-700 text-xs">
                        {s.discharge ? `${s.discharge} LPS` : "-"}
                      </td>

                      <td className="p-3.5 font-bold text-gray-900">
                        <span className="inline-block px-2 py-0.5 bg-green-100 text-green-800 rounded font-bold text-xs">
                          {s.totalHead
                            ? `${Number(s.totalHead).toFixed(3)} m`
                            : "0.000 m"}
                        </span>
                      </td>

                      <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => router.push(`/survey/${s.surveyno}`)}
                          className="inline-flex items-center gap-1 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 px-2.5 py-1.5 rounded-md text-xs font-medium transition"
                          title="View Survey"
                        >
                          View
                        </button>

                        <button
                          type="button"
                          onClick={() => router.push(`/survey/edit/${s.surveyno}`)}
                          className="inline-flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-white px-2.5 py-1.5 rounded-md text-xs font-medium transition"
                          title="Edit Survey"
                        >
                          <Edit size={12} />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(s.surveyno, s.customer)}
                          className="inline-flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-2.5 py-1.5 rounded-md text-xs font-medium transition"
                          title="Delete Survey"
                        >
                          <Trash2 size={12} />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Floating Quick Action Button */}
        <button
          onClick={() => router.push("/survey/new")}
          className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-xl hover:scale-105 transition duration-200 z-20"
          title="Create New Survey"
        >
          <Plus size={28} />
        </button>
      </div>
    </div>
  );
}
