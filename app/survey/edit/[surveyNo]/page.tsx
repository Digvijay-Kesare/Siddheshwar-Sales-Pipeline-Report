"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import SurveyForm from "@/components/SurveyForm";

export default function EditSurveyPage() {
  const router = useRouter();
  const params = useParams();

  const surveyNo = params?.surveyNo as string;

  const [survey, setSurvey] = useState<any>(null);

  useEffect(() => {
    if (!surveyNo) return;

    async function load() {
      const res = await fetch(
        `/api/getSurveyByNo?surveyNo=${surveyNo}`
      );

      if (!res.ok) {
        console.error("Failed to load survey");
        return;
      }

      const data = await res.json();

      setSurvey(data);
    }

    load();
  }, [surveyNo]);

  async function handleUpdate(data: any) {
    const res = await fetch("/api/updateSurvey", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      router.push("/dashboard");
    }
  }

  if (!survey) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <SurveyForm
      initialData={survey}
      onSubmit={handleUpdate}
    />
  );
}