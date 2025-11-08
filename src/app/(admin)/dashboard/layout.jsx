import Sidebar from "./_components/SideBar";

export const metadata = {
  title: "Admin Pannel | Spice Lounge",
};

const AdminLayout = ({ children }) => {
  return (
    <div className="flex min-w-[768px]">
      <Sidebar />
      <div className="w-64"></div>
      <main className="flex-1 min-h-dvh overflow-y-auto no-scrollbar">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
