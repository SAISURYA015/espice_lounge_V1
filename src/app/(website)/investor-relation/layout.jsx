import NavBar from "@/components/shared/NavBar";
import Sidebar from "../_components/SideBar";
import pb from "../_lib/pb";
import Footer from "../footer/page";

export const metadata = {
  title: "Investor Relation | Spice Lounge",
  description: "",
};

const banners = await pb.collection("banners").getFullList(200, {
  sort: "sno",
  filter: 'page = "investor"',
});

export default function RootLayout({ children }) {
  return (
    <div className="bg-orange-50">
      <NavBar />
      <div className="flex justify-between items-center max-w-7xl mx-auto mt-16">
        <img src={pb.files.getURL(banners[0], banners[0].image)} alt="" />
      </div>
      {/* <div className="lg:flex max-w-7xl mx-auto">
        <Sidebar />
        <main className="flex-1 overflow-y-auto no-scrollbar h-[640px]">
          {children}
        </main>
      </div> */}
      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 max-w-7xl mx-auto py-5 px-4 md:px-12  gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Sidebar />
        </div>

        {/* Main Content */}
        <main className=" bg-orange-50 lg:col-span-3  rounded-xl shadow-sm overflow-y-auto no-scrollbar p-4">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}
