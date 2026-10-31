"use client";

import { useRouter } from "next/navigation";
import SurveyForm from "@/components/SurveyForm";
import { SurveyFormData } from "@/types/survey";

export default function NewSurveyPage() {
  const router = useRouter();

  async function handleCreate(formData: SurveyFormData) {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Session expired. Please log in to save your survey.");
      router.push("/login");
      return;
    }

    const res = await fetch("/api/createSurvey", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      alert("Survey report saved successfully!");
      router.push("/dashboard");
    } else {
      alert(data.message || "Failed to save survey");
    }
  }

  return <SurveyForm onSubmit={handleCreate} />;
}
