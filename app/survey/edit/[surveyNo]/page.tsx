"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import SurveyForm from "@/components/SurveyForm";

export default function EditSurveyPage() {
  const router = useRouter();
  const params = useParams();

  const surveyNo = params?.surveyNo as string;

  const [survey, setSurvey] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!surveyNo) return;

    async function loadSurvey() {
      try {
        const res = await fetch(
          `/api/getSurveyByNo?surveyNo=${surveyNo}`
        );

        if (!res.ok) {
          alert("Failed to load survey");
          router.push("/dashboard");
          return;
        }

        const data = await res.json();

        setSurvey(data);
      } catch (error) {
        console.error("LOAD SURVEY ERROR:", error);
        alert("Failed to load survey");
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    }

    loadSurvey();
  }, [surveyNo, router]);

  async function handleUpdate(updatedData: any) {
    try {
      const res = await fetch("/api/updateSurvey", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...updatedData,
          surveyno: Number(surveyNo),
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.message || "Failed to update survey");
        return;
      }

      alert("Survey updated successfully");
      router.push("/dashboard");

    } catch (error) {
      console.error("UPDATE ERROR:", error);
      alert("Failed to update survey");
    }
  }

  if (loading) {
    return (
      <div className="p-6 text-center">
        Loading survey...
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="p-6 text-center text-red-600">
        Survey not found
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