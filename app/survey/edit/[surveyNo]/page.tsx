"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import SurveyForm from "@/components/SurveyForm";
import { ArrowLeft } from "lucide-react";
import { SurveyFormData, SurveyRecord } from "@/types/survey";

export default function EditSurveyPage() {
  const router = useRouter();
  const params = useParams();

  const surveyNo = params?.surveyNo as string;

  const [survey, setSurvey] = useState<SurveyRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!surveyNo) return;

    async function loadSurvey() {
      try {
        const res = await fetch(
          `/api/getSurveyByNo?surveyNo=${encodeURIComponent(surveyNo)}`
        );

        if (!res.ok) {
          alert("Failed to load survey");
          router.push("/dashboard");
          return;
        }

        const data: SurveyRecord = await res.json();
        setSurvey(data);
      } catch (error) {
        console.error(error);
        alert("Failed to load survey");
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    }

    loadSurvey();
  }, [surveyNo, router]);

  async function handleUpdate(data: SurveyFormData) {
    try {
      const res = await fetch("/api/updateSurvey", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          surveyno: Number(surveyNo),
        }),
      });

      if (res.ok) {
        alert("Survey updated successfully!");
        router.push("/dashboard");
      } else {
        const result = await res.json().catch(() => ({}));
        alert(result.message || "Failed to update survey");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to update survey");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-gray-700">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-green-600 border-t-transparent mb-4" />
        <p className="text-sm font-medium">Loading survey #{surveyNo} details...</p>
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-gray-800">
        <div className="bg-white border border-gray-200 rounded-xl p-8 max-w-md text-center shadow-sm">
          <p className="text-red-600 font-semibold text-lg mb-2">Survey Not Found</p>
          <p className="text-sm text-gray-500 mb-6">
            The requested pipeline survey #{surveyNo} does not exist or has been removed.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium px-5 py-2.5 rounded-lg text-sm transition"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <SurveyForm
      initialData={survey}
      onSubmit={handleUpdate}
    />
  );
}
