"use client";
import { useEffect, useState } from "react";
import pb from "@/app/(admin)/_lib/pb";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

const Others = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [fade, setFade] = useState(false);

  // Form state
  const [form, setForm] = useState({
    sno: "",
    title: "",
    page: "others",
  });
  const [newFile, setNewFile] = useState(null);
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

  // Fetch records (only policies)
  const fetchData = async () => {
    const records = await pb
      .collection("meetings_policies_stock_exchange_open_offer")
      .getFullList(
        {
          sort: "sno",
          filter: 'page = "others"',
        },
        { requestKey: null }
      );
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
      page: "others",
    });
    setNewFile(null);
    setOpen(true);
  };

  const openAdd = () => {
    setEditingRow(null);
    setForm({
      sno: "",
      title: "",
      page: "others",
    });
    setNewFile(null);
    setOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setNewFile(file);
  };

  const handleSave = async () => {
    try {
      const updateData = {
        sno: form.sno,
        title: form.title,
        page: "others",
      };
      if (newFile) {
        updateData.file = newFile;
      }

      if (editingRow) {
        await pb
          .collection("meetings_policies_stock_exchange_open_offer")
          .update(editingRow.id, updateData);
      } else {
        await pb
          .collection("meetings_policies_stock_exchange_open_offer")
          .create(updateData);
      }

      fetchData();
      setOpen(false);
      setEditingRow(null);
      setForm({ sno: "", title: "", page: "others" });
      setNewFile(null);
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
      await pb
        .collection("meetings_policies_stock_exchange_open_offer")
        .delete(editingRow.id);
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
        <span className="text-black">Others</span>
      </div>

      {/* Table */}
      <div className="p-4 mt-14 w-full">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold text-lg">Others</h2>
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
                  <th className="px-3 py-2">File</th>
                  <th className="px-3 py-2">Page</th>
                  <th className="px-3 py-2">Created</th>
                  <th className="px-3 py-2">Updated</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {data.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-4 text-gray-600">
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
                        {item.file ? (
                          <a
                            href={pb.files.getURL(item, item.file)}
                            target="_blank"
                            className="text-blue-600 underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            View PDF
                          </a>
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td className="px-3 py-2">{item.page}</td>
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
                {editingRow ? "Edit" : "Add"} Others
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

              <label className="block mb-2 text-sm font-medium">
                File (PDF)
              </label>
              <div className="border p-3 rounded bg-white">
                {editingRow && editingRow.file && !newFile && (
                  <div className="mb-2">
                    <a
                      href={pb.files.getURL(editingRow, editingRow.file)}
                      target="_blank"
                      className="text-blue-600 underline"
                    >
                      View Current PDF
                    </a>
                  </div>
                )}

                {newFile && (
                  <div className="text-xs text-gray-500 mb-2">
                    Selected: {newFile.name}
                  </div>
                )}

                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="w-full border px-2 py-1 rounded"
                />
              </div>

              <label className="block mt-4 text-sm font-medium">Page</label>
              <input
                type="text"
                value="others"
                readOnly
                className="w-full border px-3 py-2 rounded bg-gray-100"
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

export default Others;
