"use client";
import { useEffect, useState } from "react";
import pb from "@/app/(admin)/_lib/pb";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

const Disclosures = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [fade, setFade] = useState(false);

  // Main disclosure form
  const [form, setForm] = useState({
    sno: "",
    title: "",
    type: "link",
    link: "",
    pdf: null,
    items: [], // sub-items
  });
  const [newFile, setNewFile] = useState(null);

  // Sub-item form
  const [newSubItem, setNewSubItem] = useState({
    title: "",
    type: "link",
    link: "",
    pdf: null,
  });

  const [subItems, setSubItems] = useState([]);

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

  // Fade effect
  useEffect(() => setFade(open), [open]);

  // Fetch all disclosures

  const fetchData = async () => {
    try {
      const records = await pb
        .collection("disclosures")
        .getFullList({ sort: "sno" });
      setData(records);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (form.items) setSubItems(form.items);
  }, [form.items]);

  // Open modal for edit
  const openEdit = (row) => {
    setEditingRow(row);
    setForm({
      sno: row.sno || "",
      title: row.title || "",
      type: row.type || "link",
      link: row.link || "",
      pdf: row.pdf || null,
      items: row.items || [],
    });
    setNewFile(null);
    setNewSubItem({ title: "", type: "link", link: "", pdf: null });
    setOpen(true);
  };

  // Open modal for add
  const openAdd = () => {
    setEditingRow(null);
    setForm({
      sno: "",
      title: "",
      type: "link",
      link: "",
      pdf: null,
      items: [],
    });
    setNewFile(null);
    setNewSubItem({ title: "", type: "link", link: "", pdf: null });
    setOpen(true);
  };

  // File change for main disclosure
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setNewFile(file);
  };

  // Save main disclosure
  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("sno", form.sno);
      formData.append("title", form.title);
      formData.append("type", form.type);

      // If type is link, append link
      if (form.type === "link") {
        formData.append("link", form.link);
      }

      // If type is PDF and new file exists, append it
      if (form.type === "pdf" && newFile) {
        formData.append("pdf", newFile);
      } else if (form.type === "pdf" && form.pdf) {
        // If editing and no new file, keep old pdf
        formData.append("pdf", form.pdf);
      }

      // Include sub-items as JSON string
      if (form.items && form.items.length > 0) {
        formData.append("items", JSON.stringify(form.items));
      }

      let record;
      if (editingRow) {
        record = await pb
          .collection("disclosures")
          .update(editingRow.id, formData);

        setData((prev) =>
          prev.map((item) => (item.id === editingRow.id ? record : item))
        );
      } else {
        record = await pb.collection("disclosures").create(formData);
        setData((prev) => [...prev, record]);
      }

      setOpen(false);
      setEditingRow(null);
      setForm({
        sno: "",
        title: "",
        type: "link",
        link: "",
        pdf: null,
        items: [],
      });
      setNewFile(null);
    } catch (err) {
      console.error(err);
      alert("Error saving: " + err.message);
    }
  };

  // Delete main disclosure
  const handleDelete = async () => {
    if (!editingRow) return;
    if (!confirm("Delete this disclosure?")) return;
    try {
      await pb.collection("disclosures").delete(editingRow.id);
      setData(data.filter((d) => d.id !== editingRow.id));
      setOpen(false);
      setEditingRow(null);
    } catch (err) {
      console.error(err);
      alert("Error deleting: " + err.message);
    }
  };

  // ---------- Sub-item handlers ----------
  const handleAddSubItem = async () => {
    if (!editingRow) {
      alert("Save main disclosure first!");
      return;
    }

    try {
      // Prepare the new sub-item
      const subItem = {
        title: newSubItem.title,
        type: newSubItem.type,
        link: newSubItem.type === "link" ? newSubItem.link : "",
        pdf: null,
      };

      // Create FormData if PDF exists
      const formData = new FormData();

      // Append existing sub-items plus the new one
      const updatedItems = [...(form.items || []), subItem];
      formData.append("items", JSON.stringify(updatedItems));

      // If sub-item has a PDF, append it
      if (newSubItem.type === "pdf" && newSubItem.pdf) {
        formData.append("pdf", newSubItem.pdf);
        // Update the pdf reference in sub-item
        subItem.pdf = newSubItem.pdf.name; // Optional: you can store file name or handle differently
      }

      // Update the main disclosure with new sub-items
      const updatedRecord = await pb
        .collection("disclosures")
        .update(editingRow.id, formData);

      // Update state
      setForm({ ...form, items: updatedItems });
      setSubItems(updatedItems);
      setNewSubItem({ title: "", type: "link", link: "", pdf: null });
    } catch (err) {
      console.error(err);
      alert("Error adding sub-item: " + err.message);
    }
  };

  const handleDeleteSubItem = async (index) => {
    const updatedItems = form.items.filter((_, i) => i !== index);
    try {
      await pb
        .collection("disclosures")
        .update(editingRow.id, { items: updatedItems });
      setForm({ ...form, items: updatedItems });
      setSubItems(updatedItems);
    } catch (err) {
      console.error(err);
      alert("Error deleting sub-item: " + err.message);
    }
  };

  const fmt = (val) => (val ? new Date(val).toLocaleString() : "-");

  if (loading) return <div>Loading...</div>;

  return (
    <>
      {/* Header */}
      <div className="fixed top-0 p-4 bg-gray-100 border-b w-full flex flex-wrap gap-2 z-10">
        <a href="/dashboard" className="text-gray-600 hover:text-black">
          Dashboard
        </a>
        <span className="text-gray-600">/</span>
        <span className="text-black">Disclosures 46</span>
      </div>

      {/* Table */}
      <div className="p-4 mt-14 w-full">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold text-lg">Disclosures 46</h2>
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
                  <th className="px-3 py-2">Type</th>
                  <th className="px-3 py-2">Link/PDF</th>
                  <th className="px-3 py-2">Sub-Items</th>
                  <th className="px-3 py-2">Created</th>
                  <th className="px-3 py-2">Updated</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {data.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-4 text-gray-600">
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
                      <td className="px-3 py-2">{item.type}</td>
                      <td className="px-3 py-2">
                        {item.type === "link" && item.link ? (
                          <a
                            href={item.link}
                            target="_blank"
                            className="text-blue-600 underline"
                          >
                            {item.link}
                          </a>
                        ) : item.type === "pdf" && item.pdf ? (
                          <a
                            href={pb.files.getURL(item, item.pdf)}
                            target="_blank"
                            className="text-blue-600 underline"
                          >
                            View PDF
                          </a>
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td className="px-3 py-2">
                        {item.items ? item.items.length : 0}
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
              className={`bg-gray-50 rounded p-6 w-[800px] max-h-[80dvh] overflow-y-auto no-scrollbar shadow transform transition-transform duration-100 ${
                fade ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-4">
                {editingRow ? "Edit" : "Add"} Disclosure
              </h3>

              {/* Main Disclosure Form */}
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

              <label className="block mb-2 text-sm font-medium">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full border px-3 py-2 rounded mb-4"
              >
                <option value="link">Link</option>
                <option value="pdf">PDF</option>
                <option value="na">N/A</option>
              </select>

              {form.type === "link" && (
                <input
                  type="text"
                  value={form.link}
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
                  placeholder="Link"
                  className="w-full border px-3 py-2 rounded mb-4"
                />
              )}

              {form.type === "pdf" && (
                <div className="border p-3 rounded bg-white mb-4">
                  {editingRow && editingRow.pdf && !newFile && (
                    <div className="mb-2">
                      <a
                        href={pb.files.getURL(editingRow, editingRow.pdf)}
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
              )}

              {/* Sub-Items */}
              {editingRow && (
                <div className="mt-6">
                  <h4 className="font-semibold mb-2">Sub-Items</h4>
                  <table className="w-full text-sm border">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="px-2 py-1">Title</th>
                        <th className="px-2 py-1">Type</th>
                        <th className="px-2 py-1">Link/PDF</th>
                        <th className="px-2 py-1">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subItems.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="text-gray-500 py-2">
                            No sub-items
                          </td>
                        </tr>
                      ) : (
                        subItems.map((si, i) => (
                          <tr key={i} className="border-t">
                            <td className="px-2 py-1">{si.title}</td>
                            <td className="px-2 py-1">{si.type}</td>
                            <td className="px-2 py-1">
                              {si.type === "link" && si.link ? (
                                <a
                                  href={si.link}
                                  target="_blank"
                                  className="text-blue-600 underline"
                                >
                                  {si.link}
                                </a>
                              ) : si.type === "pdf" && si.pdf ? (
                                <a
                                  href={pb.files.getURL(editingRow, si.pdf)}
                                  target="_blank"
                                  className="text-blue-600 underline"
                                >
                                  View PDF
                                </a>
                              ) : (
                                "N/A"
                              )}
                            </td>
                            <td className="px-2 py-1">
                              <button
                                onClick={() => handleDeleteSubItem(i)}
                                className="text-red-600 hover:underline"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>

                  {/* Add Sub-Item Form */}
                  <div className="mt-4 border p-3 rounded bg-white">
                    <h5 className="font-medium mb-2">Add Sub-Item</h5>
                    <input
                      type="text"
                      placeholder="Title"
                      value={newSubItem.title}
                      onChange={(e) =>
                        setNewSubItem({ ...newSubItem, title: e.target.value })
                      }
                      className="w-full border px-2 py-1 rounded mb-2"
                    />
                    <select
                      value={newSubItem.type}
                      onChange={(e) =>
                        setNewSubItem({ ...newSubItem, type: e.target.value })
                      }
                      className="w-full border px-2 py-1 rounded mb-2"
                    >
                      <option value="link">Link</option>
                      <option value="pdf">PDF</option>
                      <option value="na">N/A</option>
                    </select>
                    {newSubItem.type === "link" && (
                      <input
                        type="text"
                        placeholder="Link"
                        value={newSubItem.link}
                        onChange={(e) =>
                          setNewSubItem({ ...newSubItem, link: e.target.value })
                        }
                        className="w-full border px-2 py-1 rounded mb-2"
                      />
                    )}
                    {newSubItem.type === "pdf" && (
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) =>
                          setNewSubItem({
                            ...newSubItem,
                            pdf: e.target.files?.[0] || null,
                          })
                        }
                        className="w-full border px-2 py-1 rounded mb-2"
                      />
                    )}
                    <button
                      onClick={handleAddSubItem}
                      className="px-3 py-1 bg-gray-700 text-white hover:bg-gray-800 rounded"
                    >
                      Add Sub-Item
                    </button>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 mt-6">
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

export default Disclosures;
