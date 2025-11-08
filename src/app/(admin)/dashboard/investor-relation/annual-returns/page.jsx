"use client";
import { useEffect, useState } from "react";
import pb from "@/app/(admin)/_lib/pb";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

const AnnualReport = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);

  const [fade, setFade] = useState(false);
  const [newFile, setNewFile] = useState(null);

  const [formValues, setFormValues] = useState({
    sno: "",
    title: "",
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

  // Fetch annual reports
  const fetchData = async () => {
    const records = await pb.collection("annual_returns").getFullList(
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

  const openEdit = (row) => {
    if (row) {
      setEditingRow(row);
      setFormValues({
        sno: row.sno || "",
        title: row.title || "",
      });
      setNewFile(null);
    } else {
      setEditingRow(null);
      setFormValues({
        sno: "",
        title: "",
      });
      setNewFile(null);
    }
    setOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setNewFile(file);
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("sno", formValues.sno);
      formData.append("title", formValues.title);
      if (newFile) {
        formData.append("file", newFile);
      }

      let record;
      if (editingRow) {
        record = await pb
          .collection("annual_returns")
          .update(editingRow.id, formData);
        setData((prev) =>
          prev.map((item) => (item.id === editingRow.id ? record : item))
        );
      } else {
        record = await pb.collection("annual_returns").create(formData);
        setData((prev) => [...prev, record]);
      }

      setOpen(false);
      setEditingRow(null);
      setNewFile(null);
    } catch (err) {
      console.error(err);
      alert("Error saving: " + err.message);
    }
  };

  const handleDelete = async (row) => {
    const confirmDelete = confirm("Delete this record?");
    if (!confirmDelete) return;
    try {
      await pb.collection("annual_returns").delete(row.id);
      setData((prev) => prev.filter((item) => item.id !== row.id));
    } catch (err) {
      console.error(err);
      alert("Error deleting: " + err.message);
    }
  };

  const handleDeleteFile = async () => {
    if (!editingRow || !editingRow.file) return;
    const confirmDelete = confirm("Delete attached file?");
    if (!confirmDelete) return;
    try {
      const updated = await pb
        .collection("annual_returns")
        .update(editingRow.id, { file: "" });
      setEditingRow(updated);
      setData((prev) =>
        prev.map((item) => (item.id === editingRow.id ? updated : item))
      );
    } catch (err) {
      console.error(err);
      alert("Error deleting file: " + err.message);
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
        <span className="text-black">Annual Report</span>
      </div>

      {/* Table */}
      <div className="p-4 mt-14 w-full">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold text-lg">Annual Report</h2>
          <button
            onClick={() => openEdit(null)}
            className="px-3 py-1 bg-gray-700 text-white hover:bg-gray-800 rounded"
          >
            + Add
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
                  data.map((item, i) => (
                    <tr
                      key={item.id}
                      className="border-t bg-gray-50 hover:bg-gray-100 cursor-pointer"
                      onClick={() => openEdit(item)}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        handleDelete(item);
                      }}
                    >
                      <td className="px-3 py-2">{i + 1}</td>
                      <td className="px-3 py-2 font-medium">{item.title}</td>
                      <td className="px-3 py-2">
                        {item.file ? (
                          <a
                            href={pb.files.getURL(item, item.file)}
                            target="_blank"
                            className="text-blue-600 underline"
                          >
                            View PDF
                          </a>
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
                {editingRow ? "Edit Annual Report" : "Add Annual Report"}
              </h3>

              {/* S.No */}
              <div className="mb-3">
                <label className="block mb-1 text-sm font-medium">S.No</label>
                <input
                  type="text"
                  name="sno"
                  value={formValues.sno}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>

              {/* Title */}
              <div className="mb-3">
                <label className="block mb-1 text-sm font-medium">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formValues.title}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>

              {/* File */}
              <div className="mb-3">
                <label className="block mb-1 text-sm font-medium">File</label>
                {editingRow?.file && !newFile && (
                  <div className="flex items-center justify-between mb-2 bg-gray-100 p-2 rounded">
                    <a
                      href={pb.files.getURL(editingRow, editingRow.file)}
                      target="_blank"
                      className="text-blue-600 underline"
                    >
                      View current PDF
                    </a>
                    <button
                      onClick={handleDeleteFile}
                      className="px-2 py-1 text-xs bg-red-600 text-white rounded"
                    >
                      Delete
                    </button>
                  </div>
                )}

                {newFile && (
                  <p className="text-sm text-gray-600 mb-2">
                    New file selected: {newFile.name}
                  </p>
                )}

                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="w-full border px-2 py-1 rounded"
                />
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

export default AnnualReport;
