"use client";

import { useEffect,useState } from "react";
import { useParams,useRouter } from "next/navigation";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function SurveyViewPage(){

  const params = useParams();
  const router = useRouter();

  const surveyNo = params?.surveyNo;

  const [survey,setSurvey] = useState<any>(null);



  useEffect(()=>{

    if(!surveyNo) return;

    async function loadSurvey(){

      const res = await fetch(`/api/getSurveyByNo?surveyNo=${surveyNo}`);
      const data = await res.json();

      setSurvey(data);

    }

    loadSurvey();

  },[surveyNo]);



  // 📄 Generate PDF
  function generatePDF(){

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Agriculture Pipeline Survey Report",14,20);

    doc.setFontSize(12);

    doc.text(`Survey No: ${survey.surveyNo}`,14,40);
    doc.text(`Customer: ${survey.customer}`,14,48);
    doc.text(`Village: ${survey.village}`,14,56);
    doc.text(`Discharge: ${survey.discharge}`,14,64);
    doc.text(`Static Height: ${survey.staticHeight}`,14,72);

    const tableRows = survey.rows.map((row:any)=>[
      row.description,
      row.size,
      row.qty,
      row.unit,
      row.floss,
      row.remark
    ]);

    autoTable(doc,{
      startY:85,
      head:[["Description","Size","Qty","Unit","F.Loss","Remark"]],
      body:tableRows
    });

    doc.text(
      `Total Head: ${survey.totalHead}`,
      14,
      (doc as any).lastAutoTable.finalY + 10
    );

    return doc;

  }



  // ⬇ Download
  function downloadPDF(){

    const doc = generatePDF();
    doc.save(`survey-${survey.surveyNo}.pdf`);

  }



  // 📲 Share
  async function sharePDF(){

    const doc = generatePDF();

    const blob = doc.output("blob");

    const file = new File(
      [blob],
      `survey-${survey.surveyNo}.pdf`,
      {type:"application/pdf"}
    );

    if(navigator.share){

      await navigator.share({
        files:[file],
        title:"Pipeline Survey Report",
        text:"Sharing agriculture pipeline survey report"
      });

    }else{

      alert("Sharing not supported on this device");

    }

  }



  if(!survey){
    return <div className="p-6">Loading survey...</div>;
  }



  return(

    <div className="p-6 space-y-6">

      {/* Buttons */}

      <div className="flex gap-3">

        <button
          onClick={()=>router.push("/dashboard")}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Back
        </button>

        <button
          onClick={()=>router.push(`/survey/edit/${survey.surveyNo}`)}
          className="bg-yellow-500 text-white px-4 py-2 rounded"
        >
          Edit
        </button>

        <button
          onClick={downloadPDF}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Download PDF
        </button>

        <button
          onClick={sharePDF}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Share
        </button>

      </div>



      {/* Survey Details */}

      <h1 className="text-2xl font-bold">
        Survey #{survey.surveyNo}
      </h1>

      <div className="grid grid-cols-2 gap-4">

        <div><b>Customer:</b> {survey.customer}</div>
        <div><b>Village:</b> {survey.village}</div>
        <div><b>Discharge:</b> {survey.discharge}</div>
        <div><b>Static Height:</b> {survey.staticHeight}</div>

      </div>



      {/* Items Table */}

      <table className="w-full border">

        <thead className="bg-gray-100">

          <tr>
            <th className="border p-2">Description</th>
            <th className="border p-2">Size</th>
            <th className="border p-2">Qty</th>
            <th className="border p-2">Unit</th>
            <th className="border p-2">F.Loss</th>
            <th className="border p-2">Remark</th>
          </tr>

        </thead>

        <tbody>

          {survey.rows.map((row:any,i:number)=>(

            <tr key={i} className="text-center">

              <td className="border p-2">{row.description}</td>
              <td className="border p-2">{row.size}</td>
              <td className="border p-2">{row.qty}</td>
              <td className="border p-2">{row.unit}</td>
              <td className="border p-2">{row.floss}</td>
              <td className="border p-2">{row.remark}</td>

            </tr>

          ))}

        </tbody>

      </table>



      <div className="font-semibold text-lg">
        Total Head: {survey.totalHead}
      </div>

    </div>

  );

}