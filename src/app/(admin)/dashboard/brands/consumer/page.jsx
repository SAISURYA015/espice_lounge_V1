"use client";
import { useEffect, useState } from "react";
import pb from "@/app/(admin)/_lib/pb";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

const Consumer = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [fade, setFade] = useState(false);

  // Form state
  const [title3, setTitle3] = useState("");

  const [subImg1, setSubImg1] = useState(null);
  const [subTitle1, setSubTitle1] = useState("");
  const [subDescription1, setSubDescription1] = useState("");

  const [subImg2, setSubImg2] = useState(null);
  const [subTitle2, setSubTitle2] = useState("");
  const [subDescription2, setSubDescription2] = useState("");

  const [subImg3, setSubImg3] = useState(null);
  const [subTitle3, setSubTitle3] = useState("");
  const [subDescription3, setSubDescription3] = useState("");
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

  // Trigger fade
  useEffect(() => {
    setFade(open);
  }, [open]);

  // Fetch brands
  const fetchData = async () => {
    const records = await pb.collection("brands").getFullList(
      {
        sort: "created",
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
    setTitle3(row.title3 || "");

    setSubTitle1(row.subTitle1 || "");
    setSubDescription1(row.subDescription1 || "");
    setSubTitle2(row.subTitle2 || "");
    setSubDescription2(row.subDescription2 || "");
    setSubTitle3(row.subTitle3 || "");
    setSubDescription3(row.subDescription3 || "");

    setOpen(true);
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("title3", title3);

      if (subImg1) formData.append("subImg1", subImg1);
      formData.append("subTitle1", subTitle1);
      formData.append("subDescription1", subDescription1);

      if (subImg2) formData.append("subImg2", subImg2);
      formData.append("subTitle2", subTitle2);
      formData.append("subDescription2", subDescription2);

      if (subImg3) formData.append("subImg3", subImg3);
      formData.append("subTitle3", subTitle3);
      formData.append("subDescription3", subDescription3);

      await pb.collection("brands").update(editingRow.id, formData);

      setOpen(false);
      setEditingRow(null);
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Error saving: " + err.message);
    }
  };

  const fmt = (val) => (val ? new Date(val).toLocaleString() : "-");

  const imgUrl = (row, field) =>
    row[field] ? pb.files.getURL(row, row[field]) : null;

  if (loading) return <div>Loading...</div>;

  return (
    <>
      {/* Header */}
      <div className="fixed top-0 p-4 bg-gray-100 border-b w-full flex flex-wrap gap-2 z-10">
        <a href="/dashboard">
          <span className="text-gray-600 hover:text-black">Dashboard</span>
        </a>
        <span className="text-gray-600">/</span>
        <span className="text-black">Brands - Consumer</span>
      </div>

      {/* Table */}
      <div className="p-4 mt-14 w-full">
        <h2 className="font-semibold text-lg mb-3">
          Brands (Consumer Section)
        </h2>

        <div className="overflow-x-auto border border-gray-300">
          <div className="max-h-[75vh] overflow-y-auto no-scrollbar">
            <table className="w-full min-w-[1000px] text-sm">
              <thead className="sticky top-0 bg-gray-200">
                <tr>
                  <th className="px-3 py-2">SNo</th>
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Title3</th>
                  <th className="px-3 py-2">Sub1</th>
                  <th className="px-3 py-2">Sub2</th>
                  <th className="px-3 py-2">Sub3</th>
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
                  data.map((item, i) => (
                    <tr
                      key={item.id}
                      className="border-t bg-gray-50 hover:bg-gray-100 cursor-pointer"
                      onClick={() => openEdit(item)}
                    >
                      <td className="px-3 py-2 font-medium">{i}</td>
                      <td className="px-3 py-2 font-medium">{item.name}</td>
                      <td className="px-3 py-2 truncate max-w-[200px]">
                        {item.title3 || "-"}
                      </td>
                      <td className="px-3 py-2 truncate max-w-[200px]">
                        {item.subTitle1 || "-"}
                      </td>
                      <td className="px-3 py-2 truncate max-w-[200px]">
                        {item.subTitle2 || "-"}
                      </td>
                      <td className="px-3 py-2 truncate max-w-[200px]">
                        {item.subTitle3 || "-"}
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
              className={`bg-gray-50 rounded p-6 w-[800px] max-h-[80dvh] overflow-y-auto no-scrollbar shadow transform transition-transform duration-100 ${
                fade ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-4">
                Edit Consumer - {editingRow.name}
              </h3>

              {/* Title3 */}
              <label className="block mb-2 text-sm font-medium">Title3</label>
              <input
                type="text"
                value={title3}
                onChange={(e) => setTitle3(e.target.value)}
                className="w-full border px-3 py-2 rounded mb-4"
              />

              {/* Sub1 */}
              <h4 className="font-semibold mt-4 mb-2">Sub Section 1</h4>
              {imgUrl(editingRow, "subImg1") && (
                <img
                  src={imgUrl(editingRow, "subImg1")}
                  alt="sub1"
                  className="w-32 h-20 object-cover mb-2"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSubImg1(e.target.files[0])}
                className="mb-2"
              />
              <input
                type="text"
                placeholder="Sub Title 1"
                value={subTitle1}
                onChange={(e) => setSubTitle1(e.target.value)}
                className="w-full border px-3 py-2 rounded mb-2"
              />
              <textarea
                placeholder="Sub Description 1"
                value={subDescription1}
                onChange={(e) => setSubDescription1(e.target.value)}
                className="w-full border px-3 py-2 rounded mb-4"
              />

              {/* Sub2 */}
              <h4 className="font-semibold mt-4 mb-2">Sub Section 2</h4>
              {imgUrl(editingRow, "subImg2") && (
                <img
                  src={imgUrl(editingRow, "subImg2")}
                  alt="sub2"
                  className="w-32 h-20 object-cover mb-2"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSubImg2(e.target.files[0])}
                className="mb-2"
              />
              <input
                type="text"
                placeholder="Sub Title 2"
                value={subTitle2}
                onChange={(e) => setSubTitle2(e.target.value)}
                className="w-full border px-3 py-2 rounded mb-2"
              />
              <textarea
                placeholder="Sub Description 2"
                value={subDescription2}
                onChange={(e) => setSubDescription2(e.target.value)}
                className="w-full border px-3 py-2 rounded mb-4"
              />

              {/* Sub3 */}
              <h4 className="font-semibold mt-4 mb-2">Sub Section 3</h4>
              {imgUrl(editingRow, "subImg3") && (
                <img
                  src={imgUrl(editingRow, "subImg3")}
                  alt="sub3"
                  className="w-32 h-20 object-cover mb-2"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSubImg3(e.target.files[0])}
                className="mb-2"
              />
              <input
                type="text"
                placeholder="Sub Title 3"
                value={subTitle3}
                onChange={(e) => setSubTitle3(e.target.value)}
                className="w-full border px-3 py-2 rounded mb-2"
              />
              <textarea
                placeholder="Sub Description 3"
                value={subDescription3}
                onChange={(e) => setSubDescription3(e.target.value)}
                className="w-full border px-3 py-2 rounded mb-4"
              />

              {/* Save */}
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

export default Consumer;
