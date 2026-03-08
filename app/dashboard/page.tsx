"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {

  const router = useRouter();

  const [surveys, setSurveys] = useState<any[]>([]);



  useEffect(() => {

    async function loadSurveys() {

      const token = localStorage.getItem("token");

      if (!token) {
        router.replace("/login");
        return;
      }

      const res = await fetch("/api/getSurveys", {
  headers: {
    Authorization: `Bearer ${token}`
  },
  cache: "no-store"
});

      if (!res.ok) {
        setSurveys([]);
        return;
      }

      const data = await res.json();

      if (Array.isArray(data)) {
        setSurveys(data);
      } else {
        setSurveys([]);
      }

    }

    loadSurveys();

  }, [router]);



  function handleLogout() {
    localStorage.removeItem("token");
    router.replace("/login");
  }



  return (

    <div className="p-6">

      {/* Header */}

      <div className="flex justify-between mb-6">

        <h1 className="text-2xl font-bold">Dashboard</h1>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>

      </div>



      <h2 className="text-lg font-semibold mb-4">
        Your Surveys
      </h2>



      <table className="w-full border">

        <thead className="bg-gray-100">

          <tr>
            <th className="border p-2">Survey No</th>
            <th className="border p-2">Customer</th>
            <th className="border p-2">Village</th>
            <th className="border p-2">Total Head</th>
            <th className="border p-2">Actions</th>
          </tr>

        </thead>



        <tbody>

          {surveys.length === 0 ? (

            <tr>
              <td colSpan={5} className="text-center p-4">
                No surveys yet
              </td>
            </tr>

          ) : (

            surveys.map((s, index) => (

              <tr key={index} className="text-center hover:bg-gray-50">

                <td className="border p-2">{s.surveyNo}</td>

                <td
                  className="border p-2 cursor-pointer"
                  onClick={() => router.push(`/survey/${s.surveyNo}`)}
                >
                  {s.customer}
                </td>

                <td className="border p-2">{s.village}</td>

                <td className="border p-2">
                  {Number(s.totalHead).toFixed(3)}
                </td>



                <td className="border p-2">

                  <button
                    onClick={() => router.push(`/survey/edit/${s.surveyNo}`)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                  >
                    Edit
                  </button>



                  <button
                    onClick={async () => {

                      const confirmDelete = confirm("Delete survey?");
                      if (!confirmDelete) return;

                      const res = await fetch(
                        `/api/deleteSurvey?surveyNo=${s.surveyNo}`,
                        { method: "DELETE" }
                      );

                      if (res.ok) {

                        setSurveys(prev =>
                          prev.filter(
                            survey => survey.surveyNo !== s.surveyNo
                          )
                        );

                      }

                    }}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))

          )}

        </tbody>

      </table>



      {/* Add Survey Button */}

      <button
        onClick={() => router.push("/survey/new")}
        className="fixed bottom-6 right-6 bg-blue-600 text-white w-14 h-14 rounded-full text-2xl"
      >
        +
      </button>

    </div>

  );

}