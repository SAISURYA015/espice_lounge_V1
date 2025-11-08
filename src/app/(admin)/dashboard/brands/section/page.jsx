"use client";
import { useEffect, useState } from "react";
import pb from "@/app/(admin)/_lib/pb";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";


const AboutBrands = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);

  const [fade, setFade] = useState(false);

  // Form state
  const [aboutTitle, setAboutTitle] = useState("");
  const [aboutDescription, setAboutDescription] = useState("");
  const [title2, setTitle2] = useState("");
  const [websiteLink, setWebsiteLink] = useState("");
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
    setAboutTitle(row.aboutTitle || "");
    setAboutDescription(row.aboutDescription || "");
    setTitle2(row.title2 || "");
    setWebsiteLink(row.websiteLink || "");
    setOpen(true);
  };

  const handleSave = async () => {
    try {
      await pb.collection("brands").update(editingRow.id, {
        aboutTitle,
        aboutDescription,
        title2,
        websiteLink,
      });

      setOpen(false);
      setEditingRow(null);
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Error saving: " + err.message);
    }
  };

    if (loading) return <div>Loading...</div>;


  return (
    <>
      {/* Header */}
      <div className="fixed top-0 p-4 bg-gray-100 border-b w-full flex flex-wrap gap-2 z-10">
        <a href="/dashboard">
          <span className="text-gray-600 hover:text-black">Dashboard</span>
        </a>
        <span className="text-gray-600">/</span>
        <span className="text-black">Brands (Section)</span>
      </div>

      {/* Table */}
      <div className="p-4 mt-14 w-full">
        <h2 className="font-semibold text-lg mb-3">Brands (About Section)</h2>

        <div className="overflow-x-auto border border-gray-300">
          <div className="max-h-[75vh] overflow-y-auto no-scrollbar">
            <table className="w-full min-w-[1000px] text-sm">
              <thead className="sticky top-0 bg-gray-200">
                <tr>
                  <th className="px-3 py-2">SNo</th>
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">About Title</th>
                  <th className="px-3 py-2">About Description</th>
                  <th className="px-3 py-2">Title2</th>
                  <th className="px-3 py-2">Website Link</th>
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
                      <td className="px-3 py-2 font-medium">{i + 1}</td>
                      <td className="px-3 py-2 font-medium">{item.name}</td>
                      <td className="px-3 py-2 truncate max-w-[200px]">
                        {item.aboutTitle || "-"}
                      </td>
                      <td className="px-3 py-2 truncate max-w-[200px]">
                        {item.aboutDescription || "-"}
                      </td>
                      <td className="px-3 py-2 truncate max-w-[200px]">
                        {item.title2 || "-"}
                      </td>
                      <td className="px-3 py-2 text-blue-600 underline">
                        <a
                          href={item.websiteLink || "#"}
                          target="_blank"
                          onClick={(e) => {
                            e.stopPropagation;
                          }}
                        >
                          {item.websiteLink || "-"}
                        </a>
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
              className={`bg-gray-50 rounded p-6 w-[700px] max-h-[70dvh] overflow-y-auto no-scrollbar shadow transform transition-transform duration-100 ${
                fade ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-4">
                Edit Brand - {editingRow.name}
              </h3>

              <label className="block mb-2 text-sm font-medium">
                About Title
              </label>
              <input
                type="text"
                value={aboutTitle}
                onChange={(e) => setAboutTitle(e.target.value)}
                className="w-full border px-3 py-2 rounded mb-4"
              />

              <label className="block mb-2 text-sm font-medium">
                About Description
              </label>
              <textarea
                value={aboutDescription}
                onChange={(e) => setAboutDescription(e.target.value)}
                className="w-full border px-3 py-2 rounded mb-4 h-24 resize-none"
              />

              <label className="block mb-2 text-sm font-medium">Title2</label>
              <input
                type="text"
                value={title2}
                onChange={(e) => setTitle2(e.target.value)}
                className="w-full border px-3 py-2 rounded mb-4"
              />

              <label className="block mb-2 text-sm font-medium">
                Website Link
              </label>
              <input
                type="url"
                value={websiteLink}
                onChange={(e) => setWebsiteLink(e.target.value)}
                className="w-full border px-3 py-2 rounded mb-4"
              />

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

export default AboutBrands;
