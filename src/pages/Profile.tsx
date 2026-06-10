import { useState } from "react";
import { motion } from "framer-motion";
import { 
  User, Lock, Mail, Trash2, Shield, 
  ChevronRight, Camera, Bell, LogOut 
} from "lucide-react";
import { useAuth } from "@/store/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { logout } from "@/lib/auth";
import { BRANCHES } from "@/lib/branches";

export default function Profile() {
  const user = useAuth((s) => s.user);
  const [loading, setLoading] = useState(false);

  const branchName = BRANCHES.find(b => b.id.toLowerCase() === (user as any)?.branchId?.toLowerCase())?.name || (user as any)?.branchId;

  const handleDeleteAccount = () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      toast.error("Account deletion requested. Please contact support for final verification.");
    }
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Password updated successfully!");
    }, 1500);
  };

  if (!user) return null;

  return (
    <div className="container py-12 max-w-4xl min-h-screen">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <header>
          <h1 className="text-4xl font-black tracking-tight">Account Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your personal information and preferences.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="space-y-2">
            <SettingsLink icon={<User className="h-4 w-4" />} label="Personal Info" active />
            <SettingsLink icon={<Lock className="h-4 w-4" />} label="Security" />
            <SettingsLink icon={<Bell className="h-4 w-4" />} label="Notifications" />
            <SettingsLink icon={<Shield className="h-4 w-4" />} label="Privacy" />
            <div className="pt-4 border-t border-border mt-4">
              <button 
                onClick={() => logout()}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-500/10 transition-all"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            {/* Profile Section */}
            <section className="p-8 rounded-[2.5rem] border border-border bg-card shadow-sm">
              <div className="flex items-center gap-6 mb-8">
                <div className="relative group">
                  <div className="h-24 w-24 rounded-full bg-primary/10 grid place-items-center text-3xl font-bold text-primary border-4 border-background shadow-lg overflow-hidden">
                    {user.image ? <img src={user.image} alt="" className="h-full w-full object-cover" /> : user.name[0]}
                  </div>
                  <button className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary text-primary-foreground grid place-items-center shadow-lg border-2 border-background opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                <div>
                  <h2 className="text-xl font-bold">{user.name}</h2>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
                      {user.role || 'Customer'}
                    </span>
                    {user.branchId && (
                      <span className="px-2 py-0.5 rounded-md bg-secondary text-muted-foreground text-[10px] font-black uppercase tracking-widest">
                        {branchName} Branch
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-muted-foreground ml-1">Full Name</Label>
                    <Input defaultValue={user.name} className="h-12 rounded-xl bg-muted/50 border-none" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-muted-foreground ml-1">Email Address</Label>
                    <Input defaultValue={user.email} className="h-12 rounded-xl bg-muted/50 border-none" disabled />
                  </div>
                </div>
                <Button className="rounded-xl h-12 px-8 bg-primary shadow-lg shadow-primary/20">
                  Update Profile
                </Button>
              </div>
            </section>

            {/* Security Section */}
            <section className="p-8 rounded-[2.5rem] border border-border bg-card shadow-sm">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                <Lock className="h-5 w-5 text-primary" />
                Change Password
              </h2>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-muted-foreground ml-1">Current Password</Label>
                  <Input type="password" placeholder="••••••••" className="h-12 rounded-xl bg-muted/50 border-none" required />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-muted-foreground ml-1">New Password</Label>
                  <Input type="password" placeholder="••••••••" className="h-12 rounded-xl bg-muted/50 border-none" required />
                </div>
                <Button type="submit" disabled={loading} className="rounded-xl h-12 px-8 bg-primary">
                  {loading ? "Updating..." : "Update Password"}
                </Button>
              </form>
            </section>

            {/* Danger Zone */}
            <section className="p-8 rounded-[2.5rem] border border-red-500/20 bg-red-500/5 shadow-sm">
              <h2 className="text-xl font-bold text-red-500 mb-2 flex items-center gap-3">
                <Trash2 className="h-5 w-5" />
                Danger Zone
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <Button 
                variant="destructive" 
                onClick={handleDeleteAccount}
                className="rounded-xl h-12 px-8 shadow-lg shadow-red-500/20"
              >
                Delete My Account
              </Button>
            </section>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function SettingsLink({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <button className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
      active ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
    }`}>
      <div className="flex items-center gap-3">
        {icon}
        {label}
      </div>
      <ChevronRight className="h-4 w-4 opacity-50" />
    </button>
  );
}
