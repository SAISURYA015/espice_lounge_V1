"use client";
import { useEffect, useState } from "react";
import pb from "@/app/(admin)/_lib/pb";
import { useRouter } from "next/navigation";

const ContactForm = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const router = useRouter();

  // Handle authentication
  useEffect(() => {
    if (!pb.authStore.isValid) {
      router.replace("/login");
    } else {
      setLoading(false);
    }
  }, []);

  // Fetch data from PocketBase
  const fetchData = async () => {
    try {
      const records = await pb.collection("contact_form").getFullList(
        {
          sort: "-created",
        },
        { requestKey: null }
      );
      setData(records);
    } catch (err) {
      console.error("Error fetching:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Delete function
  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this record?")) {
      try {
        await pb.collection("contact_form").delete(id);
        setData((prev) => prev.filter((item) => item.id !== id));
      } catch (err) {
        console.error("Delete failed:", err);
        alert("Failed to delete record");
      }
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
        <span className="text-gray-600">Contact</span>
        <span className="text-gray-600">/</span>
        <a href="/dashboard/contact/forms">
          <span className="text-black">Forms</span>
        </a>
      </div>

      {/* Table */}
      <div className="p-4 mt-14 w-full">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold text-lg">Contact (Forms)</h2>
        </div>

        <div className="overflow-x-auto border border-gray-300">
          <div className="max-h-[75vh] overflow-y-auto no-scrollbar">
            <table className="w-full min-w-[800px] text-sm">
              <tbody className="text-center">
                <tr className="sticky top-0 bg-gray-200 shadow-2xs">
                  <th className="px-3 py-2">S.No</th>
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Email</th>
                  <th className="px-3 py-2">Phone</th>
                  <th className="px-3 py-2">Message</th>
                  <th className="px-3 py-2">Submitted At</th>
                  <th className="px-3 py-2">Action</th>
                </tr>

                {data.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-2">
                      No Records
                    </td>
                  </tr>
                ) : (
                  data.map((item, index) => (
                    <tr
                      key={item.id}
                      className="border-t bg-gray-50 hover:bg-gray-100"
                    >
                      <td className="px-3 py-2">{index + 1}</td>
                      <td className="px-3 py-2 font-medium">{item.name}</td>
                      <td className="px-3 py-2 text-gray-600">{item.email}</td>
                      <td className="px-3 py-2 text-gray-600">{item.phone}</td>
                      <td className="px-3 py-2 text-gray-600 truncate max-w-[200px]">
                        {item.message}
                      </td>
                      <td className="px-3 py-2 text-gray-500">
                        {new Date(item.created).toLocaleString()}
                      </td>
                      <td className="px-3 py-2">
                        <button
                          className="text-white bg-red-600 px-2 py-1 rounded hover:bg-red-700"
                          onClick={() => handleDelete(item.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactForm;
