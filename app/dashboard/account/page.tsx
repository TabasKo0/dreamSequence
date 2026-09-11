import { createClient } from "@/lib/supabase/server";
import LogoutButton from "./components/LogoutButton";
import { redirect } from "next/navigation";

export default async function AccountPage() {
  const supabase = await createClient();

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  const roleLabels: Record<string, string> = {
    player: "Player",
    admin: "Administrator",
    organizer: "Organizer"
  };

  const userRole = profile?.role ? roleLabels[profile.role] || profile.role : "Player";

  return (
    <main className="flex-1 flex flex-col h-full p-6 md:p-10 relative overflow-y-auto">
      <header className="mb-8">
        <h1 className="text-5xl font-bold tracking-tight montserrat-bold text-red-500 drop-shadow-[0_0_25px_rgba(0,0,0,2.7)]">ACCOUNT</h1>
      </header>
      
      <div className="flex-1 rounded-[2rem] bg-white/5 border border-white/50 backdrop-blur-xs p-8 shadow-xl relative overflow-hidden flex flex-col max-w-4xl w-full">
        <h2 className="text-2xl font-semibold mb-6">Profile Details</h2>
        
        <div className="space-y-6 flex-1">
          {/* Info grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Email */}
            <div className="bg-black/20 p-5 rounded-2xl border border-white/10">
              <p className="text-xs text-white/50 uppercase tracking-wider mb-1 font-semibold">Email Address</p>
              <p className="text-lg font-medium">{user.email}</p>
            </div>

            {/* Username */}
            <div className="bg-black/20 p-5 rounded-2xl border border-white/10">
              <p className="text-xs text-white/50 uppercase tracking-wider mb-1 font-semibold">Username</p>
              <p className="text-lg font-medium">{profile?.username || "Not set"}</p>
            </div>

            {/* Role */}
            <div className="bg-black/20 p-5 rounded-2xl border border-white/10">
              <p className="text-xs text-white/50 uppercase tracking-wider mb-1 font-semibold">Role</p>
              <p className="text-lg font-medium">{userRole}</p>
            </div>

            {/* Account Created */}
            <div className="bg-black/20 p-5 rounded-2xl border border-white/10">
              <p className="text-xs text-white/50 uppercase tracking-wider mb-1 font-semibold">Member Since</p>
              <p className="text-lg font-medium">
                {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : "--"}
              </p>
            </div>
            
          </div>
          
          <div className="pt-8 border-t border-white/10 mt-8">
            <h3 className="text-xl font-semibold mb-4 text-red-400">Danger Zone</h3>
            <p className="text-white/60 text-sm mb-4">
              Logging out will require you to enter your credentials or use a magic link next time you want to access the dashboard.
            </p>
            <LogoutButton />
          </div>

        </div>
      </div>
    </main>
  );
}
