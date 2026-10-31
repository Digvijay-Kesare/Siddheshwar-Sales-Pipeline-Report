"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import items from "@/data/items.json";
import { ArrowLeft, Plus, Trash2, CheckCircle2, Calculator } from "lucide-react";
import { SurveyRow, SurveyFormData, SurveyRecord } from "@/types/survey";

interface SurveyFormProps {
  initialData?: Partial<SurveyRecord | SurveyFormData>;
  onSubmit: (data: SurveyFormData) => Promise<void>;
}

export default function SurveyForm({
  initialData = {},
  onSubmit,
}: SurveyFormProps) {
  const router = useRouter();

  const [customer, setCustomer] = useState("");
  const [village, setVillage] = useState("");
  const [discharge, setDischarge] = useState("");
  const [staticHeight, setStaticHeight] = useState("");

  const [selectedDesc, setSelectedDesc] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [qty, setQty] = useState("");
  const [remark, setRemark] = useState("");

  const [rows, setRows] = useState<SurveyRow[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setCustomer(initialData.customer || "");
      setVillage(initialData.village || "");
      setDischarge(initialData.discharge !== undefined ? String(initialData.discharge) : "");
      setStaticHeight(
        initialData.staticheight !== undefined
          ? String(initialData.staticheight)
          : initialData.staticHeight !== undefined
          ? String(initialData.staticHeight)
          : ""
      );
      setRows(Array.isArray(initialData.rows) ? initialData.rows : []);
    }
  }, [initialData]);

  // Calculate total friction loss from pipeline components
  const frictionLoss = rows.reduce(
    (sum: number, row: SurveyRow) => sum + Number(row.floss || 0),
    0
  );

  // Total Head = Static Height (elevation) + Friction Loss
  const staticHeadNum = Number(staticHeight) || 0;
  const totalHead = Number((staticHeadNum + frictionLoss).toFixed(3));

  // Available unique descriptions from catalog
  const descriptions = Array.from(new Set(items.map((i) => i.description)));

  // Available sizes for currently selected description
  const availableSizes = items.filter(
    (item) => item.description === selectedDesc
  );

  function addItem() {
    if (!selectedDesc) {
      alert("Please select a component description");
      return;
    }
    if (!selectedSize) {
      alert("Please select a size / specification");
      return;
    }
    const numQty = Number(qty);
    if (!qty || isNaN(numQty) || numQty <= 0) {
      alert("Please enter a valid positive quantity");
      return;
    }

    const selectedItem = items.find(
      (item) =>
        item.description === selectedDesc && item.size === selectedSize
    );

    if (!selectedItem) {
      alert("Selected item not found in catalog");
      return;
    }

    const lossPerUnit = Number(selectedItem.loss) || 0;
    const computedLoss = Number((numQty * lossPerUnit).toFixed(3));

    const newRow: SurveyRow = {
      description: selectedDesc,
      size: selectedSize,
      qty: numQty,
      unit: selectedItem.unit,
      floss: computedLoss,
      remark: remark.trim() || "-",
    };

    setRows([...rows, newRow]);

    // Reset component inputs
    setSelectedDesc("");
    setSelectedSize("");
    setQty("");
    setRemark("");
  }

  function removeItem(index: number) {
    setRows(rows.filter((_, i) => i !== index));
  }

  async function handleSubmit() {
    if (!customer.trim()) {
      alert("Please enter the customer name");
      return;
    }
    if (!village.trim()) {
      alert("Please enter the village name");
      return;
    }
    if (rows.length === 0) {
      alert("Please add at least one pipeline component to the survey");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        ...initialData,
        customer: customer.trim(),
        village: village.trim(),
        discharge: discharge.trim(),
        staticHeight: staticHeight.trim(),
        staticheight: staticHeight.trim(),
        rows,
        totalHead,
      });
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : "Failed to save survey";
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  }

  const isEditing = Boolean(initialData?.surveyno);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Navigation & Title */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition shadow-sm"
            >
              <ArrowLeft size={16} />
              Dashboard
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {isEditing
                  ? `Edit Pipeline Survey #${initialData.surveyno}`
                  : "Create New Pipeline Survey"}
              </h1>
              <p className="text-xs md:text-sm text-gray-500 mt-0.5">
                Calculate irrigation pipe friction loss and total hydraulic head
              </p>
            </div>
          </div>

          {isEditing && (
            <span className="self-start sm:self-auto px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full border border-yellow-300">
              Editing Mode
            </span>
          )}
        </div>

        {/* Survey Basic Details Card */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-5 md:p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-5 bg-green-600 rounded-full" />
            <h2 className="text-lg font-bold text-gray-900">
              1. General Survey Details
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                Customer Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Ramesh Patil"
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                Village / Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Shirpur"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                Discharge (LPS / Flow)
              </label>
              <input
                type="number"
                step="any"
                placeholder="e.g. 5.5"
                value={discharge}
                onChange={(e) => setDischarge(e.target.value)}
                className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                Static Height (Meters)
              </label>
              <input
                type="number"
                step="any"
                placeholder="e.g. 12"
                value={staticHeight}
                onChange={(e) => setStaticHeight(e.target.value)}
                className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
              />
            </div>
          </div>
        </div>

        {/* Add Component Card */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-5 md:p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-5 bg-green-600 rounded-full" />
            <h2 className="text-lg font-bold text-gray-900">
              2. Add Pipeline Components & Fittings
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 items-end">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                Component Type <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedDesc}
                onChange={(e) => {
                  setSelectedDesc(e.target.value);
                  setSelectedSize("");
                }}
                className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
              >
                <option value="" className="text-gray-400">
                  Select Component...
                </option>
                {descriptions.map((desc) => (
                  <option key={desc} value={desc} className="text-gray-900 bg-white">
                    {desc}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                Specification / Size <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                disabled={!selectedDesc}
                className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition disabled:bg-gray-100 disabled:text-gray-400"
              >
                <option value="" className="text-gray-400">
                  {selectedDesc ? "Select size..." : "Choose component first"}
                </option>
                {availableSizes.map((item, index) => (
                  <option key={index} value={item.size} className="text-gray-900 bg-white">
                    {item.size} ({item.unit} | loss: {item.loss})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                Quantity / Length <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0.01"
                step="any"
                placeholder="Qty / MTR"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                Remark / Location
              </label>
              <input
                type="text"
                placeholder="e.g. Near pump / Main line"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
              />
            </div>

            <div>
              <button
                type="button"
                onClick={addItem}
                className="w-full inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-semibold rounded-lg px-4 py-2.5 text-sm shadow-sm transition"
              >
                <Plus size={18} />
                Add Item
              </button>
            </div>
          </div>
        </div>

        {/* Pipeline Components Table */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
          <div className="p-4 md:p-5 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
            <div>
              <h2 className="text-base md:text-lg font-bold text-gray-900">
                Survey Component List
              </h2>
              <p className="text-xs text-gray-500">
                {rows.length} {rows.length === 1 ? "component" : "components"} added
              </p>
            </div>
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
                  <th className="p-3.5 text-center">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-gray-500">
                      <p className="font-medium">No pipeline components added yet</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Select a component from above and click &quot;Add Item&quot; to build the pipeline report
                      </p>
                    </td>
                  </tr>
                ) : (
                  rows.map((row, index) => (
                    <tr
                      key={index}
                      className="hover:bg-green-50/40 transition"
                    >
                      <td className="p-3.5 text-gray-500 font-mono text-xs">
                        {index + 1}
                      </td>
                      <td className="p-3.5 font-semibold text-gray-900">
                        {row.description}
                      </td>
                      <td className="p-3.5 text-gray-700">
                        <span className="inline-block px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-800 font-medium">
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
                      <td className="p-3.5 text-center">
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          title="Remove item"
                          className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 hover:bg-red-50 p-1.5 rounded-md transition"
                        >
                          <Trash2 size={16} />
                          <span className="text-xs font-medium">Remove</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Engineering Calculations Summary & Save Action */}
        <div className="bg-gradient-to-br from-green-50 via-white to-emerald-50 border border-green-200 shadow-sm rounded-xl p-5 md:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-green-800 font-bold text-sm uppercase tracking-wide">
                <Calculator size={18} />
                Hydraulic Head Calculation Summary
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                <div className="bg-white border border-gray-200 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Static Head</p>
                  <p className="text-base font-bold text-gray-900">
                    {staticHeadNum.toFixed(2)} m
                  </p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Total Friction Loss</p>
                  <p className="text-base font-bold text-green-700">
                    {frictionLoss.toFixed(3)} m
                  </p>
                </div>
                <div className="bg-green-600 text-white rounded-lg p-3 col-span-2 sm:col-span-1 shadow-sm">
                  <p className="text-xs text-green-100">Total Pump Head</p>
                  <p className="text-xl font-extrabold text-white">
                    {totalHead.toFixed(3)} m
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="px-5 py-3 border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 font-medium rounded-lg text-sm transition"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={submitting}
                onClick={handleSubmit}
                className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-bold px-8 py-3 rounded-lg shadow-md hover:shadow-lg transition disabled:opacity-50"
              >
                <CheckCircle2 size={18} />
                {submitting
                  ? "Saving..."
                  : isEditing
                  ? "Update Survey Report"
                  : "Save Survey Report"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
