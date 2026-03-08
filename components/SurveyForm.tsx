"use client";

import { useState } from "react";
import items from "@/data/items.json";

export default function SurveyForm({ initialData = {}, onSubmit }: any) {

  const [customer, setCustomer] = useState(initialData.customer || "");
  const [village, setVillage] = useState(initialData.village || "");
  const [discharge, setDischarge] = useState(initialData.discharge || "");
  const [staticHeight, setStaticHeight] = useState(initialData.staticHeight || "");

  const [selectedDesc, setSelectedDesc] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [qty, setQty] = useState("");
  const [remark, setRemark] = useState("");

  const [rows, setRows] = useState(initialData.rows || []);

  const totalHead = rows.reduce((sum: number, r: any) => sum + r.floss, 0);

  function addItem() {

    const selectedItem = items.find(
      (i) =>
        i.description === selectedDesc &&
        i.size === selectedSize
    );

    if (!selectedItem) return;

    const newRow = {
      description: selectedDesc,
      size: selectedSize,
      qty: Number(qty),
      unit: selectedItem.unit,
      floss: Number(qty) * selectedItem.loss,
      remark
    };

    setRows([...rows, newRow]);

    setQty("");
    setRemark("");
  }

  function deleteRow(index: number) {

    const updated = rows.filter((_: any, i: number) => i !== index);
    setRows(updated);

  }

  async function handleSubmit() {

    if (!onSubmit) {
      console.error("onSubmit not passed to SurveyForm");
      return;
    }

    await onSubmit({
      ...initialData,
      customer,
      village,
      discharge,
      staticHeight,
      rows,
      totalHead
    });

  }

  return (

    <div className="p-6">

      {/* Header Fields */}

      <div className="grid grid-cols-2 gap-4 mb-6">

        <input
          className="border p-2"
          placeholder="Customer"
          value={customer}
          onChange={(e) => setCustomer(e.target.value)}
        />

        <input
          className="border p-2"
          placeholder="Village"
          value={village}
          onChange={(e) => setVillage(e.target.value)}
        />

        <input
          className="border p-2"
          placeholder="Discharge"
          value={discharge}
          onChange={(e) => setDischarge(e.target.value)}
        />

        <input
          className="border p-2"
          placeholder="Static Height"
          value={staticHeight}
          onChange={(e) => setStaticHeight(e.target.value)}
        />

      </div>

      {/* Item Input Row */}

      <div className="flex flex-wrap gap-3 mb-4">

        {/* Description Dropdown */}

        <select
          className="border p-2"
          value={selectedDesc}
          onChange={(e) => {
            setSelectedDesc(e.target.value);
            setSelectedSize("");
          }}
        >
          <option value="">Description</option>

          {[...new Set(items.map((i) => i.description))].map((desc) => (
            <option key={desc}>{desc}</option>
          ))}
        </select>

        {/* Size Dropdown */}

        <select
          className="border p-2"
          value={selectedSize}
          onChange={(e) => setSelectedSize(e.target.value)}
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
          className="border p-2"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
        />

        <input
          placeholder="Remark"
          className="border p-2"
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
        />

        <button
          onClick={addItem}
          className="bg-green-600 text-white px-4 rounded"
        >
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
            <th className="border p-2">Action</th>
          </tr>

        </thead>

        <tbody>

          {rows.length === 0 ? (

            <tr>
              <td colSpan={7} className="text-center p-3 border">
                No items added
              </td>
            </tr>

          ) : (

            rows.map((row: any, index: number) => (

              <tr key={index} className="text-center">

                <td className="border p-2">{row.description}</td>
                <td className="border p-2">{row.size}</td>
                <td className="border p-2">{row.qty}</td>
                <td className="border p-2">{row.unit}</td>
                <td className="border p-2">{row.floss.toFixed(3)}</td>
                <td className="border p-2">{row.remark}</td>

                <td className="border p-2">

                  <button
                    onClick={() => deleteRow(index)}
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

      {/* Total Head */}

      <div className="font-semibold mb-4">
        Total Head: {totalHead.toFixed(3)}
      </div>

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-6 py-2 rounded"
      >
        Save Survey
      </button>

    </div>

  );

}