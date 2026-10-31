"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  ArrowLeft,
  Edit,
  Download,
  Share2,
  FileText,
  Printer,
  CheckCircle,
  MapPin,
  User,
  Activity,
  Layers,
} from "lucide-react";
import { SurveyRecord, SurveyRow } from "@/types/survey";

export default function SurveyViewPage() {
  const params = useParams();
  const router = useRouter();

  const surveyNo = params?.surveyNo;

  const [survey, setSurvey] = useState<SurveyRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!surveyNo) return;

    async function loadSurvey() {
      try {
        const res = await fetch(
          `/api/getSurveyByNo?surveyNo=${encodeURIComponent(String(surveyNo))}`
        );

        if (!res.ok) {
          setSurvey(null);
          return;
        }

        const data: SurveyRecord = await res.json();
        setSurvey(data);
      } catch (error) {
        console.error("Load survey error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadSurvey();
  }, [surveyNo]);

  // Generate Styled Engineering PDF
  function generatePDF() {
    if (!survey) return null;

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();

    // Header Banner
    doc.setFillColor(34, 139, 34); // Forest Green
    doc.rect(0, 0, pageWidth, 28, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("AGRICULTURE PIPELINE SURVEY REPORT", 14, 13);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(
      "Irrigation Hydraulic Design • Pipe Friction Loss & Pump Head Calculation",
      14,
      20
    );

    // Survey Metadata Box
    doc.setTextColor(30, 41, 59);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(14, 34, pageWidth - 28, 38, 2, 2, "FD");

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(`Survey No: #${survey.surveyno}`, 20, 43);
    doc.text(`Report Date: ${new Date().toLocaleDateString()}`, pageWidth - 70, 43);

    doc.setFont("helvetica", "normal");
    doc.text(`Customer Name: ${survey.customer || "-"}`, 20, 52);
    doc.text(`Village / Location: ${survey.village || "-"}`, 20, 60);

    const dischargeVal = survey.discharge ? `${survey.discharge} LPS` : "N/A";
    const staticHVal = survey.staticheight || survey.staticHeight
      ? `${survey.staticheight || survey.staticHeight} Meters`
      : "0.00 Meters";

    doc.text(`Discharge Rate: ${dischargeVal}`, pageWidth - 90, 52);
    doc.text(`Static Head (Elevation): ${staticHVal}`, pageWidth - 90, 60);

    // Prepare table data
    const rows: SurveyRow[] = Array.isArray(survey.rows) ? survey.rows : [];
    const tableRows = rows.map((row: SurveyRow, idx: number) => [
      String(idx + 1),
      row.description || "-",
      row.size || "-",
      String(row.qty || "0"),
      row.unit || "-",
      Number(row.floss || 0).toFixed(3),
      row.remark || "-",
    ]);

    autoTable(doc, {
      startY: 78,
      head: [
        [
          "#",
          "Component Description",
          "Specification / Size",
          "Qty",
          "Unit",
          "Friction Loss (m)",
          "Remarks",
        ],
      ],
      body: tableRows,
      theme: "grid",
      headStyles: {
        fillColor: [34, 139, 34],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 9,
      },
      styles: {
        fontSize: 8.5,
        cellPadding: 3,
        textColor: [30, 41, 59],
      },
      columnStyles: {
        0: { cellWidth: 10, halign: "center" },
        1: { cellWidth: 50 },
        2: { cellWidth: 35 },
        3: { cellWidth: 15, halign: "right" },
        4: { cellWidth: 15, halign: "center" },
        5: { cellWidth: 28, halign: "right", fontStyle: "bold" },
        6: { cellWidth: "auto" },
      },
    });

    // Summary Box below Table
    const lastTable = (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable;
    const finalY = lastTable?.finalY || 150;

    const totalFriction = rows.reduce(
      (sum: number, r: SurveyRow) => sum + Number(r.floss || 0),
      0
    );
    const staticH = Number(survey.staticheight || survey.staticHeight || 0);
    const totalPumpHead = Number(survey.totalHead || (staticH + totalFriction)).toFixed(3);

    doc.setFillColor(240, 253, 244); // Light Green
    doc.setDrawColor(187, 247, 208);
    doc.roundedRect(14, finalY + 8, pageWidth - 28, 30, 2, 2, "FD");

    doc.setTextColor(22, 101, 52);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("HYDRAULIC HEAD CALCULATION SUMMARY", 20, finalY + 16);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(30, 41, 59);
    doc.text(`Static Head: ${staticH.toFixed(2)} m`, 20, finalY + 24);
    doc.text(`Total Friction Loss: ${totalFriction.toFixed(3)} m`, 75, finalY + 24);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(21, 128, 61);
    doc.text(`Total Operating Head: ${totalPumpHead} Meters`, pageWidth - 85, finalY + 24);

    // Footer
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      "Generated via Agri Pipeline Survey Report System • Siddheshwar Irrigation Works",
      14,
      doc.internal.pageSize.getHeight() - 10
    );

    return doc;
  }

  function downloadPDF() {
    const doc = generatePDF();
    if (!doc) return;
    doc.save(`Pipeline-Survey-#${survey?.surveyno}-${survey?.customer || "Report"}.pdf`);
  }

  async function sharePDF() {
    const doc = generatePDF();
    if (!doc || !survey) return;

    try {
      const blob = doc.output("blob");
      const file = new File(
        [blob],
        `Pipeline-Survey-#${survey.surveyno}.pdf`,
        { type: "application/pdf" }
      );

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `Pipeline Survey #${survey.surveyno} - ${survey.customer}`,
          text: `Agriculture Pipeline Survey Report for ${survey.customer}, ${survey.village}. Total Head: ${survey.totalHead}m`,
        });
      } else {
        downloadPDF();
        alert("Native file sharing is not supported on this browser. The PDF has been downloaded instead.");
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== "AbortError") {
        console.error(err);
        downloadPDF();
      }
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 text-gray-800">
        <div className="bg-white border border-gray-200 rounded-xl p-8 max-w-md text-center shadow-sm">
          <p className="text-red-600 font-bold text-lg mb-2">Survey Not Found</p>
          <p className="text-sm text-gray-500 mb-6">
            Survey #{surveyNo} could not be located. It might have been deleted.
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

  const rows: SurveyRow[] = Array.isArray(survey.rows) ? survey.rows : [];
  const totalFriction = rows.reduce(
    (sum: number, r: SurveyRow) => sum + Number(r.floss || 0),
    0
  );
  const staticH = Number(survey.staticheight || survey.staticHeight || 0);
  const computedTotalHead = Number(survey.totalHead || (staticH + totalFriction)).toFixed(3);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Action Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/dashboard")}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition shadow-sm"
            >
              <ArrowLeft size={16} />
              Dashboard
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Survey Report #{survey.surveyno}
                </h1>
                <span className="px-2.5 py-0.5 bg-green-100 text-green-800 text-xs font-semibold rounded-full border border-green-200">
                  Active
                </span>
              </div>
              <p className="text-xs md:text-sm text-gray-500 mt-0.5">
                Detailed pipeline friction loss and total pump head analysis
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => router.push(`/survey/edit/${survey.surveyno}`)}
              className="inline-flex items-center gap-1.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 px-3.5 py-2 rounded-lg text-sm font-medium shadow-sm transition"
            >
              <Edit size={15} />
              Edit
            </button>

            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 px-3.5 py-2 rounded-lg text-sm font-medium shadow-sm transition"
            >
              <Printer size={15} />
              Print
            </button>

            <button
              onClick={sharePDF}
              className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-lg text-sm font-medium shadow-sm transition"
            >
              <Share2 size={15} />
              Share
            </button>

            <button
              onClick={downloadPDF}
              className="inline-flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition"
            >
              <Download size={15} />
              Download PDF
            </button>
          </div>
        </div>

        {/* Survey Details Summary Card */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-50 border border-gray-200/80 rounded-xl p-4 flex items-start gap-3">
              <div className="p-2.5 bg-green-100 text-green-700 rounded-lg">
                <User size={20} />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Customer
                </p>
                <p className="text-base font-bold text-gray-900 mt-0.5">
                  {survey.customer || "-"}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200/80 rounded-xl p-4 flex items-start gap-3">
              <div className="p-2.5 bg-blue-100 text-blue-700 rounded-lg">
                <MapPin size={20} />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Village / Location
                </p>
                <p className="text-base font-bold text-gray-900 mt-0.5">
                  {survey.village || "-"}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200/80 rounded-xl p-4 flex items-start gap-3">
              <div className="p-2.5 bg-cyan-100 text-cyan-700 rounded-lg">
                <Activity size={20} />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Discharge Rate
                </p>
                <p className="text-base font-bold text-gray-900 mt-0.5">
                  {survey.discharge ? `${survey.discharge} LPS` : "Not specified"}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200/80 rounded-xl p-4 flex items-start gap-3">
              <div className="p-2.5 bg-purple-100 text-purple-700 rounded-lg">
                <Layers size={20} />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Static Head
                </p>
                <p className="text-base font-bold text-gray-900 mt-0.5">
                  {staticH.toFixed(2)} m
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Components Table Card */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
          <div className="p-5 border-b border-gray-200 bg-gray-50/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="text-green-600" size={18} />
              <h2 className="text-base md:text-lg font-bold text-gray-900">
                Pipeline Specifications & Friction Losses
              </h2>
            </div>
            <span className="text-xs text-gray-500">
              {rows.length} {rows.length === 1 ? "item" : "items"}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-100 border-b border-gray-200 text-gray-700 text-xs uppercase font-semibold">
                <tr>
                  <th className="p-3.5">#</th>
                  <th className="p-3.5">Description</th>
                  <th className="p-3.5">Size / Spec</th>
                  <th className="p-3.5">Qty</th>
                  <th className="p-3.5">Unit</th>
                  <th className="p-3.5">Friction Loss (m)</th>
                  <th className="p-3.5">Remark</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-500">
                      No components listed for this survey
                    </td>
                  </tr>
                ) : (
                  rows.map((row: SurveyRow, i: number) => (
                    <tr key={i} className="hover:bg-gray-50/70 transition">
                      <td className="p-3.5 text-gray-500 text-xs font-mono">
                        {i + 1}
                      </td>
                      <td className="p-3.5 font-semibold text-gray-900">
                        {row.description}
                      </td>
                      <td className="p-3.5 text-gray-700">
                        <span className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-800 font-medium">
                          {row.size}
                        </span>
                      </td>
                      <td className="p-3.5 font-bold text-gray-900">
                        {row.qty}
                      </td>
                      <td className="p-3.5 text-gray-600 text-xs">
                        {row.unit}
                      </td>
                      <td className="p-3.5 font-bold text-green-700">
                        {Number(row.floss || 0).toFixed(3)} m
                      </td>
                      <td className="p-3.5 text-gray-600 text-xs">
                        {row.remark || "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Hydraulic Head Sizing Summary Banner */}
        <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 border border-green-300/80 rounded-xl p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-green-800 font-bold text-sm uppercase tracking-wide">
                <CheckCircle size={18} />
                Pump Sizing Head Requirements
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Pump operating head must overcome both vertical elevation difference and pipeline friction resistance
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-white border border-gray-200 rounded-lg px-4 py-2.5">
                <p className="text-xs text-gray-500">Static Head</p>
                <p className="text-sm font-bold text-gray-900">{staticH.toFixed(2)} m</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg px-4 py-2.5">
                <p className="text-xs text-gray-500">Friction Loss</p>
                <p className="text-sm font-bold text-green-700">{totalFriction.toFixed(3)} m</p>
              </div>
              <div className="bg-green-600 text-white rounded-lg px-4 py-2.5 shadow-sm">
                <p className="text-xs text-green-100">Total Head</p>
                <p className="text-base font-extrabold">{computedTotalHead} m</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
