"use client";
import { useEffect, useState } from "react";
import pb from "@/app/(admin)/_lib/pb";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

const DisclosureR30 = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [fade, setFade] = useState(false);

  // Form state
  const [form, setForm] = useState({
    sno: "",
    title: "",
  });
  const [existingFiles, setExistingFiles] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
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
      .collection("disclosure_r30")
      .getFullList({ sort: "sno" }, { requestKey: null });
    setData(records);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openEdit = (row) => {
    setEditingRow(row);
    setForm({
      sno: row.sno || "",
      title: row.title || "",
    });
    setExistingFiles(row.files || []);
    setNewFiles([]);
    setOpen(true);
  };

  const openAdd = () => {
    setEditingRow(null);
    setForm({
      sno: "",
      title: "",
    });
    setExistingFiles([]);
    setNewFiles([]);
    setOpen(true);
  };

  const handleSave = async () => {
    try {
      const updateData = {
        sno: form.sno,
        title: form.title,
      };

      // keep existing files + add new ones
      if (existingFiles.length > 0) {
        updateData.files = existingFiles;
      }
      if (newFiles.length > 0) {
        updateData.files = [...(updateData.files || []), ...newFiles];
      }

      if (editingRow) {
        await pb.collection("disclosure_r30").update(editingRow.id, updateData);
      } else {
        await pb.collection("disclosure_r30").create(updateData);
      }

      fetchData();
      setOpen(false);
      setEditingRow(null);
      setForm({ sno: "", title: "" });
      setExistingFiles([]);
      setNewFiles([]);
    } catch (err) {
      console.error(err);
      alert("Error saving: " + err.message);
    }
  };

  const handleDelete = async () => {
    if (!editingRow) return;
    const confirmDelete = confirm("Delete this record?");
    if (!confirmDelete) return;

    try {
      await pb.collection("disclosure_r30").delete(editingRow.id);
      setData((prev) => prev.filter((item) => item.id !== editingRow.id));
      setOpen(false);
      setEditingRow(null);
    } catch (err) {
      console.error(err);
      alert("Error deleting: " + err.message);
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
        <span className="text-black">Disclosure Reg-30(5)</span>
      </div>

      {/* Table */}
      <div className="p-4 mt-14 w-full">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold text-lg">Disclosure Reg-30(5)</h2>
          <button
            onClick={openAdd}
            className="px-3 py-1 bg-gray-700 text-white hover:bg-gray-800 rounded"
          >
            + Add New
          </button>
        </div>

        <div className="overflow-x-auto border border-gray-300">
          <div className="max-h-[75vh] overflow-y-auto no-scrollbar">
            <table className="w-full min-w-[800px] text-sm">
              <thead className="sticky top-0 bg-gray-200">
                <tr>
                  <th className="px-3 py-2">S.No</th>
                  <th className="px-3 py-2">Title</th>
                  <th className="px-3 py-2">Files</th>
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
                      <td className="px-3 py-2">{item.sno}</td>
                      <td className="px-3 py-2 font-medium">{item.title}</td>
                      <td className="px-3 py-2">
                        {item.files && item.files.length > 0 ? (
                          <div className="flex flex-col gap-1 items-center">
                            {item.files.map((file, idx) => (
                              <a
                                key={idx}
                                href={pb.files.getURL(item, file)}
                                target="_blank"
                                className="text-blue-600 underline"
                                onClick={(e) => e.stopPropagation()}
                              >
                                File {idx + 1}
                              </a>
                            ))}
                          </div>
                        ) : (
                          "N/A"
                        )}
                      </td>
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
              className={`bg-gray-50 rounded p-6 w-[600px] max-h-[70dvh] overflow-y-auto no-scrollbar shadow transform transition-transform duration-100 ${
                fade ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-4">
                {editingRow ? "Edit" : "Add"} Disclosure Reg-30(5)
              </h3>

              {/* Form Fields */}
              <label className="block mb-2 text-sm font-medium">S.No</label>
              <input
                type="number"
                value={form.sno}
                onChange={(e) => setForm({ ...form, sno: e.target.value })}
                className="w-full border px-3 py-2 rounded mb-4"
              />

              <label className="block mb-2 text-sm font-medium">Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full border px-3 py-2 rounded mb-4"
              />

              {/* Files */}
              <label className="block mb-2 text-sm font-medium">
                Files (PDFs)
              </label>
              <div className="space-y-2">
                {/* Existing files */}
                {existingFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center border px-3 py-2 rounded bg-white"
                  >
                    <a
                      href={
                        editingRow ? pb.files.getURL(editingRow, file) : "#"
                      }
                      target="_blank"
                      className="text-blue-600 underline truncate"
                    >
                      {file}
                    </a>
                    <button
                      type="button"
                      onClick={() =>
                        setExistingFiles(
                          existingFiles.filter((_, i) => i !== idx)
                        )
                      }
                      className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      <X />
                    </button>
                  </div>
                ))}

                {/* New files */}
                {newFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center border px-3 py-2 rounded bg-gray-50"
                  >
                    <span className="truncate">{file.name}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setNewFiles(newFiles.filter((_, i) => i !== idx))
                      }
                      className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      <X />
                    </button>
                  </div>
                ))}

                {/* Add new files */}
                <div>
                  <input
                    type="file"
                    accept="application/pdf"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      setNewFiles([...newFiles, ...files]);
                    }}
                    className="hidden"
                    id="fileInput"
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById("fileInput").click()}
                    className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-800 mt-2"
                  >
                    + Add File
                  </button>
                </div>
              </div>

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

export default DisclosureR30;
