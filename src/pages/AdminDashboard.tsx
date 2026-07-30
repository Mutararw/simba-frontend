import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell
} from "recharts";
import { 
  Building2, Users, ShoppingBag, DollarSign, 
  MessageSquare, Shield, Globe, Search,
  ArrowUpRight, ArrowDownRight, Package, Truck,
  CheckCircle2, AlertCircle, Send, MoreVertical,
  Filter, Video, Trash2, Edit3, UserCheck, XCircle, 
  Mic, Plus, Check, RotateCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { BRANCHES } from "@/lib/branches";
import { api } from "@/lib/api";
import { User as UserType } from "@/lib/types";

// Mock data for admin
const BRANCH_STATS = [
  { id: "remera", name: "Remera", revenue: 1240000, orders: 145, manager: "Eric N." },
  { id: "kacyiru", name: "Kacyiru", revenue: 890000, orders: 98, manager: "Divine K." },
  { id: "kimironko", name: "Kimironko", revenue: 1120000, orders: 120, manager: "Sam M." },
];

const ALL_USERS = [
  { id: "1", name: "Eric N.", email: "eric@simba.com", role: "manager", branch: "Remera" },
  { id: "2", name: "Divine K.", email: "divine@simba.com", role: "manager", branch: "Kacyiru" },
  { id: "3", name: "Alice M.", email: "alice@gmail.com", role: "customer", branch: "None" },
  { id: "4", name: "John D.", email: "john@simba.com", role: "admin", branch: "Global" },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const [messageTarget, setMessageTarget] = useState<string>("all");
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    activeBranches: 0,
    totalUsers: 0,
    branchStats: [] as any[],
    topProducts: [] as any[],
    salesByCategory: [] as any[],
    recentTransactions: [] as any[]
  });
  const [users, setUsers] = useState<UserType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [globalInventory, setGlobalInventory] = useState<any[]>([]);
  const [pendingUsers, setPendingUsers] = useState<UserType[]>([]);
  const [isMeetingOpen, setIsMeetingOpen] = useState(false);
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [meetingTitle, setMeetingTitle] = useState("Simba Global Meeting");
  const [currentMeetingId, setCurrentMeetingId] = useState<string | null>(null);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    imageUrl: "",
    description: ""
  });

  const [allOrders, setAllOrders] = useState<any[]>([]);
  
  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchGlobalInventory();
    fetchPendingUsers();
    fetchAllOrders();
  }, []);

  const fetchAllOrders = async () => {
    try {
      const { data } = await api.get("/api/admin/orders");
      if (data) setAllOrders(data);
    } catch (err) {
      console.error("Failed to fetch orders");
    }
  };

  const updateOrderStatus = async (orderId: number, status: string) => {
    try {
      await api.patch(`/api/orders/${orderId}`, { status });
      toast.success(`Order #${orderId} marked as ${status}`);
      fetchAllOrders();
    } catch (err) {
      toast.error("Failed to update order status");
    }
  };

  const deleteOrder = async (orderId: number) => {
    if (!confirm("Delete this order permanently?")) return;
    try {
      await api.delete(`/api/admin/orders/${orderId}`);
      toast.success(`Order #${orderId} deleted`);
      fetchAllOrders();
    } catch (err) {
      toast.error("Failed to delete order");
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/api/products", {
        ...newProduct,
        price: Number(newProduct.price),
        stock: Number(newProduct.stock)
      });
      toast.success("Product added successfully");
      setIsAddProductOpen(false);
      setNewProduct({ name: "", category: "", price: "", stock: "", imageUrl: "", description: "" });
      fetchGlobalInventory();
    } catch (err) {
      toast.error("Failed to add product");
    }
  };

  const fetchPendingUsers = async () => {
    try {
      const { data } = await api.get("/api/admin/pending-users");
      if (data) setPendingUsers(data);
    } catch (err) {
      toast.error("Failed to fetch requests");
    }
  };

  const handleApprove = async (userId: string, approve: boolean) => {
    try {
      await api.post(`/api/admin/users/${userId}/approve`, { approve });
      toast.success(approve ? "User approved" : "Request denied");
      fetchPendingUsers();
      fetchUsers();
    } catch (err) {
      toast.error("Action failed");
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fetchStats = async () => {
    try {
      const { data } = await api.get("/api/admin/stats");
      if (data) setStats(data);
    } catch (err) {
      toast.error("Failed to fetch system statistics");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await api.get("/api/admin/users");
      if (data) setUsers(data);
    } catch (err) {
      toast.error("Failed to fetch users");
    }
  };

  const fetchGlobalInventory = async () => {
    try {
      const { data } = await api.get("/api/admin/inventory");
      if (data) setGlobalInventory(data);
    } catch (err) {
      toast.error("Failed to fetch global inventory");
    }
  };

  const handleUpdateRole = async (userId: string, accountType: string, branchId?: string) => {
    try {
      await api.patch(`/api/admin/users/${userId}/role`, { accountType, branchId });
      toast.success("User role updated successfully");
      fetchUsers();
    } catch (err) {
      toast.error("Failed to update user role");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/api/admin/users/${userId}`);
      toast.success("User deleted successfully");
      fetchUsers();
    } catch (err) {
      toast.error("Failed to delete user");
    }
  };

  const handleSendMessage = async () => {
    if (!messageText) return;
    try {
      await api.post("/api/chat/broadcast", {
        targetBranchId: messageTarget === "all" ? null : messageTarget,
        content: messageText
      });
      toast.success(`Message broadcasted successfully`);
      setMessageText("");
    } catch (err) {
      toast.error("Failed to send broadcast");
    }
  };

  const handleStartMeeting = async () => {
    if (selectedParticipants.length === 0) {
      toast.error("Please select at least one participant");
      return;
    }
    try {
      const { data } = await api.post("/api/meetings", {
        title: meetingTitle,
        participantIds: selectedParticipants
      });
      setCurrentMeetingId(data.id);
      setIsMeetingOpen(true);
      toast.success("Meeting started and invitations sent!");
    } catch (err) {
      toast.error("Failed to start meeting");
    }
  };

  const handleEndMeeting = async () => {
    if (!currentMeetingId) {
      setIsMeetingOpen(false);
      return;
    }
    try {
      await api.post(`/api/meetings/${currentMeetingId}/end`);
      setIsMeetingOpen(false);
      setCurrentMeetingId(null);
      setSelectedParticipants([]);
      toast.success("Meeting ended");
    } catch (err) {
      toast.error("Failed to end meeting");
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile Tab Nav */}
      <div className="lg:hidden overflow-x-auto no-scrollbar border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-30">
        <div className="flex gap-1 p-2 whitespace-nowrap">
          {[
            { id: "overview", icon: Globe, label: "Overview" },
            { id: "branches", icon: Building2, label: "Branches" },
            { id: "inventory", icon: Package, label: "Inventory" },
            { id: "orders", icon: ShoppingBag, label: "Orders" },
            { id: "requests", icon: UserCheck, label: "Requests", count: (pendingUsers || []).length },
            { id: "users", icon: Users, label: "Users" },
            { id: "suppliers", icon: Truck, label: "Suppliers" },
            { id: "broadcast", icon: MessageSquare, label: "Broadcast" },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                activeTab === tab.id ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
              {(tab as any).count ? <span className="ml-1 h-4 min-w-4 rounded-full bg-primary/20 px-1 text-[10px] font-bold">{tab.count}</span> : null}
            </button>
          ))}
        </div>
      </div>

      {/* Sidebar */}
      <div className="hidden lg:flex w-72 flex-col border-r border-border bg-card/50 backdrop-blur-xl">
        <div className="p-6">
          <div className="flex items-center gap-3 px-3 py-2 rounded-2xl bg-primary/10 text-primary">
            <Globe className="h-5 w-5" />
            <span className="font-bold text-sm">Global Administrator</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <SidebarLink icon={<Globe />} label="Overview" active={activeTab === "overview"} onClick={() => setActiveTab("overview")} />
          <SidebarLink icon={<Building2 />} label="Branches" active={activeTab === "branches"} onClick={() => setActiveTab("branches")} />
          <SidebarLink icon={<Package />} label="Inventory" active={activeTab === "inventory"} onClick={() => setActiveTab("inventory")} />
          <SidebarLink icon={<ShoppingBag />} label="Orders" active={activeTab === "orders"} onClick={() => setActiveTab("orders")} />
          <SidebarLink icon={<UserCheck />} label="Requests" active={activeTab === "requests"} onClick={() => setActiveTab("requests")} count={(pendingUsers || []).length} />
          <SidebarLink icon={<Users />} label="Users" active={activeTab === "users"} onClick={() => setActiveTab("users")} />
          <SidebarLink icon={<Truck />} label="Suppliers" active={activeTab === "suppliers"} onClick={() => setActiveTab("suppliers")} />
          <SidebarLink icon={<MessageSquare />} label="Broadcast" active={activeTab === "broadcast"} onClick={() => setActiveTab("broadcast")} />
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight">Global Dashboard</h1>
            <p className="text-muted-foreground mt-1">Real-time oversight of all Simba Supermarket operations.</p>
          </div>
          <div className="flex items-center gap-3">
             <Button variant="outline" className="rounded-xl h-12 gap-2 border-border" onClick={() => setIsMeetingOpen(true)}>
               <Video className="h-4 w-4" /> Full Meeting
             </Button>
             <Button className="rounded-xl h-12 px-6 bg-primary shadow-lg shadow-primary/20">
               Generate Global Report
             </Button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div 
              key="overview"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Revenue" value={`RWF ${((stats?.totalRevenue || 0)/1000000).toFixed(1)}M`} trend="+12.5%" icon={<DollarSign />} />
                <StatCard title="Total Orders" value={(stats?.totalOrders || 0).toString()} trend="+8.2%" icon={<ShoppingBag />} />
                <StatCard title="Total Stock" value={(globalInventory || []).reduce((acc, curr) => acc + (curr.stock || 0), 0).toString()} trend="In Store" icon={<Package />} />
                <StatCard title="Total Users" value={(stats?.totalUsers || 0).toString()} trend="+15.0%" icon={<Users />} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 p-8 rounded-[2.5rem] border border-border bg-card shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-bold">Branch Performance Comparison</h2>
                    <Button variant="ghost" size="sm" className="rounded-xl"><Filter className="h-4 w-4 mr-2" /> Filter</Button>
                  </div>
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={[
                        { time: "08:00", r: 1200, k: 800, ki: 950 },
                        { time: "10:00", r: 4500, k: 3200, ki: 3800 },
                        { time: "12:00", r: 12000, k: 9500, ki: 11000 },
                        { time: "14:00", r: 8000, k: 6000, ki: 7000 },
                        { time: "16:00", r: 15000, k: 12000, ki: 14000 },
                      ]}>
                        <defs>
                          <linearGradient id="colorR" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/><stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/></linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888822" />
                        <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888888' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888888' }} />
                        <Tooltip />
                        <Area type="monotone" dataKey="r" name="Remera" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorR)" strokeWidth={3} />
                        <Area type="monotone" dataKey="k" name="Kacyiru" stroke="#10b981" fill="transparent" strokeWidth={3} />
                        <Area type="monotone" dataKey="ki" name="Kimironko" stroke="#f59e0b" fill="transparent" strokeWidth={3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="p-8 rounded-[2.5rem] border border-border bg-card shadow-sm flex flex-col">
                  <h2 className="text-xl font-bold mb-6">Sales by Category</h2>
                  <div className="h-[250px] mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stats.salesByCategory || []}
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {(stats.salesByCategory || []).map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={['#fd7e14', '#10b981', '#f59e0b', '#3b82f6', '#8b5cf6'][index % 5]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-3">
                    {(stats.salesByCategory || []).map((cat: any, i: number) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: ['#fd7e14', '#10b981', '#f59e0b', '#3b82f6', '#8b5cf6'][i % 5] }} />
                          <span className="font-medium">{cat.name}</span>
                        </div>
                        <span className="font-black text-xs">RWF {(cat.value/1000).toFixed(0)}k</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Top Selling Products */}
                <div className="p-8 rounded-[2.5rem] border border-border bg-card shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-bold">Top Selling Products</h2>
                    <Button variant="ghost" size="sm" className="rounded-xl"><Package className="h-4 w-4 mr-2" /> Global</Button>
                  </div>
                  <div className="space-y-6">
                    {(stats.topProducts || []).map((p: any, i: number) => (
                      <div key={i} className="flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                           <div className="h-12 w-12 rounded-2xl bg-primary/5 flex items-center justify-center font-black text-primary">
                             {i + 1}
                           </div>
                           <div>
                             <div className="font-bold">{p.name}</div>
                             <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{p.category}</div>
                           </div>
                        </div>
                        <div className="text-right">
                          <div className="font-black">RWF {(p.revenue/1000).toFixed(0)}k</div>
                          <div className="text-[10px] font-bold text-green-500 uppercase">{p.salesCount} sold</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Global Transactions */}
                <div className="p-8 rounded-[2.5rem] border border-border bg-card shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-bold">Recent Global Activity</h2>
                    <Globe className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="space-y-4">
                    {(stats.recentTransactions || []).map((t: any) => (
                      <div key={t.id} className="p-4 rounded-2xl bg-muted/30 border border-border/50 flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <div className={`h-2 w-2 rounded-full ${t.status === 'completed' ? 'bg-green-500' : 'bg-amber-500'}`} />
                            <div>
                               <div className="text-xs font-bold">{t.customer}</div>
                               <div className="text-[10px] text-muted-foreground">{t.branch} Branch</div>
                            </div>
                         </div>
                         <div className="text-right">
                            <div className="text-xs font-black">RWF {t.amount.toLocaleString()}</div>
                            <div className="text-[10px] font-medium text-muted-foreground">{new Date(t.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                         </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "branches" && (
            <motion.div key="branches" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {(stats?.branchStats || []).map(b => (
                   <div key={b.id} className={`p-8 rounded-[2.5rem] border transition-all cursor-pointer ${
                     selectedBranch === b.id ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border hover:border-primary/50'
                   }`} onClick={() => setSelectedBranch(b.id)}>
                      <h3 className="text-xl font-black mb-1">{b.name}</h3>
                      <p className={`text-sm mb-4 ${selectedBranch === b.id ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                        Branch Location: {b.name}
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t border-current opacity-20">
                        <div>
                          <div className="text-[10px] font-bold uppercase">Revenue</div>
                          <div className="font-black">RWF {(b.revenue || 0).toLocaleString()}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] font-bold uppercase">Orders</div>
                          <div className="font-black">{b.orderCount || 0}</div>
                        </div>
                      </div>
                   </div>
                 ))}
               </div>

               {selectedBranch && (
                 <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8 rounded-[3rem] border border-border bg-card">
                   <div className="flex items-center justify-between mb-8">
                     <h2 className="text-2xl font-black">Detailed Inventory: {(stats?.branchStats || []).find(b => b.id === selectedBranch)?.name}</h2>
                     <Button variant="outline" className="rounded-xl border-border" onClick={() => setActiveTab("inventory")}>View Global Stock</Button>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {globalInventory.filter(i => i.branchId === selectedBranch).map((item, idx) => (
                        <InventoryItem 
                          key={idx}
                          name={item.name} 
                          stock={item.stock} 
                          status={item.stock < 10 ? "Restock Needed" : (item.stock < 25 ? "Critical" : "Healthy")} 
                        />
                      ))}
                      {globalInventory.filter(i => i.branchId === selectedBranch).length === 0 && (
                        <div className="col-span-full py-10 text-center text-muted-foreground">
                          No inventory data found for this branch.
                        </div>
                      )}
                   </div>
                 </motion.div>
               )}
            </motion.div>
          )}

          {activeTab === "requests" && (
            <motion.div key="requests" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
               <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-black">Account Requests</h2>
                  <Badge className="bg-primary/10 text-primary rounded-full px-4 py-1.5 font-bold">
                    {(pendingUsers || []).length} Pending
                  </Badge>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {(pendingUsers || []).map(u => (
                   <div key={u.id} className="p-8 rounded-[2.5rem] border border-border bg-card shadow-sm hover:shadow-md transition-all">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="h-14 w-14 rounded-2xl bg-primary/10 grid place-items-center text-primary text-xl font-black">
                          {u.name ? u.name[0].toUpperCase() : "?"}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{u.name}</h3>
                          <p className="text-sm text-muted-foreground">{u.email}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="p-4 rounded-2xl bg-muted/30">
                          <div className="text-[10px] font-black uppercase text-muted-foreground mb-1">Requested Role</div>
                          <div className="font-bold text-sm capitalize">{u.accountType}</div>
                        </div>
                        <div className="p-4 rounded-2xl bg-muted/30">
                          <div className="text-[10px] font-black uppercase text-muted-foreground mb-1">Branch</div>
                          <div className="font-bold text-sm">{(u as any).branch?.name || "N/A"}</div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button 
                          className="flex-1 h-12 rounded-xl bg-primary font-bold shadow-lg shadow-primary/20"
                          onClick={() => handleApprove(u.id, true)}
                        >
                          Approve Account
                        </Button>
                        <Button 
                          variant="outline"
                          className="flex-1 h-12 rounded-xl border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                          onClick={() => handleApprove(u.id, false)}
                        >
                          Deny
                        </Button>
                      </div>
                   </div>
                 ))}
                 {(pendingUsers || []).length === 0 && (
                   <div className="col-span-full py-20 text-center border-2 border-dashed border-border rounded-[3rem]">
                      <UserCheck className="h-16 w-16 mx-auto mb-4 opacity-20" />
                      <h3 className="text-xl font-bold">No Pending Requests</h3>
                      <p className="text-muted-foreground">All administrative accounts have been reviewed.</p>
                   </div>
                 )}
               </div>
            </motion.div>
          )}

          {activeTab === "inventory" && (
            <motion.div key="inventory" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex items-center justify-between mb-8">
                <div className="relative max-w-md flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search global stock..." 
                    className="pl-12 rounded-2xl h-12 bg-card border-border"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button className="rounded-xl h-12 bg-primary gap-2" onClick={() => setIsAddProductOpen(true)}>
                  <Plus className="h-4 w-4" /> Add New Product
                </Button>
                <Button className="rounded-xl h-12 bg-primary gap-2" onClick={fetchGlobalInventory}>
                  <Package className="h-4 w-4" /> Sync Inventory
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {globalInventory.filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase())).map((item, idx) => (
                  <div key={idx} className="p-6 rounded-[2.5rem] border border-border bg-card shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="h-14 w-14 rounded-2xl bg-primary/5 grid place-items-center text-primary overflow-hidden">
                        {item.imageUrl ? <img src={item.imageUrl} className="h-full w-full object-cover" /> : <Package className="h-6 w-6" />}
                      </div>
                      <div className="text-right">
                         <Badge className={`${item.stock < 20 ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'} rounded-full mb-1`}>
                           {item.stock} in stock
                         </Badge>
                         <div className="text-[10px] font-black uppercase text-muted-foreground">{item.branchName}</div>
                      </div>
                    </div>
                    <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                    <div className="text-xs font-bold text-muted-foreground mb-4">{item.category}</div>
                    
                    <div className="mt-6 flex items-center justify-between pt-4 border-t border-border">
                       <div>
                         <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Branch Status</div>
                         <div className={`font-black text-sm ${item.stock < 20 ? 'text-amber-500' : 'text-green-500'}`}>
                           {item.stock < 20 ? "Low Stock" : "Healthy"}
                         </div>
                       </div>
                       <div className="text-right">
                         <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Unit Price</div>
                         <div className="font-black text-primary">RWF {Number(item.price).toLocaleString()}</div>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "orders" && (
            <motion.div key="orders" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black">Order Management</h2>
                <Button className="rounded-xl h-12 bg-primary gap-2" onClick={fetchAllOrders}>
                  <RotateCcw className="h-4 w-4" /> Refresh Orders
                </Button>
              </div>

              <div className="grid gap-6">
                {allOrders.map(order => (
                  <div key={order.id} className="p-6 rounded-[2rem] border border-border bg-card shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                      <div className="flex items-center gap-4">
                         <div className="h-12 w-12 rounded-2xl bg-primary/5 flex items-center justify-center">
                           <ShoppingBag className="h-6 w-6 text-primary" />
                         </div>
                         <div>
                           <div className="font-bold text-lg">Order #{order.id}</div>
                           <div className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleString()}</div>
                         </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`${
                          order.status === 'Delivered' ? 'bg-green-500' : 'bg-amber-500'
                        } rounded-full`}>
                          {order.status}
                        </Badge>
                        <Badge variant="outline" className="rounded-full">
                          {order.orderType}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 mb-6">
                      <div>
                        <div className="text-[10px] font-black uppercase text-muted-foreground mb-1">Customer</div>
                        <div className="font-bold text-sm">{order.userId}</div>
                        <div className="text-xs text-muted-foreground">{order.phone}</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-black uppercase text-muted-foreground mb-1">Total Amount</div>
                        <div className="font-black text-primary text-lg">RWF {Number(order.totalAmount).toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-black uppercase text-muted-foreground mb-1">Delivery Info</div>
                        <div className="text-sm font-medium">{order.address || order.branchId || "N/A"}</div>
                        <div className="text-xs text-muted-foreground">{order.zone || order.pickupTime}</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 pt-6 border-t border-border">
                      <Button 
                        disabled={order.status === 'Confirmed'}
                        className="rounded-xl h-11 bg-blue-600 hover:bg-blue-700 gap-2"
                        onClick={() => updateOrderStatus(order.id, 'Confirmed')}
                      >
                        <Check className="h-4 w-4" /> Confirm Order
                      </Button>
                      <Button 
                        disabled={order.status === 'Packed'}
                        className="rounded-xl h-11 bg-orange-500 hover:bg-orange-600 gap-2"
                        onClick={() => updateOrderStatus(order.id, 'Packed')}
                      >
                        <Package className="h-4 w-4" /> Mark as Packed
                      </Button>
                      <Button 
                        disabled={order.status === 'Out for Delivery'}
                        className="rounded-xl h-11 bg-indigo-600 hover:bg-indigo-700 gap-2"
                        onClick={() => updateOrderStatus(order.id, 'Out for Delivery')}
                      >
                        <Truck className="h-4 w-4" /> Out for Delivery
                      </Button>
                      <Button 
                        disabled={order.status === 'Delivered'}
                        className="rounded-xl h-11 bg-green-600 hover:bg-green-700 gap-2"
                        onClick={() => updateOrderStatus(order.id, 'Delivered')}
                      >
                        <CheckCircle2 className="h-4 w-4" /> Mark Delivered
                      </Button>
                      {order.status === 'Delivered' && (
                        <Button 
                          className="rounded-xl h-11 bg-red-600 hover:bg-red-700 gap-2 ml-auto"
                          onClick={() => deleteOrder(order.id)}
                        >
                          <Trash2 className="h-4 w-4" /> Delete
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                {allOrders.length === 0 && (
                  <div className="py-20 text-center border-2 border-dashed border-border rounded-[3rem]">
                    <ShoppingBag className="h-16 w-16 mx-auto mb-4 opacity-20" />
                    <h3 className="text-xl font-bold">No Orders Found</h3>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === "users" && (
            <motion.div key="users" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
               <div className="flex items-center justify-between mb-8">
                <div className="relative max-w-md flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search users by name or email..." 
                    className="pl-12 rounded-2xl h-12 bg-card border-border"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button className="rounded-xl h-12 bg-primary gap-2" onClick={fetchUsers}>
                  <Shield className="h-4 w-4" /> Refresh Users
                </Button>
              </div>

               <div className="rounded-[2.5rem] border border-border bg-card overflow-hidden overflow-x-auto">
                <table className="w-full text-left min-w-[600px]">
                  <thead className="bg-muted/30 border-b border-border">
                    <tr>
                      <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-muted-foreground">User</th>
                      <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-muted-foreground">Role</th>
                      <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-muted-foreground">Branch</th>
                      <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-muted-foreground">Joined</th>
                      <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredUsers.map(u => (
                      <tr key={u.id} className="hover:bg-muted/10 transition-colors">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-primary/10 grid place-items-center font-bold text-primary">{u.name ? u.name[0] : "?"}</div>
                            <div>
                              <div className="font-bold text-sm">{u.name}</div>
                              <div className="text-xs text-muted-foreground">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <select 
                            className="bg-transparent border-none text-sm font-bold focus:ring-0 cursor-pointer"
                            value={u.accountType}
                            onChange={(e) => handleUpdateRole(u.id, e.target.value, u.branchId)}
                          >
                            <option value="user">Customer</option>
                            <option value="manager">Manager</option>
                            <option value="admin">Admin</option>
                            <option value="supplier">Supplier</option>
                          </select>
                        </td>
                        <td className="px-8 py-6 text-sm font-medium">
                          <select 
                            className="bg-transparent border-none text-sm font-medium focus:ring-0 cursor-pointer"
                            value={u.branchId || ""}
                            onChange={(e) => handleUpdateRole(u.id, u.accountType || "user", e.target.value)}
                          >
                            <option value="">Global / None</option>
                            {BRANCHES.map(b => (
                              <option key={b.id} value={b.id}>{b.name}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-8 py-6">
                           <span className="text-sm text-muted-foreground">
                             {new Date((u as any).createdAt).toLocaleDateString()}
                           </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="rounded-xl text-red-500 hover:bg-red-500/10"
                              onClick={() => handleDeleteUser(u.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === "suppliers" && (
            <motion.div key="suppliers" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black">Global Supplier Network</h2>
                <Button className="rounded-xl h-12 bg-primary gap-2">
                  <Truck className="h-4 w-4" /> Add Global Supplier
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { name: "Inyange Industries", contact: "inyange@rw.com", category: "Dairy", branch: "All" },
                  { name: "Bakhresa Group", contact: "bakhresa@group.com", category: "Grains", branch: "Remera" },
                  { name: "Sulfo Rwanda", contact: "sulfo@rw.com", category: "Hygiene", branch: "Kacyiru" },
                ].map((sup, i) => (
                  <div key={i} className="p-8 rounded-[2.5rem] border border-border bg-card shadow-sm hover:border-primary/50 transition-all">
                    <div className="flex items-center justify-between mb-6">
                      <div className="h-16 w-16 rounded-3xl bg-primary/5 grid place-items-center">
                        <Truck className="h-8 w-8 text-primary" />
                      </div>
                      <Badge className="rounded-full bg-secondary text-secondary-foreground">{sup.branch} Branch</Badge>
                    </div>
                    <h3 className="text-xl font-bold mb-1">{sup.name}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{sup.contact}</p>
                    <div className="flex items-center gap-2 mb-6">
                      <Badge variant="outline" className="rounded-full border-primary/20 text-primary">{sup.category}</Badge>
                    </div>
                    <div className="pt-6 border-t border-border flex gap-3">
                      <Button className="flex-1 rounded-xl gap-2" onClick={() => toast.success(`Chatting with ${sup.name}...`)}>
                        <MessageSquare className="h-4 w-4" /> Chat
                      </Button>
                      <Button variant="outline" className="flex-1 rounded-xl">Details</Button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "broadcast" && (
            <motion.div key="broadcast" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto space-y-8">
               <div className="p-8 rounded-[3rem] border border-border bg-card shadow-2xl">
                 <h2 className="text-2xl font-black mb-6">Send Broadcast Message</h2>
                 <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Recipient Group</label>
                      <select 
                        className="w-full h-14 rounded-2xl bg-muted/50 border-none px-6 font-bold focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
                        value={messageTarget}
                        onChange={(e) => setMessageTarget(e.target.value)}
                      >
                        <option value="all">All Branch Managers</option>
                        {BRANCHES.map(b => (
                          <option key={b.id} value={b.name}>{b.name} Manager</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Message Content</label>
                       <textarea 
                         className="w-full min-h-[150px] rounded-[2rem] bg-muted/50 border-none p-6 font-medium focus:ring-2 focus:ring-primary"
                         placeholder="Type your important announcement here..."
                         value={messageText}
                         onChange={(e) => setMessageText(e.target.value)}
                       />
                    </div>
                    <Button 
                      className="w-full h-14 rounded-2xl bg-primary text-base font-bold gap-3 shadow-xl shadow-primary/20"
                      onClick={handleSendMessage}
                    >
                      <Send className="h-5 w-5" />
                      Dispatch Message
                    </Button>
                 </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Product Modal */}
        <AnimatePresence>
          {isAddProductOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                onClick={() => setIsAddProductOpen(false)}
              />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                className="relative w-full max-w-lg rounded-[3rem] bg-card border border-border shadow-2xl overflow-hidden"
              >
                <div className="p-8 border-b border-border flex items-center justify-between">
                   <h2 className="text-2xl font-black">Add New Product</h2>
                   <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setIsAddProductOpen(false)}>
                     <XCircle className="h-6 w-6" />
                   </Button>
                </div>
                
                <form onSubmit={handleAddProduct} className="p-8 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Product Name</label>
                      <Input 
                        required
                        className="rounded-xl h-12 bg-muted/30 border-none"
                        placeholder="e.g. Simba Rice"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Category</label>
                      <select 
                        required
                        className="w-full h-12 rounded-xl bg-muted/30 border-none px-4 font-bold focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                      >
                        <option value="">Select Category</option>
                        <option value="Groceries">Groceries</option>
                        <option value="Dairy">Dairy</option>
                        <option value="Bakery">Bakery</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Household">Household</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Price (RWF)</label>
                      <Input 
                        required
                        type="number"
                        className="rounded-xl h-12 bg-muted/30 border-none"
                        placeholder="0"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Initial Stock</label>
                      <Input 
                        required
                        type="number"
                        className="rounded-xl h-12 bg-muted/30 border-none"
                        placeholder="0"
                        value={newProduct.stock}
                        onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Image URL</label>
                    <Input 
                      className="rounded-xl h-12 bg-muted/30 border-none"
                      placeholder="https://example.com/image.jpg"
                      value={newProduct.imageUrl}
                      onChange={(e) => setNewProduct({...newProduct, imageUrl: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Description</label>
                    <textarea 
                      className="w-full min-h-[100px] rounded-2xl bg-muted/30 border-none p-4 font-medium focus:ring-2 focus:ring-primary"
                      placeholder="Product details..."
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    />
                  </div>

                  <Button type="submit" className="w-full h-14 rounded-2xl bg-primary text-base font-bold gap-3 shadow-xl shadow-primary/20">
                    <Plus className="h-5 w-5" />
                    Create Product
                  </Button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Meeting Modal */}
        <AnimatePresence>
          {isMeetingOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                onClick={handleEndMeeting}
              />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                className="relative w-full max-w-4xl rounded-[3rem] bg-card border-4 border-primary shadow-2xl overflow-hidden flex flex-col mx-4 md:mx-0"
              >
                {!currentMeetingId ? (
                  <div className="flex-1 p-8 flex flex-col overflow-hidden">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-3xl font-black">Prepare Meeting</h2>
                        <p className="text-muted-foreground">Select participants to invite to the Simba Global Meeting.</p>
                      </div>
                      <Button className="rounded-2xl h-12 px-8 bg-primary font-bold" onClick={handleStartMeeting}>
                        Start Meeting & Notify All
                      </Button>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-4 space-y-2">
                       {users.filter(u => u.accountType !== 'user').map(u => (
                         <div 
                           key={u.id} 
                           className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                             selectedParticipants.includes(u.id) ? 'border-primary bg-primary/5' : 'border-border bg-muted/20'
                           }`}
                           onClick={() => {
                             if (selectedParticipants.includes(u.id)) {
                               setSelectedParticipants(selectedParticipants.filter(id => id !== u.id));
                             } else {
                               setSelectedParticipants([...selectedParticipants, u.id]);
                             }
                           }}
                         >
                            <div className="flex items-center gap-4">
                               <div className="h-10 w-10 rounded-full bg-primary/10 grid place-items-center font-bold text-primary">{u.name ? u.name[0] : "?"}</div>
                               <div>
                                 <div className="font-bold">{u.name}</div>
                                 <div className="text-xs text-muted-foreground">{u.email} - <span className="capitalize">{u.accountType}</span></div>
                               </div>
                            </div>
                            {selectedParticipants.includes(u.id) ? <Check className="text-primary" /> : <Plus className="text-muted-foreground" />}
                         </div>
                       ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 bg-neutral-900 relative">
                     <div className="absolute inset-0 grid grid-cols-3 gap-2 p-4 opacity-40">
                        {selectedParticipants.map(i => (
                          <div key={i} className="rounded-2xl bg-neutral-800 flex flex-col items-center justify-center gap-2">
                             <div className="h-12 w-12 rounded-full bg-neutral-700 animate-pulse" />
                             <div className="h-2 w-16 bg-neutral-700 rounded-full" />
                          </div>
                        ))}
                     </div>
                     <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center">
                        <div className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center mb-6 border-2 border-primary/50 animate-bounce">
                           <Video className="h-10 w-10 text-primary" />
                        </div>
                        <h2 className="text-3xl font-black mb-2">{meetingTitle}</h2>
                        <p className="text-white/60 font-medium">Meeting is live! Participants are joining...</p>
                     </div>
                  </div>
                )}
                <div className="h-24 bg-card border-t border-border flex items-center justify-center gap-4 px-8">
                   <Button variant="outline" size="icon" className="rounded-full h-12 w-12 hover:bg-red-500 hover:text-white transition-colors" onClick={handleEndMeeting}>
                      <XCircle className="h-6 w-6" />
                   </Button>
                   <Button variant="outline" size="icon" className="rounded-full h-12 w-12">
                      <Mic className="h-6 w-6" />
                   </Button>
                   <div className="h-8 w-px bg-border mx-2" />
                   <Button className="rounded-2xl h-12 px-8 bg-red-500 hover:bg-red-600 text-white font-bold" onClick={handleEndMeeting}>
                      {currentMeetingId ? "End Meeting for All" : "Cancel Preparation"}
                   </Button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function SidebarLink({ icon, label, active, onClick, count }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void, count?: number }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl font-bold text-sm transition-all ${
        active 
          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
      }`}
    >
      <div className="flex items-center gap-4">
        <span className={active ? "text-primary-foreground" : "text-muted-foreground"}>{icon}</span>
        {label}
      </div>
      {count ? (
        <span className={`px-2 py-0.5 rounded-full text-[10px] ${active ? 'bg-white text-primary' : 'bg-primary text-white'}`}>
          {count}
        </span>
      ) : null}
    </button>
  );
}

function StatCard({ title, value, trend, icon }: { title: string, value: string, trend: string, icon: React.ReactNode }) {
  const isPositive = trend.startsWith('+');
  return (
    <div className="p-6 rounded-[2rem] border border-border bg-card shadow-sm hover:shadow-md transition-all group">
      <div className="flex items-center justify-between mb-4">
        <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary grid place-items-center group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-xs font-black ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          {trend}
        </div>
      </div>
      <h3 className="text-muted-foreground text-xs font-black uppercase tracking-widest">{title}</h3>
      <div className="text-2xl font-black mt-1">{value}</div>
    </div>
  );
}

function InventoryItem({ name, stock, status }: { name: string, stock: number, status: string }) {
  const colorMap: Record<string, string> = {
    "Healthy": "text-green-500 bg-green-500/10",
    "Critical": "text-amber-500 bg-amber-500/10",
    "Restock Needed": "text-red-500 bg-red-500/10"
  };
  return (
    <div className="p-6 rounded-3xl bg-muted/30 border border-border/50">
      <div className="flex items-center justify-between mb-4">
        <div className="h-10 w-10 rounded-xl bg-background border border-border grid place-items-center">
          <Package className="h-5 w-5 text-primary" />
        </div>
        <Badge className={`rounded-full ${colorMap[status]}`}>{status}</Badge>
      </div>
      <div className="font-bold">{name}</div>
      <div className="text-2xl font-black mt-1">{stock} <span className="text-xs font-normal text-muted-foreground">units</span></div>
    </div>
  );
}
