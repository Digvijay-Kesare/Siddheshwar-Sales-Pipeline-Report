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
        console.error(error);
        alert("Failed to load survey");
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    }

    loadSurvey();
  }, [surveyNo, router]);

  async function handleUpdate(data: any) {
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
        alert("Survey updated successfully");
        router.push("/dashboard");
      } else {
        const result = await res.json();
        alert(result.message || "Failed to update survey");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to update survey");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
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