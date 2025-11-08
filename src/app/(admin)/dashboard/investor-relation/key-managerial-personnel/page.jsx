"use client";
import { useEffect, useState } from "react";
import pb from "@/app/(admin)/_lib/pb";
import { Plus, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";

const Leadership = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [imgOpen, setImgOpen] = useState("");
  const [editingRow, setEditingRow] = useState(null);

  const [fade, setFade] = useState(false);
  const [imgFade, setImgFade] = useState(false);

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

  // Trigger fade when image modal opens
  useEffect(() => {
    setImgFade(imgOpen);
  }, [imgOpen]);

  // Form state
  const [sno, setSno] = useState(0);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [description, setDescription] = useState("");
  const [existingImage, setExistingImage] = useState("");
  const [newImage, setNewImage] = useState(null);

  // Fetch data from PocketBase
  const fetchData = async () => {
    const records = await pb.collection("leaders").getFullList(
      {
        sort: "sno",
        filter: 'page = "investor"',
      },
      { requestKey: null }
    );
    setData(records);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAdd = () => {
    setEditingRow(null);
    setSno(0);
    setName("");
    setRole("");
    setDescription("");
    setOpen(true);
  };

  const openEdit = (row) => {
    setEditingRow(row);
    setSno(row.sno);
    setName(row.name || "");
    setRole(row.role || "");
    setDescription(row.description || "");
    setOpen(true);
  };

  const handleSave = async () => {
    try {
      let record;
      if (editingRow) {
        const updateData = { sno, name, role, description, page: "investor" };
        record = await pb
          .collection("leaders")
          .update(editingRow.id, updateData);
      } else {
        record = await pb.collection("leaders").create({
          sno,
          name,
          role,
          description,
          page: "investor",
        });
      }

      setOpen(false);
      setEditingRow(null);
      setSno(0);
      setName("");
      setRole("");
      setDescription("");
    } catch (err) {
      console.error(err);
      alert("Error saving: " + err.message);
    }
    fetchData();
  };

  const handleDeleteRow = async () => {
    if (!editingRow) return;

    const confirmDelete = confirm(
      "Are you sure you want to delete this leader?"
    );
    if (!confirmDelete) return;

    try {
      await pb.collection("leaders").delete(editingRow.id);

      setData((prev) => prev.filter((item) => item.id !== editingRow.id));
      setOpen(false);
      setEditingRow(null);
    } catch (err) {
      console.error(err);
      alert("Error deleting leader: " + err.message);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      {/* Header */}
      <div className="fixed top-0 p-4 bg-gray-100 border-b w-full flex flex-wrap gap-2">
        <a href="/dashboard">
          <span className="text-gray-600 hover:text-black">Dashboard</span>
        </a>
        <span className="text-gray-600">/</span>
        <span className="text-gray-600">Investor</span>
        <span className="text-gray-600">/</span>
        <a href="/dashboard/about/leaders">
          <span className="text-black">Key Managerial Personnel</span>
        </a>
      </div>

      {/* Table */}
      <div className="p-4 mt-14 w-full">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold text-lg">Key Managerial Personnel</h2>
          <button
            onClick={openAdd}
            className="px-2 py-1 bg-gray-800 text-white rounded hover:bg-gray-900 flex items-center justify-center gap-1 cursor-pointer"
          >
            <Plus size={16} /> <span>Add Leader</span>
          </button>
        </div>

        <div className="overflow-x-auto border border-gray-300">
          {/* scrollable tbody wrapper */}
          <div className="max-h-[75vh] overflow-y-auto no-scrollbar">
            <table className="w-full min-w-[800px] text-sm">
              <tbody className="text-center">
                <tr className="sticky top-0 bg-gray-200 shadow-2xs">
                  <th className="px-3 py-2">S.No</th>
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Role</th>
                  <th className="px-3 py-2">Description</th>
                  <th className="px-3 py-2">Created</th>
                  <th className="px-3 py-2">Updated</th>
                </tr>

                {data.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-2">
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
                      <td className="px-3 py-2 font-medium">{item.name}</td>
                      <td className="px-3 py-2 text-gray-600 truncate max-w-[200px]">
                        {item.role}
                      </td>
                      <td className="px-3 py-2 text-gray-500 text-justify">
                        {item.description}
                      </td>
                      <td className="px-3 py-2 text-gray-500">
                        {item.created}
                      </td>
                      <td className="px-3 py-2 text-gray-500">
                        {item.updated}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal for Add/Edit */}
      {open && (
        <div
          className={`fixed inset-0 flex items-center justify-center z-50 bg-black/40 transition-opacity duration-100 ${
            fade ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setOpen(false)}
        >
          <div className="relative">
            <div
              className={`bg-gray-50 rounded p-6 w-[512px] h-[70dvh] overflow-y-auto no-scrollbar shadow transform transition-transform duration-100 ${
                fade ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-4">
                {editingRow ? "Edit Leader" : "Add New Leader"}
              </h3>

              <label htmlFor="sno" className="block mb-2 text-sm font-medium">
                S.No
              </label>
              <input
                id="sno"
                type="number"
                value={sno || ""}
                onChange={(e) => setSno(Number(e.target.value))}
                className="w-full border px-3 py-2 rounded mb-3"
              />

              <label htmlFor="name" className="block mb-2 text-sm font-medium">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border px-3 py-2 rounded mb-3"
              />

              <label htmlFor="role" className="block mb-2 text-sm font-medium">
                Role
              </label>
              <input
                id="role"
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full border px-3 py-2 rounded mb-3"
              />

              <label
                htmlFor="description"
                className="block mb-2 text-sm font-medium"
              >
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full border px-3 py-2 rounded mb-3"
              />

              <div className="flex justify-end gap-2">
                {editingRow && (
                  <button
                    onClick={handleDeleteRow}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Trash2 size={16} /> <span>Delete</span>
                  </button>
                )}

                <button
                  onClick={handleSave}
                  className="px-3 py-1 bg-gray-700 text-white hover:bg-gray-800 rounded cursor-pointer"
                >
                  {editingRow ? "Save" : "Add"}
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

export default Leadership;
