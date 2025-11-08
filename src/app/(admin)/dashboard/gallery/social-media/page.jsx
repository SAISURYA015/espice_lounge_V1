"use client";
import { useEffect, useState } from "react";
import pb from "@/app/(admin)/_lib/pb";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

const SocialMediaLinks = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);

  const [fade, setFade] = useState(false);

  // Form state
  const [newLinks, setNewLinks] = useState({});
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

  // Trigger fade when modal opens
  useEffect(() => {
    setFade(open);
  }, [open]);

  // Fetch social media records
  const fetchData = async () => {
    const records = await pb.collection("brands").getFullList(
      {
        sort: "sno",
      },
      { requestKey: null }
    );
    setData(records);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e, field) => {
    const val = e.target.value;
    setNewLinks((prev) => ({ ...prev, [field]: val }));
  };

  const openEdit = (row) => {
    setEditingRow(row);
    setNewLinks({});
    setOpen(true);
  };

  const handleSave = async () => {
    if (!editingRow) return;
    try {
      const updateData = {};
      for (const field of ["facebook", "youtube", "google", "instagram"]) {
        if (newLinks[field] !== undefined) updateData[field] = newLinks[field];
      }

      const record = await pb
        .collection("brands")
        .update(editingRow.id, updateData);

      setData((prev) =>
        prev.map((item) => (item.id === editingRow.id ? record : item))
      );

      setOpen(false);
      setEditingRow(null);
      setNewLinks({});
    } catch (err) {
      console.error(err);
      alert("Error saving: " + err.message);
    }
  };

  const handleDeleteField = async (field) => {
    if (!editingRow || !editingRow[field]) return;

    const confirmDelete = confirm(`Delete ${field}?`);
    if (!confirmDelete) return;

    try {
      const updated = await pb.collection("brands").update(editingRow.id, {
        [field]: "",
      });

      setEditingRow(updated);
      setData((prev) =>
        prev.map((item) => (item.id === editingRow.id ? updated : item))
      );
    } catch (err) {
      console.error(err);
      alert("Error deleting link: " + err.message);
    }
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
        <span className="text-black">Social Media</span>
      </div>

      {/* Table */}
      <div className="p-4 mt-14 w-full">
        <h2 className="font-semibold text-lg mb-3">Social Media Links</h2>

        <div className="overflow-x-auto border border-gray-300">
          <div className="max-h-[75vh] overflow-y-auto no-scrollbar">
            <table className="w-full min-w-[900px] text-sm">
              <thead className="sticky top-0 bg-gray-200">
                <tr>
                  <th className="px-3 py-2">S.No</th>
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Facebook</th>
                  <th className="px-3 py-2">YouTube</th>
                  <th className="px-3 py-2">Google</th>
                  <th className="px-3 py-2">Instagram</th>
                  <th className="px-3 py-2">Created</th>
                  <th className="px-3 py-2">Updated</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {data.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-4 text-gray-600">
                      No Records
                    </td>
                  </tr>
                ) : (
                  data.map((item, i) => (
                    <tr
                      key={item.id}
                      className="border-t bg-gray-50 hover:bg-gray-100 cursor-pointer"
                      onClick={() => openEdit(item)}
                    >
                      <td className="px-3 py-2">{i + 1}</td>
                      <td className="px-3 py-2 font-medium">{item.name}</td>
                      {["facebook", "youtube", "google", "instagram"].map(
                        (field) => (
                          <td key={field} className="px-3 py-2 text-blue-600">
                            {item[field] ? (
                              <a
                                href={item[field]}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="hover:underline"
                              >
                                {item[field]}
                              </a>
                            ) : (
                              "N/A"
                            )}
                          </td>
                        )
                      )}
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

      {/* Modal for Edit */}
      {open && editingRow && (
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
                Edit Social Media - {editingRow.name}
              </h3>

              {/* Social Media Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["facebook", "youtube", "google", "instagram"].map((field) => (
                  <div key={field} className="border p-3 rounded bg-white">
                    <label className="block mb-2 text-sm font-medium">
                      {field}
                    </label>

                    {editingRow[field] && (
                      <div className="relative mb-2">
                        <input
                          type="text"
                          value={editingRow[field]}
                          readOnly
                          className="w-full border px-3 py-2 rounded bg-gray-100 text-gray-700 cursor-not-allowed"
                        />
                        <button
                          onClick={() => handleDeleteField(field)}
                          type="button"
                          className="absolute top-0 right-0 bg-red-600 text-white p-1 rounded-bl"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )}

                    {newLinks[field] && (
                      <div className="mb-2">
                        <label className="text-xs text-gray-500">
                          Updated Link:
                        </label>
                        <input
                          type="text"
                          value={newLinks[field]}
                          readOnly
                          className="w-full border px-2 py-1 rounded bg-gray-100"
                        />
                      </div>
                    )}

                    <input
                      type="text"
                      placeholder={`Enter ${field} URL`}
                      onChange={(e) => handleInputChange(e, field)}
                      className="w-full border px-2 py-1 rounded"
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 mt-4">
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

export default SocialMediaLinks;
