import Sidebar from "@/components/Sidebar";
import { enforceAdminAccess } from "@/lib/guards";
import { ReactNode } from "react";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await enforceAdminAccess();

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-[#0d1520] bg-[url('/balls.png')] bg-cover bg-center bg-no-repeat bg-fixed text-white font-sans overflow-hidden">
      <div className="flex-1 min-h-0 flex flex-col h-full overflow-y-auto p-4 md:p-10 relative">
        {children}
      </div>
    </div>
  );
}
