"use client";
import { useEffect, useState } from "react";
import pb from "@/app/(admin)/_lib/pb";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

const Corporate = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);

  const [fade, setFade] = useState(false);

  // Form state
  const [formValues, setFormValues] = useState({
    sno: "",
    title: "",
    subTitle: "",
    address: "",
    phone_type: "phone",
    phone: "",
    email: "",
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

  // Trigger fade when modal opens
  useEffect(() => {
    setFade(open);
  }, [open]);

  // Fetch corporate info
  const fetchData = async () => {
    const records = await pb.collection("corporate_info").getFullList(
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
        subTitle: row.subTitle || "",
        address: row.address || "",
        phone_type: row.phone_type || "phone",
        phone: row.phone || "",
        email: row.email || "",
      });
    } else {
      // New record
      setEditingRow(null);
      setFormValues({
        sno: "",
        title: "",
        subTitle: "",
        address: "",
        phone_type: "phone",
        phone: "",
        email: "",
      });
    }
    setOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      let record;
      if (editingRow) {
        record = await pb
          .collection("corporate_info")
          .update(editingRow.id, formValues);
        setData((prev) =>
          prev.map((item) => (item.id === editingRow.id ? record : item))
        );
      } else {
        record = await pb.collection("corporate_info").create(formValues);
        setData((prev) => [...prev, record]);
      }

      setOpen(false);
      setEditingRow(null);
    } catch (err) {
      console.error(err);
      alert("Error saving: " + err.message);
    }
  };

  const handleDelete = async (row) => {
    const confirmDelete = confirm("Delete this record?");
    if (!confirmDelete) return;
    try {
      await pb.collection("corporate_info").delete(row.id);
      setData((prev) => prev.filter((item) => item.id !== row.id));
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
        <span className="text-black">Corporate Info</span>
      </div>

      {/* Table */}
      <div className="p-4 mt-14 w-full">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold text-lg">Corporate Info</h2>
          <button
            onClick={() => openEdit(null)}
            className="px-3 py-1 bg-gray-700 text-white hover:bg-gray-800 rounded"
          >
            + Add
          </button>
        </div>

        <div className="overflow-x-auto border border-gray-300">
          <div className="max-h-[75vh] overflow-y-auto no-scrollbar">
            <table className="w-full min-w-[1000px] text-sm">
              <thead className="sticky top-0 bg-gray-200">
                <tr>
                  <th className="px-3 py-2">S.No</th>
                  <th className="px-3 py-2">Title</th>
                  <th className="px-3 py-2">Sub Title</th>
                  <th className="px-3 py-2">Address</th>
                  <th className="px-3 py-2">Phone Type</th>
                  <th className="px-3 py-2">Phone</th>
                  <th className="px-3 py-2">Email</th>
                  <th className="px-3 py-2">Created</th>
                  <th className="px-3 py-2">Updated</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {data.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-4 text-gray-600">
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
                      <td className="px-3 py-2">{item.subTitle}</td>
                      <td className="px-3 py-2">{item.address}</td>
                      <td className="px-3 py-2">{item.phone_type}</td>
                      <td className="px-3 py-2">{item.phone}</td>
                      <td className="px-3 py-2">{item.email}</td>
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
                {editingRow ? "Edit Corporate Info" : "Add Corporate Info"}
              </h3>

              {[
                { name: "sno", label: "S.No", type: "text" },
                { name: "title", label: "Title", type: "text" },
                { name: "subTitle", label: "Sub Title", type: "text" },
                { name: "address", label: "Address", type: "text" },
                { name: "phone", label: "Phone", type: "text" },
                { name: "email", label: "Email", type: "email" },
              ].map((field) => (
                <div key={field.name} className="mb-3">
                  <label className="block mb-1 text-sm font-medium">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={formValues[field.name]}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>
              ))}

              {/* phone_type dropdown */}
              <div className="mb-3">
                <label className="block mb-1 text-sm font-medium">
                  Phone Type
                </label>
                <select
                  name="phone_type"
                  value={formValues.phone_type}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                >
                  <option value="phone">Phone</option>
                  <option value="telephone">Telephone</option>
                </select>
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

export default Corporate;
