"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {

  const router = useRouter();

  const [surveys,setSurveys] = useState<any[]>([]);
  const [loading,setLoading] = useState(true);



  useEffect(()=>{

    async function loadSurveys(){

      const token = localStorage.getItem("token");

      if(!token){
        router.replace("/login");
        return;
      }

      try{

        const res = await fetch("/api/getSurveys",{
          headers:{
            Authorization:`Bearer ${token}`
          },
          cache:"no-store"
        });

        const data = await res.json();

        if(Array.isArray(data)){
          setSurveys(data);
        }else{
          setSurveys([]);
        }

      }catch(err){
        console.log(err);
        setSurveys([]);
      }

      setLoading(false);

    }

    loadSurveys();

  },[router]);



  function handleLogout(){
    localStorage.removeItem("token");
    router.replace("/login");
  }



  return(

    <div className="min-h-screen bg-gray-50 p-6">

      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">

        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Dashboard
          </h1>

          <p className="text-gray-500 text-sm mt-1">
            Manage your agricultural pipeline survey reports
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="mt-4 md:mt-0 bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg transition"
        >
          Logout
        </button>

      </div>



      {/* SURVEY TABLE CARD */}

      <div className="bg-white shadow-md rounded-xl overflow-hidden">

        <div className="p-5 border-b">
          <h2 className="text-lg font-semibold text-gray-700">
            Your Surveys
          </h2>
        </div>



        {/* LOADING STATE */}

        {loading && (

          <div className="flex flex-col items-center justify-center py-16">

            <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent mb-4"></div>

            <p className="text-gray-500">
              Loading surveys...
            </p>

          </div>

        )}



        {/* EMPTY STATE */}

        {!loading && surveys.length === 0 && (

          <div className="text-center py-16 text-gray-500">

            <p className="text-lg mb-3">
              No surveys created yet
            </p>

            <button
              onClick={()=>router.push("/survey/new")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
            >
              Create First Survey
            </button>

          </div>

        )}



        {/* TABLE */}

        {!loading && surveys.length > 0 && (

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-100 text-gray-700 text-sm">

                <tr>
                  <th className="p-3 text-left">Survey No</th>
                  <th className="p-3 text-left">Customer</th>
                  <th className="p-3 text-left">Village</th>
                  <th className="p-3 text-left">Total Head</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>

              </thead>



              <tbody>

                {surveys.map((s,index)=>(

                  <tr
                    key={index}
                    className="border-t hover:bg-gray-50 transition"
                  >

                    <td className="p-3 font-medium">
                      {s.surveyNo}
                    </td>



                    <td
                      onClick={()=>router.push(`/survey/${s.surveyNo}`)}
                      className="p-3 text-blue-600 cursor-pointer hover:underline"
                    >
                      {s.customer}
                    </td>



                    <td className="p-3">
                      {s.village}
                    </td>



                    <td className="p-3">

                      {s.totalHead
                        ? Number(s.totalHead).toFixed(3)
                        : "0.000"}

                    </td>



                    <td className="p-3 space-x-2">

                      <button
                        onClick={()=>router.push(`/survey/edit/${s.surveyNo}`)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md text-sm"
                      >
                        Edit
                      </button>



                      <button
                        onClick={async()=>{

                          const confirmDelete = confirm("Delete survey?");
                          if(!confirmDelete) return;

                          const res = await fetch(
                            `/api/deleteSurvey?surveyNo=${s.surveyNo}`,
                            {method:"DELETE"}
                          );

                          if(res.ok){

                            setSurveys(prev =>
                              prev.filter(
                                survey => survey.surveyNo !== s.surveyNo
                              )
                            );

                          }

                        }}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                      >
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



      {/* FLOATING ADD BUTTON */}

      <button
        onClick={()=>router.push("/survey/new")}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white w-16 h-16 rounded-full text-3xl shadow-lg transition"
      >
        +
      </button>



    </div>

  );

}