"use client";

import { useEffect, useState } from "react";
import items from "@/data/items.json";

export default function SurveyForm({
  initialData = {},
  onSubmit,
}: any) {
  const [customer, setCustomer] = useState("");
  const [village, setVillage] = useState("");
  const [discharge, setDischarge] = useState("");
  const [staticHeight, setStaticHeight] = useState("");

  const [selectedDesc, setSelectedDesc] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [qty, setQty] = useState("");
  const [remark, setRemark] = useState("");

  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    if (initialData) {
      setCustomer(initialData.customer || "");
      setVillage(initialData.village || "");
      setDischarge(initialData.discharge || "");
      setStaticHeight(initialData.staticheight || "");
      setRows(initialData.rows || []);
    }
  }, [initialData]);

  const totalHead = rows.reduce(
    (sum: number, row: any) => sum + Number(row.floss),
    0
  );

  function addItem() {
    if (!selectedDesc || !selectedSize || !qty) {
      alert("Select description, size and quantity");
      return;
    }

    const selectedItem = items.find(
      (item) =>
        item.description === selectedDesc &&
        item.size === selectedSize
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

    setSelectedDesc("");
    setSelectedSize("");
    setQty("");
    setRemark("");
  }

  function removeItem(index: number) {
    setRows(rows.filter((_, i) => i !== index));
  }

  async function handleSubmit() {
    await onSubmit({
      ...initialData,
      customer,
      village,
      discharge,
      staticHeight,
      rows,
      totalHead,
    });
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          {initialData?.surveyno
            ? "Edit Pipeline Survey"
            : "Create Pipeline Survey"}
        </h1>

        {/* Survey Details */}
        <div className="bg-white shadow rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">
            Survey Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Customer"
              value={customer}
              onChange={(e) =>
                setCustomer(e.target.value)
              }
              className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
            />

            <input
              type="text"
              placeholder="Village"
              value={village}
              onChange={(e) =>
                setVillage(e.target.value)
              }
              className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
            />

            <input
              type="number"
              placeholder="Discharge"
              value={discharge}
              onChange={(e) =>
                setDischarge(e.target.value)
              }
              className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
            />

            <input
              type="number"
              placeholder="Static Height"
              value={staticHeight}
              onChange={(e) =>
                setStaticHeight(e.target.value)
              }
              className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>
        </div>

        {/* Add Item */}
        <div className="bg-white shadow rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">
            Add Pipeline Components
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <select
              value={selectedDesc}
              onChange={(e) => {
                setSelectedDesc(e.target.value);
                setSelectedSize("");
              }}
              className="border rounded-lg p-3"
            >
              <option value="">
                Description
              </option>

              {[
                ...new Set(
                  items.map(
                    (item) =>
                      item.description
                  )
                ),
              ].map((desc) => (
                <option key={desc}>
                  {desc}
                </option>
              ))}
            </select>

            <select
              value={selectedSize}
              onChange={(e) =>
                setSelectedSize(
                  e.target.value
                )
              }
              className="border rounded-lg p-3"
            >
              <option value="">
                Size
              </option>

              {items
                .filter(
                  (item) =>
                    item.description ===
                    selectedDesc
                )
                .map((item, index) => (
                  <option key={index}>
                    {item.size}
                  </option>
                ))}
            </select>

            <input
              type="number"
              placeholder="Qty"
              value={qty}
              onChange={(e) =>
                setQty(e.target.value)
              }
              className="border rounded-lg p-3"
            />

            <input
              type="text"
              placeholder="Remark"
              value={remark}
              onChange={(e) =>
                setRemark(
                  e.target.value
                )
              }
              className="border rounded-lg p-3"
            />

            <button
              onClick={addItem}
              className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-4"
            >
              Add
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white shadow rounded-xl overflow-x-auto mb-6">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">
                  Description
                </th>
                <th className="p-3 text-left">
                  Size
                </th>
                <th className="p-3 text-left">
                  Qty
                </th>
                <th className="p-3 text-left">
                  Unit
                </th>
                <th className="p-3 text-left">
                  F.Loss
                </th>
                <th className="p-3 text-left">
                  Remark
                </th>
                <th className="p-3 text-left">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center p-6 text-gray-500"
                  >
                    No items added
                  </td>
                </tr>
              ) : (
                rows.map(
                  (
                    row,
                    index
                  ) => (
                    <tr
                      key={index}
                      className="border-t"
                    >
                      <td className="p-3">
                        {
                          row.description
                        }
                      </td>
                      <td className="p-3">
                        {row.size}
                      </td>
                      <td className="p-3">
                        {row.qty}
                      </td>
                      <td className="p-3">
                        {row.unit}
                      </td>
                      <td className="p-3">
                        {row.floss.toFixed(
                          3
                        )}
                      </td>
                      <td className="p-3">
                        {row.remark}
                      </td>

                      <td className="p-3">
                        <button
                          onClick={() =>
                            removeItem(
                              index
                            )
                          }
                          className="text-red-600 hover:underline"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        </div>

        {/* Total + Submit */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-lg font-semibold">
            Total Head:{" "}
            {totalHead.toFixed(3)}
          </div>

          <button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg shadow"
          >
            {initialData?.surveyno
              ? "Update Survey"
              : "Save Survey"}
          </button>
        </div>
      </div>
    </div>
  );
}