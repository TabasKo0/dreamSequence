import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-[#0d1520] bg-[url('/balls.png')] bg-cover bg-center bg-no-repeat bg-fixed text-white font-sans overflow-hidden">
      <Sidebar />
      {children}
    </div>
  );
}
