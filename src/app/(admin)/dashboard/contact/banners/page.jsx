"use client";
import { useEffect, useState } from "react";
import pb from "@/app/(admin)/_lib/pb";
import { Plus, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";

const Contact = () => {
  // const [loading, setLoading] = useState(true);
  // const router = useRouter();

  // // Handle authentication
  // useEffect(() => {
  //   if (!pb.authStore.isValid) {
  //     router.replace("/login");
  //   } else {
  //     setLoading(false);
  //   }
  // }, []);

  // if (loading) return <div>Loading...</div>;

  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [imgOpen, setImgOpen] = useState("");
  const [editingRow, setEditingRow] = useState(null);

  const [fade, setFade] = useState(false);
  const [imgFade, setImgFade] = useState(false);

  // Trigger fade when modal opens
  useEffect(() => {
    if (open) {
      setFade(true);
    } else {
      setFade(false);
    }
  }, [open]);

  // Trigger fade when image modal opens
  useEffect(() => {
    if (imgOpen) {
      setImgFade(true);
    } else {
      setImgFade(false);
    }
  }, [imgOpen]);

  // Form state
  const [sno, setSno] = useState(0);
  const [title, setTitle] = useState("");
  const [page, setPage] = useState("contact");
  const [existingImage, setExistingImage] = useState("");
  const [newImage, setNewImage] = useState(null);

  // Fetch data from PocketBase
  const fetchData = async () => {
    const records = await pb.collection("banners").getFullList(
      {
        sort: "sno",
        filter: 'page = "contact"',
      },
      { requestKey: null }
    );
    setData(records);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFileChange = (e) => {
    setNewImage(e.target.files[0]);
  };

  const openAdd = () => {
    setEditingRow(null);
    setSno(0);
    setTitle("");
    setPage("contact");
    setExistingImage("");
    setNewImage(null);
    setOpen(true);
  };

  const openEdit = (row) => {
    setEditingRow(row);
    setSno(row.sno);
    setTitle(row.title);
    setPage(row.page || "contact");
    setExistingImage(row.image || "");
    setNewImage(null);
    setOpen(true);
  };

  const handleSave = async () => {
    try {
      let record;
      if (editingRow) {
        const updateData = { sno, title, page };
        if (newImage) {
          updateData["image"] = newImage;
        }

        record = await pb
          .collection("banners")
          .update(editingRow.id, updateData);
      } else {
        record = await pb.collection("banners").create({
          sno,
          title,
          page,
          image: newImage,
        });
      }

      setOpen(false);
      setEditingRow(null);
      setSno(0);
      setTitle("");
      setPage("contact"); // Reset page to "about" after saving
      setExistingImage("");
      setNewImage(null);
    } catch (err) {
      console.error(err);
      alert("Error saving: " + err.message);
    }
    fetchData();
  };

  const handleDeleteImage = async () => {
    if (!editingRow || !existingImage) return;

    const confirmImageDelete = confirm(
      "Are you sure you want to delete this image?"
    );
    if (!confirmImageDelete) return;

    try {
      const updated = await pb.collection("banners").update(editingRow.id, {
        image: "",
      });

      setExistingImage("");
      setData((prev) =>
        prev.map((item) => (item.id === editingRow.id ? updated : item))
      );
    } catch (err) {
      console.error(err);
      alert("Error deleting image: " + err.message);
    }
  };

  const handleDeleteRow = async () => {
    if (!editingRow) return;

    const confirmDelete = confirm(
      "Are you sure you want to delete this banner?"
    );
    if (!confirmDelete) return;

    try {
      await pb.collection("banners").delete(editingRow.id);

      setData((prev) => prev.filter((item) => item.id !== editingRow.id));
      setOpen(false);
      setEditingRow(null);
    } catch (err) {
      console.error(err);
      alert("Error deleting banner: " + err.message);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="fixed top-0 p-4 bg-gray-100 border-b w-full flex flex-wrap gap-2">
        <a href="/dashboard">
          <span className="text-gray-600 hover:text-black">Dashboard</span>
        </a>
        <span className="text-gray-600">/</span>
        <span className="text-gray-600">Contact</span>
        <span className="text-gray-600">/</span>
        <a href="/dashboard/contact/banners">
          <span className="text-black">Banners</span>
        </a>
      </div>

      {/* Table */}
      <div className="p-4 mt-14 w-full">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold text-lg">Contact (Banners)</h2>
          <button
            onClick={openAdd}
            className="px-2 py-1 bg-gray-800 text-white rounded hover:bg-gray-900 flex items-center justify-center gap-1 cursor-pointer"
          >
            <Plus size={16} /> <span>Add Banner</span>
          </button>
        </div>

        <div className="overflow-x-auto border border-gray-300">
          {/* scrollable tbody wrapper */}
          <div className="max-h-[75vh] overflow-y-auto no-scrollbar">
            <table className="w-full min-w-[800px] text-sm">
              <tbody className="text-center">
                <tr className="sticky top-0 bg-gray-200 shadow-2xs">
                  <th className="px-3 py-2">S.No</th>
                  <th className="px-3 py-2">Image</th>
                  <th className="px-3 py-2">Title</th>
                  <th className="px-3 py-2">Page</th>
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
                      <td className="px-3 py-2">
                        {item.image ? (
                          <img
                            src={`${pb.files.getURL(item, item.image)}?thumb=64x0`}
                            className="w-12 h-12 rounded object-cover mx-auto hover:scale-105 transition-all duration-200"
                            alt="preview"
                            onClick={(e) => {
                              e.stopPropagation();
                              setImgOpen(
                                `${pb.files.getURL(item, item.image)}?thumb=1024x0`
                              );
                            }}
                          />
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td className="px-3 py-2 font-medium">{item.title}</td>
                      <td className="px-3 py-2 text-gray-600 truncate max-w-[200px]">
                        {item.page} {/* Updated to page */}
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
          className={`fixed inset-0 flex items-center justify-center z-50 bg-black/40 transition-opacity duration-100 ${fade ? "opacity-100" : "opacity-0"}`}
          onClick={() => {
            // if (sno || title || newImage) {
            //   const confirmStopChanging = confirm(
            //     "You have unsaved changes. Do you really want to close?"
            //   );
            //   if (!confirmStopChanging) return;
            // }
            setOpen(false);
          }}
        >
          <div
            className={`relative bg-gray-50 rounded p-6 w-[512px] shadow transform transition-transform duration-100 ${fade ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"}`}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">
              {editingRow ? "Edit Banner" : "Add New Banner"}
            </h3>

            <label htmlFor="sno" className="block mb-2 text-sm font-medium">
              S.No
            </label>
            <input
              id="sno"
              name="S.No"
              type="number"
              value={sno || ""}
              onChange={(e) => setSno(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-3"
            />

            <label htmlFor="title" className="block mb-2 text-sm font-medium">
              Title
            </label>
            <input
              id="title"
              name="Title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-3"
            />

            <label htmlFor="page" className="block mb-2 text-sm font-medium">
              Page
            </label>
            <input
              type="text"
              id="page"
              name="Page"
              required
              value="contact"
              onChange={(e) => setPage(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-3"
            />

            <label htmlFor="img" className="block mb-2 text-sm font-medium">
              Image
            </label>
            <input
              id="img"
              type="file"
              onChange={handleFileChange}
              className="w-full border px-3 py-2 rounded mb-3 border-gray-300"
            />

            <div className="flex gap-2 mb-4 items-center">
              {existingImage && (
                <div className="relative">
                  <img
                    src={pb.files.getURL(editingRow, existingImage)}
                    className="w-32 h-18 rounded object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleDeleteImage}
                    className="absolute top-0 right-0 bg-red-600 text-white rounded-bl"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
              {newImage && (
                <img
                  src={URL.createObjectURL(newImage)}
                  className="w-16 h-16 rounded object-cover"
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

      {/* Preview for Image */}
      {imgOpen && (
        <div
          className={`fixed inset-0 flex items-center justify-center z-50 bg-black/40 transition-opacity duration-100 ${imgFade ? "opacity-100" : "opacity-0"}`}
          onClick={() => setImgOpen("")}
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className={`relative rounded w-[80dvw] md:w-auto md:h-[60dvh] transform transition-transform duration-100 ${imgFade ? "translate-y-0 opacity-100" : "-translate-y-5 opacity-0"}`}
          >
            <img
              src={imgOpen}
              alt="preview"
              className="w-full h-full object-contain"
            />

            <button
              onClick={() => setImgOpen("")}
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

export default Contact;
