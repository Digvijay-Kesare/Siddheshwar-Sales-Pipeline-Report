"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import items from "@/data/items.json";

export default function NewSurveyPage() {
  const router = useRouter();

  const [surveyNo, setSurveyNo] = useState(1);
  const [customer, setCustomer] = useState("");
  const [village, setVillage] = useState("");
  const [discharge, setDischarge] = useState("");
  const [staticHeight, setStaticHeight] = useState("");

  const [selectedDesc, setSelectedDesc] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [qty, setQty] = useState("");
  const [remark, setRemark] = useState("");

  const [rows, setRows] = useState<any[]>([]);

  // 🔹 Calculate total head
  const totalHead = rows.reduce((sum, r) => sum + Number(r.floss), 0);

  function addItem() {
    if (!selectedDesc || !selectedSize || !qty) {
      alert("Please select description, size and qty");
      return;
    }

    const selectedItem = items.find(
      (i) => i.description === selectedDesc && i.size === selectedSize,
    );

    if (!selectedItem) return;

    const newRow = {
      description: selectedDesc,
      size: selectedSize,
      qty: Number(qty),
      unit: selectedItem.unit,
      floss: Number(qty) * selectedItem.loss,
      remark,
    };

    setRows([...rows, newRow]);

    setQty("");
    setRemark("");
  }

 async function handleSubmit() {

  try {

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Login required");
      router.push("/login");
      return;
    }

    if (!customer || !village) {
      alert("Customer and Village required");
      return;
    }

    if (rows.length === 0) {
      alert("Add at least one item");
      return;
    }

    const surveyData = {
      surveyNo,
      customer,
      village,
      discharge,
      staticHeight,
      rows,
      totalHead
    };

    console.log("Sending survey:", surveyData);

    const res = await fetch("/api/createSurvey", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(surveyData)
    });

    const data = await res.json();

    console.log("API response:", data);

    if (res.ok) {

      alert("Survey saved successfully");

      router.push("/dashboard");

    } else {

      alert(data.message || "Save failed");

    }

  } catch (error) {

    console.error("Save error:", error);
    alert("Something went wrong");

  }

}

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Survey</h1>

      {/* Survey Details */}

      <div className="grid grid-cols-2 gap-4 mb-6">
        <input
          type="text"
          placeholder="Customer"
          value={customer}
          onChange={(e) => setCustomer(e.target.value)}
          className="border p-2"
        />

        <input
          type="text"
          placeholder="Village"
          value={village}
          onChange={(e) => setVillage(e.target.value)}
          className="border p-2"
        />

        <input
          type="number"
          placeholder="Discharge"
          value={discharge}
          onChange={(e) => setDischarge(e.target.value)}
          className="border p-2"
        />

        <input
          type="number"
          placeholder="Static Height"
          value={staticHeight}
          onChange={(e) => setStaticHeight(e.target.value)}
          className="border p-2"
        />
      </div>

      {/* Item Add Section */}

      <div className="flex gap-3 mb-4">
        <select
          value={selectedDesc}
          onChange={(e) => {
            setSelectedDesc(e.target.value);
            setSelectedSize("");
          }}
          className="border p-2"
        >
          <option value="">Description</option>

          {[...new Set(items.map((i) => i.description))].map((desc) => (
            <option key={desc}>{desc}</option>
          ))}
        </select>

        <select
          value={selectedSize}
          onChange={(e) => setSelectedSize(e.target.value)}
          className="border p-2"
        >
          <option value="">Size</option>

          {items
            .filter((i) => i.description === selectedDesc)
            .map((item, idx) => (
              <option key={idx}>{item.size}</option>
            ))}
        </select>

        <input
          type="number"
          placeholder="Qty"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
          className="border p-2"
        />

        <input
          type="text"
          placeholder="Remark"
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
          className="border p-2"
        />

        <button onClick={addItem} className="bg-green-600 text-white px-4">
          Add
        </button>
      </div>

      {/* Items Table */}

      <table className="w-full border mb-6">
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
          {rows.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center p-4">
                No items added
              </td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <tr key={index} className="text-center">
                <td className="border p-2">{row.description}</td>
                <td className="border p-2">{row.size}</td>
                <td className="border p-2">{row.qty}</td>
                <td className="border p-2">{row.unit}</td>
                <td className="border p-2">{row.floss.toFixed(3)}</td>
                <td className="border p-2">{row.remark}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Total Head */}

      <div className="mb-4 font-semibold">
        Total Head: {totalHead.toFixed(3)}
      </div>

      <button
        onClick={() => {
          console.log("Save clicked");
          handleSubmit();
        }}
        className="bg-blue-600 text-white px-6 py-2 rounded"
      >
        Save Survey
      </button>
    </div>
  );
}
