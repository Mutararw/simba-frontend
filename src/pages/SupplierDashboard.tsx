import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Truck, Package, MessageSquare, TrendingUp, 
  Clock, CheckCircle2, AlertCircle, ShoppingBag,
  Search, Filter, ArrowUpRight, DollarSign
} from "lucide-react";
import { useAuth } from "@/store/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const MOCK_REQUESTS = [
  { id: "REQ-101", branch: "Remera", item: "Basmati Rice 5kg", qty: 50, priority: "high", status: "pending", date: "2024-04-27T09:00:00" },
  { id: "REQ-102", branch: "Kacyiru", item: "Cooking Oil 3L", qty: 20, priority: "medium", status: "processing", date: "2024-04-27T10:30:00" },
  { id: "REQ-103", branch: "Kimironko", item: "Milk Powder 1kg", qty: 100, priority: "low", status: "delivered", date: "2024-04-26T14:00:00" },
];

export default function SupplierDashboard() {
  const user = useAuth(s => s.user);
  const [requests, setRequests] = useState(MOCK_REQUESTS);

  const stats = {
    pendingOrders: 5,
    fulfilledThisMonth: 124,
    revenue: 4500000,
    rating: 4.8
  };

  const updateStatus = (id: string, newStatus: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    toast.success(`Request ${id} updated to ${newStatus}`);
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-background">
      {/* Sidebar (Simplified for Supplier) */}
      <div className="hidden lg:flex w-72 flex-col border-r border-border bg-card/50 backdrop-blur-xl p-6">
        <div className="flex items-center gap-3 px-3 py-2 rounded-2xl bg-primary/10 text-primary mb-8">
          <Truck className="h-5 w-5" />
          <span className="font-bold text-sm">Supplier Portal</span>
        </div>
        <nav className="space-y-2">
          <SidebarLink icon={<TrendingUp />} label="Overview" active />
          <SidebarLink icon={<Package />} label="Restock Requests" />
          <SidebarLink icon={<ShoppingBag />} label="Order History" />
          <SidebarLink icon={<MessageSquare />} label="Messages" />
        </nav>
      </div>

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-black tracking-tight">Supplier Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your supply chain and branch requests.</p>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard title="Active Requests" value={stats.pendingOrders.toString()} icon={<Clock />} />
          <StatCard title="Fulfilled" value={stats.fulfilledThisMonth.toString()} icon={<CheckCircle2 />} />
          <StatCard title="Total Revenue" value={`RWF ${stats.revenue.toLocaleString()}`} icon={<DollarSign />} />
          <StatCard title="Supply Rating" value={stats.rating.toString()} icon={<TrendingUp />} />
        </div>

        {/* Restock Requests */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black">Restock Requests</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="rounded-xl"><Filter className="h-4 w-4 mr-2" /> Filter</Button>
            </div>
          </div>

          <div className="rounded-[2.5rem] border border-border bg-card overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-muted/30 border-b border-border">
                <tr>
                  <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-muted-foreground">ID</th>
                  <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-muted-foreground">Branch</th>
                  <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-muted-foreground">Product</th>
                  <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-muted-foreground">Qty</th>
                  <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                  <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {requests.map(req => (
                  <tr key={req.id} className="hover:bg-muted/10 transition-colors">
                    <td className="px-6 py-4 font-bold text-sm">{req.id}</td>
                    <td className="px-6 py-4 text-sm font-medium">{req.branch}</td>
                    <td className="px-6 py-4 text-sm">{req.item}</td>
                    <td className="px-6 py-4 font-black">{req.qty}</td>
                    <td className="px-6 py-4">
                      <Badge className={`rounded-full px-3 py-1 text-[10px] font-black uppercase ${
                        req.status === 'pending' ? 'bg-amber-500/10 text-amber-500' :
                        req.status === 'processing' ? 'bg-blue-500/10 text-blue-500' : 'bg-green-500/10 text-green-500'
                      }`}>
                        {req.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {req.status === 'pending' ? (
                        <Button size="sm" className="rounded-xl bg-primary" onClick={() => updateStatus(req.id, 'processing')}>
                          Start Processing
                        </Button>
                      ) : req.status === 'processing' ? (
                        <Button size="sm" className="rounded-xl bg-green-500 hover:bg-green-600" onClick={() => updateStatus(req.id, 'delivered')}>
                          Mark Delivered
                        </Button>
                      ) : (
                        <Button variant="ghost" size="sm" className="rounded-xl">View Details</Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

function SidebarLink({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <button className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${
      active ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
    }`}>
      {icon}
      {label}
    </button>
  );
}

function StatCard({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) {
  return (
    <div className="p-6 rounded-[2rem] border border-border bg-card shadow-sm hover:shadow-md transition-all">
      <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary grid place-items-center mb-4">
        {icon}
      </div>
      <h3 className="text-muted-foreground text-xs font-black uppercase tracking-widest">{title}</h3>
      <div className="text-2xl font-black mt-1">{value}</div>
    </div>
  );
}
