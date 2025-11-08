"use client";
import { useEffect, useState } from "react";
import pb from "@/app/(admin)/_lib/pb";
import { Plus, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";

const GalleryVideo = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [videoOpen, setVideoOpen] = useState("");
  const [editingRow, setEditingRow] = useState(null);

  const [fade, setFade] = useState(false);
  const [videoFade, setVideoFade] = useState(false);

  useEffect(() => setFade(open), [open]);
  useEffect(() => setVideoFade(!!videoOpen), [videoOpen]);

  // Form state
  const [sno, setSno] = useState(0);
  const [active, setActive] = useState(true);
  const [existingVideo, setExistingVideo] = useState("");
  const [newVideo, setNewVideo] = useState(null);
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
  // Fetch data
  const fetchData = async () => {
    const records = await pb.collection("gallery").getFullList(
      {
        sort: "-sno",
        filter: 'type = "video"',
      },
      { requestKey: null }
    );
    setData(records);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFileChange = (e) => {
    setNewVideo(e.target.files[0]);
  };

  const openAdd = () => {
    setEditingRow(null);
    setSno(0);
    setActive(true);
    setExistingVideo("");
    setNewVideo(null);
    setOpen(true);
  };

  const openEdit = (row) => {
    setEditingRow(row);
    setSno(row.sno);
    setActive(row.active);
    setExistingVideo(row.video || "");
    setNewVideo(null);
    setOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingRow) {
        const updateData = { sno, type: "video", active };
        if (newVideo) updateData.video = newVideo;

        await pb.collection("gallery").update(editingRow.id, updateData);
      } else {
        await pb.collection("gallery").create({
          sno,
          type: "video",
          active,
          video: newVideo,
        });
      }

      setOpen(false);
      setEditingRow(null);
      setSno(0);
      setExistingVideo("");
      setNewVideo(null);
      setActive(true);
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Error saving: " + err.message);
    }
  };

  const handleDeleteFile = async () => {
    if (!editingRow || !existingVideo) return;
    const confirmDelete = confirm("Delete this video?");
    if (!confirmDelete) return;

    try {
      const updated = await pb.collection("gallery").update(editingRow.id, {
        video: "",
      });
      setExistingVideo("");
      setData((prev) =>
        prev.map((item) => (item.id === editingRow.id ? updated : item))
      );
    } catch (err) {
      console.error(err);
      alert("Error deleting video: " + err.message);
    }
  };

  const handleDeleteRow = async () => {
    if (!editingRow) return;
    const confirmDelete = confirm("Delete this record?");
    if (!confirmDelete) return;

    try {
      await pb.collection("gallery").delete(editingRow.id);
      setData((prev) => prev.filter((item) => item.id !== editingRow.id));
      setOpen(false);
      setEditingRow(null);
    } catch (err) {
      console.error(err);
      alert("Error deleting row: " + err.message);
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
        <span className="text-gray-600">Gallery</span>
        <span className="text-gray-600">/</span>
        <a href="/dashboard/gallery/video">
          <span className="text-black">Videos</span>
        </a>
      </div>

      {/* Table */}
      <div className="p-4 mt-14 w-full">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold text-lg">Gallery (Videos)</h2>
          <button
            onClick={openAdd}
            className="px-2 py-1 bg-gray-800 text-white rounded hover:bg-gray-900 flex items-center justify-center gap-1 cursor-pointer"
          >
            <Plus size={16} /> <span>Add Video</span>
          </button>
        </div>

        <div className="overflow-x-auto border border-gray-300">
          <div className="max-h-[75vh] overflow-y-auto no-scrollbar">
            <table className="w-full min-w-[800px] text-sm">
              <tbody className="text-center">
                <tr className="sticky top-0 bg-gray-200 shadow-2xs">
                  <th className="px-3 py-2">S.No</th>
                  <th className="px-3 py-2">Video</th>
                  <th className="px-3 py-2">Active</th>
                  <th className="px-3 py-2">Created</th>
                  <th className="px-3 py-2">Updated</th>
                </tr>

                {data.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-2">
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
                      <td className="px-3 py-2">
                        {item.video ? (
                          <video
                            src={pb.files.getURL(item, item.video)}
                            className="w-12 h-12 rounded object-cover mx-auto hover:scale-105 transition-all duration-200"
                            onClick={(e) => {
                              e.stopPropagation();
                              setVideoOpen(pb.files.getURL(item, item.video));
                            }}
                          />
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td className="px-3 py-2">{item.active ? "✅" : "❌"}</td>
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

      {/* Modal */}
      {open && (
        <div
          className={`fixed inset-0 flex items-center justify-center z-50 bg-black/40 transition-opacity duration-100 ${
            fade ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setOpen(false)}
        >
          <div
            className={`relative bg-gray-50 rounded p-6 w-[512px] shadow transform transition-transform duration-100 ${
              fade ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">
              {editingRow ? "Edit Video" : "Add New Video"}
            </h3>

            <label className="block mb-2 text-sm font-medium">S.No</label>
            <input
              type="number"
              value={sno || ""}
              onChange={(e) => setSno(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-3"
            />

            <label className="block mb-2 text-sm font-medium">Mode</label>
            <select
              value={active ? "true" : "false"}
              onChange={(e) => setActive(e.target.value === "true")}
              className="w-full border px-3 py-2 rounded mb-3"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>

            <label className="block mb-2 text-sm font-medium">Video</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full border px-3 py-2 rounded mb-3 border-gray-300"
            />

            <div className="flex gap-2 mb-4 items-center">
              {existingVideo && (
                <div className="relative">
                  <video
                    src={pb.files.getURL(editingRow, existingVideo)}
                    className="w-auto h-32 rounded object-cover"
                    controls
                  />
                  <button
                    type="button"
                    onClick={handleDeleteFile}
                    className="absolute top-0 right-0 bg-red-600 text-white rounded-bl"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
              {newVideo && (
                <video
                  src={URL.createObjectURL(newVideo)}
                  className="w-auto h-20 rounded object-cover"
                  controls
                />
              )}
            </div>

            <button
              onClick={() => setOpen(false)}
              className="absolute top-0 right-0 p-1 rounded-bl-md bg-gray-700 text-white"
            >
              <X />
            </button>

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
        </div>
      )}

      {/* Preview */}
      {videoOpen && (
        <div
          className={`fixed inset-0 flex items-center justify-center z-50 bg-black/40 transition-opacity duration-100 ${
            videoFade ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setVideoOpen("")}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`relative rounded w-[80dvw] md:w-auto md:h-[70dvh] transform transition-transform duration-100 ${
              videoFade
                ? "translate-y-0 opacity-100"
                : "-translate-y-5 opacity-0"
            }`}
          >
            <video
              src={videoOpen}
              controls
              className="w-full h-full object-contain"
            />

            <button
              onClick={() => setVideoOpen("")}
              className="absolute top-0 right-0 p-1 rounded-bl-xl bg-red-600 text-white"
            >
              <X />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default GalleryVideo;
