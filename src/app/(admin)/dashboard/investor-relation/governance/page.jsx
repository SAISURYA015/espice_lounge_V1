"use client";
import { useEffect, useState } from "react";
import pb from "@/app/(admin)/_lib/pb";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

const CorporateGovernance = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [fade, setFade] = useState(false);

  // Form state
  const [form, setForm] = useState({
    description1: "",
    principles: [],
    description2: "",
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Handle authentication
  useEffect(() => {
    if (!pb.authStore.isValid) {
      router.replace("/login");
    } else {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    setFade(open);
  }, [open]);

  // Fetch records
  const fetchData = async () => {
    const records = await pb
      .collection("corporate_governance")
      .getFullList({ requestKey: null });
    setData(records);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openEdit = (row) => {
    setEditingRow(row);
    setForm({
      description1: row.description1 || "",
      principles: Array.isArray(row.principles) ? row.principles : [],
      description2: row.description2 || "",
    });
    setOpen(true);
  };

  const openAdd = () => {
    setEditingRow(null);
    setForm({
      description1: "",
      principles: [],
      description2: "",
    });
    setOpen(true);
  };

  const handleSave = async () => {
    try {
      const updateData = {
        description1: form.description1,
        principles: form.principles,
        description2: form.description2,
      };

      if (editingRow) {
        await pb
          .collection("corporate_governance")
          .update(editingRow.id, updateData);
      } else {
        await pb.collection("corporate_governance").create(updateData);
      }

      fetchData();
      setOpen(false);
      setEditingRow(null);
      setForm({ description1: "", principles: [], description2: "" });
    } catch (err) {
      console.error(err);
      alert("Error saving: " + err.message);
    }
  };

  const handleDelete = async () => {
    if (!editingRow) return;
    if (!confirm("Delete this record?")) return;

    try {
      await pb.collection("corporate_governance").delete(editingRow.id);
      setData((prev) => prev.filter((item) => item.id !== editingRow.id));
      setOpen(false);
      setEditingRow(null);
    } catch (err) {
      console.error(err);
      alert("Error deleting: " + err.message);
    }
  };

  // Manage principles list
  const addPrinciple = () => {
    setForm((prev) => ({ ...prev, principles: [...prev.principles, ""] }));
  };

  const updatePrinciple = (index, value) => {
    const updated = [...form.principles];
    updated[index] = value;
    setForm((prev) => ({ ...prev, principles: updated }));
  };

  const removePrinciple = (index) => {
    setForm((prev) => ({
      ...prev,
      principles: prev.principles.filter((_, i) => i !== index),
    }));
  };

  const fmt = (val) => (val ? new Date(val).toLocaleString() : "-");
  if (loading) return <div>Loading...</div>;

  return (
    <>
      {/* Header */}
      <div className="fixed top-0 p-4 bg-gray-100 border-b w-full flex flex-wrap gap-2 z-10">
        <a href="/dashboard">
          <span className="text-gray-600 hover:text-black">Dashboard</span>
        </a>
        <span className="text-gray-600">/</span>
        <span className="text-black">Corporate Governance</span>
      </div>

      {/* Table */}
      <div className="p-4 mt-14 w-full">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold text-lg">Corporate Governance</h2>
          <button
            onClick={openAdd}
            className="px-3 py-1 bg-gray-700 text-white hover:bg-gray-800 rounded"
          >
            + Add New
          </button>
        </div>

        <div className="overflow-x-auto border border-gray-300">
          <div className="max-h-[75vh] overflow-y-auto no-scrollbar">
            <table className="w-full min-w-[900px] text-sm">
              <thead className="sticky top-0 bg-gray-200">
                <tr>
                  <th className="px-3 py-2">Description1</th>
                  <th className="px-3 py-2">Principles</th>
                  <th className="px-3 py-2">Description2</th>
                  <th className="px-3 py-2">Created</th>
                  <th className="px-3 py-2">Updated</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {data.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-gray-600">
                      No Records
                    </td>
                  </tr>
                ) : (
                  data.map((item) => (
                    <tr
                      key={item.id}
                      className="border-t bg-gray-50 hover:bg-gray-100 cursor-pointer"
                      onClick={() => openEdit(item)}
                    >
                      <td className="px-3 py-2">{item.description1}</td>
                      <td className="px-3 py-2">
                        {Array.isArray(item.principles) &&
                        item.principles.length > 0
                          ? item.principles.join(", ")
                          : "N/A"}
                      </td>
                      <td className="px-3 py-2">{item.description2}</td>
                      <td className="px-3 py-2 text-gray-500">
                        {fmt(item.created)}
                      </td>
                      <td className="px-3 py-2 text-gray-500">
                        {fmt(item.updated)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {open && (
        <div
          className={`fixed inset-0 flex items-center justify-center z-50 bg-black/40 transition-opacity duration-100 ${
            fade ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setOpen(false)}
        >
          <div className="relative">
            <div
              className={`bg-gray-50 rounded p-6 w-[700px] max-h-[70dvh] overflow-y-auto no-scrollbar shadow transform transition-transform duration-100 ${
                fade ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-4">
                {editingRow ? "Edit" : "Add"} Corporate Governance
              </h3>

              {/* Form Fields */}
              <label className="block mb-2 text-sm font-medium">
                Description1
              </label>
              <textarea
                value={form.description1}
                onChange={(e) =>
                  setForm({ ...form, description1: e.target.value })
                }
                className="w-full border px-3 py-2 rounded mb-4"
              />

              <label className="block mb-2 text-sm font-medium">
                Principles
              </label>
              <div className="space-y-2 mb-4">
                {form.principles.map((p, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      type="text"
                      value={p}
                      onChange={(e) => updatePrinciple(i, e.target.value)}
                      className="flex-1 border px-3 py-2 rounded"
                    />
                    <button
                      onClick={() => removePrinciple(i)}
                      className="px-3 py-1 bg-red-600 text-white hover:bg-red-700 rounded"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  onClick={addPrinciple}
                  className="px-3 py-1 bg-gray-700 text-white hover:bg-gray-800 rounded"
                >
                  + Add Principle
                </button>
              </div>

              <label className="block mb-2 text-sm font-medium">
                Description2
              </label>
              <textarea
                value={form.description2}
                onChange={(e) =>
                  setForm({ ...form, description2: e.target.value })
                }
                className="w-full border px-3 py-2 rounded mb-4"
              />

              <div className="flex justify-end gap-2 mt-4">
                {editingRow && (
                  <button
                    onClick={handleDelete}
                    className="px-3 py-1 bg-red-600 text-white hover:bg-red-700 rounded"
                  >
                    Delete
                  </button>
                )}
                <button
                  onClick={handleSave}
                  className="px-3 py-1 bg-gray-700 text-white hover:bg-gray-800 rounded"
                >
                  Save
                </button>
              </div>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="absolute top-0 right-0 p-1 rounded-bl-md bg-gray-700 text-white"
            >
              <X />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CorporateGovernance;
