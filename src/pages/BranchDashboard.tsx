import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import { 
  ShoppingBag, Users, Package, Truck, MessageSquare, 
  Search, CheckCircle2, XCircle, Clock, Plus, 
  Settings, UserPlus, TrendingUp, DollarSign,
  ChevronRight, ArrowUpRight, ArrowDownRight, Store, Trash2, Video, Mic, Filter
} from "lucide-react";
import { useAuth } from "@/store/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { api } from "@/lib/api";
import { BRANCHES } from "@/lib/branches";

// Mock data for the branch manager experience
const MOCK_ORDERS = [
  { id: "ORD-101", customer: "Jean Paul", type: "pickup", status: "pending", items: 3, total: 45000, date: "2024-04-27T10:30:00" },
  { id: "ORD-102", customer: "Alice Umutoni", type: "shopping", status: "completed", items: 5, total: 12500, date: "2024-04-27T11:15:00" },
  { id: "ORD-103", customer: "David Kabera", type: "pickup", status: "accepted", items: 2, total: 8900, date: "2024-04-27T12:00:00" },
  { id: "ORD-104", customer: "Sarah Keza", type: "shopping", status: "pending", items: 8, total: 67400, date: "2024-04-27T12:45:00" },
];

const MOCK_INVENTORY = [
  { id: 1, name: "Basmati Rice 5kg", price: 8500, stock: 45, sold: 120, category: "Grains" },
  { id: 2, name: "Cooking Oil 3L", price: 12000, stock: 8, sold: 85, category: "Oils" },
  { id: 3, name: "Milk Powder 1kg", price: 15400, stock: 24, sold: 60, category: "Dairy" },
  { id: 4, name: "Fresh Strawberries", price: 3500, stock: 5, sold: 40, category: "Fruits" },
];

const MOCK_SUPPLIERS = [
  { id: "SUP-1", name: "Inyange Industries", contact: "Inyange@support.rw", category: "Dairy" },
  { id: "SUP-2", name: "Bakhresa Group", contact: "sales@bakhresa.com", category: "Grains" },
];

const MOCK_STAFF = [
  { id: "USR-1", name: "John Doe", email: "john@simba.com", role: "cashier" },
  { id: "USR-2", name: "Jane Smith", email: "jane@simba.com", role: "inventory" },
];

export default function BranchDashboard() {
  const user = useAuth(s => s.user);
  const [activeTab, setActiveTab] = useState("overview");
  const [orders, setOrders] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>(MOCK_SUPPLIERS);
  const [chatUser, setChatUser] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({
    revenue: 0,
    ordersCount: 0,
    stockCount: 0,
    staffCount: 0,
    customersCount: 0,
    salesOverTime: [] as any[]
  });
  const [loading, setLoading] = useState(true);
  const [isMeetingOpen, setIsMeetingOpen] = useState(false);

  useEffect(() => {
    if (user?.branchId) {
      fetchBranchData();
    }
  }, [user?.branchId]);

  const fetchBranchData = async () => {
    setLoading(true);
    try {
      const [statsRes, ordersRes, inventoryRes, usersRes, customersRes] = await Promise.all([
        api.get("/api/branches/stats"),
        api.get("/api/orders/branch"),
        api.get("/api/branches/inventory"),
        api.get("/api/branches/users"),
        api.get("/api/branches/customers")
      ]);
      
      setStats(statsRes.data);
      setOrders(ordersRes.data);
      setInventory(inventoryRes.data);
      setStaff(usersRes.data);
      setCustomers(customersRes.data);
    } catch (err) {
      toast.error("Failed to fetch branch data");
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptPickup = async (orderId: string) => {
    try {
      await api.patch(`/api/orders/${orderId}`, { 
        status: 'accepted',
        isAccepted: true 
      });
      toast.success(`Order #${orderId} accepted! Customer notified.`);
      fetchBranchData();
    } catch (err) {
      toast.error("Failed to accept order");
    }
  };

  const handleRemoveStaff = async (userId: string) => {
    if (!confirm("Remove this staff member from your branch?")) return;
    try {
      await api.delete(`/api/branches/users/${userId}`);
      toast.success("Staff member removed");
      fetchBranchData();
    } catch (err) {
      toast.error("Failed to remove staff");
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-background">
      {/* Sidebar */}
      <div className="hidden lg:flex w-72 flex-col border-r border-border bg-card/50 backdrop-blur-xl">
        <div className="p-6">
          <div className="flex items-center gap-3 px-3 py-2 rounded-2xl bg-primary/10 text-primary">
            <Store className="h-5 w-5" />
            <span className="font-bold text-sm">Branch Manager</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <SidebarLink icon={<TrendingUp />} label="Overview" active={activeTab === "overview"} onClick={() => setActiveTab("overview")} />
          <SidebarLink icon={<ShoppingBag />} label="Orders" active={activeTab === "orders"} onClick={() => setActiveTab("orders")} />
          <SidebarLink icon={<DollarSign />} label="Payments" active={activeTab === "payments"} onClick={() => setActiveTab("payments")} />
          <SidebarLink icon={<Package />} label="Inventory" active={activeTab === "inventory"} onClick={() => setActiveTab("inventory")} />
          <SidebarLink icon={<Users />} label="Team" active={activeTab === "team"} onClick={() => setActiveTab("team")} />
          <SidebarLink icon={<UserPlus />} label="Customers" active={activeTab === "customers"} onClick={() => setActiveTab("customers")} />
          <SidebarLink icon={<Truck />} label="Suppliers" active={activeTab === "suppliers"} onClick={() => setActiveTab("suppliers")} />
          <SidebarLink icon={<MessageSquare />} label="Messages" active={activeTab === "chat"} onClick={() => setActiveTab("chat")} />
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <header className="mb-8 flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Managing {user?.branchId || "Branch"} Performance</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="rounded-xl gap-2 h-11 border-border bg-card" onClick={() => setIsMeetingOpen(true)}>
              <Video className="h-4 w-4" />
              Join Meeting
            </Button>
            <Button className="rounded-xl h-11 gap-2 bg-primary shadow-lg shadow-primary/20">
              <ArrowUpRight className="h-4 w-4" />
              Export Report
            </Button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div 
              key="overview"
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-6">
                <StatCard title="Total Sales" value={`RWF ${(stats?.revenue || 0).toLocaleString()}`} trend="Real-time" icon={<DollarSign />} />
                <StatCard title="Total Orders" value={(stats?.ordersCount || 0).toString()} trend="Global" icon={<ShoppingBag />} />
                <StatCard title="Total Customers" value={(stats?.customersCount || 0).toString()} trend="Active" icon={<UserPlus />} />
                <StatCard title="Products in Store" value={(inventory || []).reduce((acc, curr) => acc + (curr.stock || 0), 0).toString()} trend="Current Stock" icon={<Package />} />
                <StatCard title="Branch Staff" value={(stats?.staffCount || 0).toString()} trend="Team" icon={<Users />} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sales Chart */}
                <div className="lg:col-span-2 p-6 rounded-[2rem] border border-border bg-card shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-bold">Sales Performance</h2>
                    <select className="bg-transparent text-sm font-bold focus:outline-none">
                      <option>Last 7 Days</option>
                      <option>Last 30 Days</option>
                    </select>
                  </div>
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { name: "Mon", val: 45000 }, { name: "Tue", val: 52000 },
                        { name: "Wed", val: 48000 }, { name: "Thu", val: 61000 },
                        { name: "Fri", val: 55000 }, { name: "Sat", val: 89000 },
                        { name: "Sun", val: 72000 }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888822" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888888' }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888888' }} />
                        <Tooltip cursor={{ fill: '#88888811' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
                        <Bar dataKey="val" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} barSize={40} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Stock Distribution */}
                <div className="p-6 rounded-[2rem] border border-border bg-card shadow-sm">
                  <h2 className="text-xl font-bold mb-8">Stock Health</h2>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: "In Stock", value: 75 },
                            { name: "Low Stock", value: 15 },
                            { name: "Out of Stock", value: 10 }
                          ]}
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          <Cell fill="#10b981" />
                          <Cell fill="#f59e0b" />
                          <Cell fill="#ef4444" />
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-4 mt-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-green-500" /> Healthy</div>
                      <span className="font-bold">75%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-amber-500" /> Critical</div>
                      <span className="font-bold">15%</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "orders" && (
            <motion.div 
              key="orders"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="space-y-6"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search orders..." 
                    className="pl-12 rounded-2xl h-12 bg-card border-border" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                  <Badge variant="secondary" className="px-4 py-2 rounded-full cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors">All</Badge>
                  <Badge variant="outline" className="px-4 py-2 rounded-full cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors border-border">Pickup</Badge>
                  <Badge variant="outline" className="px-4 py-2 rounded-full cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors border-border">Shopping</Badge>
                </div>
              </div>

              <div className="rounded-[2rem] border border-border bg-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-muted/30 border-b border-border">
                      <tr>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Order ID</th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Customer</th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Type</th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Total</th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-muted/10 transition-colors group">
                           <td className="px-6 py-4 font-bold text-sm">#{order.id}</td>
                           <td className="px-6 py-4 text-sm font-medium">{order.customerName || "Customer"}</td>
                           <td className="px-6 py-4 capitalize">
                             <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                               order.orderType === 'pickup' ? 'bg-indigo-500/10 text-indigo-500' : 'bg-cyan-500/10 text-cyan-500'
                             }`}>
                               {order.orderType}
                             </span>
                           </td>
                           <td className="px-6 py-4 capitalize">
                              <div className="flex items-center gap-2">
                                {order.status === 'pending' && <Clock className="h-3 w-3 text-amber-500" />}
                                {order.status === 'accepted' && <CheckCircle2 className="h-3 w-3 text-green-500" />}
                                <span className={`text-sm font-bold ${
                                  order.status === 'pending' ? 'text-amber-500' : 'text-green-500'
                                }`}>{order.status}</span>
                              </div>
                           </td>
                           <td className="px-6 py-4 font-black text-sm">RWF {Number(order.totalAmount).toLocaleString()}</td>
                           <td className="px-6 py-4 text-right">
                             {order.orderType === 'pickup' && order.status === 'pending' ? (
                               <Button 
                                 size="sm" 
                                 className="rounded-xl bg-green-500 hover:bg-green-600 shadow-lg shadow-green-500/20"
                                 onClick={() => handleAcceptPickup(order.id)}
                               >
                                 Accept Pickup
                               </Button>
                             ) : (
                               <Button variant="ghost" size="icon" className="rounded-xl">
                                 <ChevronRight className="h-4 w-4" />
                               </Button>
                             )}
                           </td>
                         </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "payments" && (
            <motion.div key="payments" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
               <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-black">Transaction History</h2>
                  <div className="flex gap-2">
                    <Button variant="outline" className="rounded-xl h-10 border-border"><Filter className="h-4 w-4 mr-2" /> Filter</Button>
                  </div>
               </div>

               <div className="rounded-[2.5rem] border border-border bg-card overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-muted/30 border-b border-border">
                      <tr>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Order ID</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Customer</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Amount</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Method</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {(orders || []).map(order => (
                        <tr key={order?.id} className="hover:bg-muted/10 transition-colors">
                          <td className="px-8 py-6">
                            <span className="font-black text-xs text-primary">#{order?.id}</span>
                          </td>
                          <td className="px-8 py-6">
                            <div className="font-bold text-sm">{(order as any)?.customerName || "Guest"}</div>
                            <div className="text-[10px] text-muted-foreground">{(order as any)?.phone || "No phone"}</div>
                          </td>
                          <td className="px-8 py-6">
                            <span className="font-black text-sm">RWF {Number(order?.totalAmount || 0).toLocaleString()}</span>
                          </td>
                          <td className="px-8 py-6">
                            <Badge variant="outline" className="rounded-full font-black uppercase text-[9px] border-primary/20 text-primary">
                              {order?.paymentMethod || "momo"}
                            </Badge>
                          </td>
                          <td className="px-8 py-6">
                            <Badge className={`rounded-full px-3 py-1 text-[10px] font-black uppercase ${
                              (order as any)?.paymentStatus === 'paid' ? 'bg-green-500/10 text-green-500' :
                              (order as any)?.paymentStatus === 'failed' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'
                            }`}>
                              {(order as any)?.paymentStatus || "pending"}
                            </Badge>
                          </td>
                          <td className="px-8 py-6 text-sm text-muted-foreground font-medium">
                            {order?.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
               </div>
            </motion.div>
          )}

          {activeTab === "inventory" && (
            <motion.div key="inventory" className="space-y-6">
              <div className="flex items-center justify-between mb-8">
                <div className="relative max-w-sm flex-1">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                   <Input placeholder="Search stock..." className="pl-12 rounded-2xl h-12 bg-card" />
                </div>
                <Button className="rounded-xl gap-2 bg-primary">
                  <Plus className="h-4 w-4" />
                  Add Product
                </Button>
              </div>

               <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                 {(inventory || []).map(item => (
                  <div key={item?.productId} className="p-6 rounded-[2rem] border border-border bg-card shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="h-12 w-12 rounded-2xl bg-primary/5 grid place-items-center text-primary overflow-hidden">
                        {item?.imageUrl ? <img src={item.imageUrl} className="h-full w-full object-cover" /> : <Package className="h-6 w-6" />}
                      </div>
                      <Badge className={`${(item?.stock || 0) < 10 ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'} rounded-full`}>
                        {item?.stock || 0} in store
                      </Badge>
                    </div>
                    <h3 className="font-bold text-lg mb-1">{item?.name || "Unnamed Product"}</h3>
                    
                    <div className="mt-6 flex items-center justify-between pt-4 border-t border-border">
                       <div>
                         <div className="text-[10px] font-bold text-muted-foreground uppercase">Status</div>
                         <div className="font-black text-sm">{(item?.stock || 0) < 10 ? "Critical" : "Healthy"}</div>
                       </div>
                       <div className="flex flex-col items-end gap-2">
                         <div className="text-right">
                           <div className="text-[10px] font-bold text-muted-foreground uppercase">Price</div>
                           <div className="font-black text-primary">RWF {Number(item?.price || 0).toLocaleString()}</div>
                         </div>
                         <Button size="sm" variant="outline" className="rounded-lg h-8 text-[10px] font-bold border-primary/20 text-primary hover:bg-primary/5" onClick={() => toast.success(`Restock request sent for ${item?.name || "Product"}`)}>
                           Restock
                         </Button>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "team" && (
             <motion.div key="team" className="max-w-4xl mx-auto space-y-6">
               <div className="flex items-center justify-between">
                 <h2 className="text-2xl font-black">Branch Staff</h2>
                 <Button className="rounded-xl gap-2 h-12 bg-primary">
                   <UserPlus className="h-4 w-4" />
                   Add Staff
                 </Button>
               </div>
                <div className="space-y-4">
                  {(staff || []).map(s => (
                    <div key={s?.id} className="flex items-center justify-between p-6 rounded-[2rem] border border-border bg-card">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-full bg-primary/10 grid place-items-center font-bold text-primary text-xl">
                          {s?.name ? s.name[0] : "?"}
                        </div>
                        <div>
                          <h3 className="font-bold">{s.name}</h3>
                          <p className="text-sm text-muted-foreground">{s.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge className="rounded-full bg-secondary text-secondary-foreground font-black px-4 py-1 uppercase tracking-widest text-[10px]">
                          {s.accountType}
                        </Badge>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="rounded-xl text-red-500 hover:bg-red-500/10"
                          onClick={() => handleRemoveStaff(s.id)}
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
             </motion.div>
          )}

          {activeTab === "customers" && (
             <motion.div key="customers" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
               <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-black">Branch Customers</h2>
                  <div className="relative max-w-md flex-1 ml-8">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search customers..." 
                      className="pl-12 rounded-2xl h-12 bg-card border-border"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
               </div>

               <div className="rounded-[2.5rem] border border-border bg-card overflow-hidden">
                 <table className="w-full text-left">
                   <thead className="bg-muted/30 border-b border-border">
                     <tr>
                       <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-muted-foreground">Customer</th>
                       <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-muted-foreground">Email</th>
                       <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-muted-foreground">Last Order</th>
                       <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-muted-foreground">Joined</th>
                       <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">Actions</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-border">
                     {customers.filter(c => 
                       c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                       c.email.toLowerCase().includes(searchQuery.toLowerCase())
                     ).map(c => (
                       <tr key={c.id} className="hover:bg-muted/10 transition-colors">
                         <td className="px-8 py-6">
                           <div className="flex items-center gap-4">
                             <div className="h-10 w-10 rounded-full bg-primary/10 grid place-items-center font-bold text-primary">
                               {c.name ? c.name[0].toUpperCase() : "?"}
                             </div>
                             <div className="font-bold text-sm">{c.name}</div>
                           </div>
                         </td>
                         <td className="px-8 py-6 text-sm">{c.email}</td>
                         <td className="px-8 py-6 text-sm">
                            {c.lastOrderDate ? new Date(c.lastOrderDate).toLocaleDateString() : "N/A"}
                         </td>
                         <td className="px-8 py-6 text-sm text-muted-foreground">
                            {new Date(c.createdAt).toLocaleDateString()}
                         </td>
                         <td className="px-8 py-6 text-right">
                           <Button variant="ghost" size="sm" className="rounded-xl hover:bg-primary/10 hover:text-primary">
                             View Orders
                           </Button>
                         </td>
                       </tr>
                     ))}
                     {customers.length === 0 && (
                       <tr>
                         <td colSpan={5} className="py-20 text-center text-muted-foreground">
                           No customers found for this branch.
                         </td>
                       </tr>
                     )}
                   </tbody>
                 </table>
               </div>
             </motion.div>
          )}

          {activeTab === "suppliers" && (
            <motion.div key="suppliers" className="space-y-8">
               <div className="flex items-center justify-between">
                 <div>
                   <h2 className="text-2xl font-black">Suppliers</h2>
                   <p className="text-muted-foreground">Manage relationships and procurement</p>
                 </div>
                 <Button className="rounded-xl h-12 bg-primary gap-2">
                   <Truck className="h-4 w-4" />
                   Register Supplier
                 </Button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {suppliers.map(sup => (
                   <div key={sup.id} className="p-8 rounded-[2.5rem] border border-border bg-card shadow-sm">
                     <div className="flex items-center justify-between mb-6">
                       <div className="h-16 w-16 rounded-3xl bg-secondary grid place-items-center">
                         <Truck className="h-8 w-8 text-primary" />
                       </div>
                       <Button variant="outline" size="sm" className="rounded-xl gap-2 border-border" onClick={() => setActiveTab("chat")}>
                         <MessageSquare className="h-4 w-4" />
                         Chat
                       </Button>
                     </div>
                     <h3 className="text-xl font-bold mb-1">{sup.name}</h3>
                     <p className="text-muted-foreground text-sm mb-4">{sup.contact}</p>
                     <Badge className="rounded-full bg-primary/5 text-primary border-primary/20 px-4 py-1.5">{sup.category}</Badge>
                     
                     <div className="mt-8 pt-6 border-t border-border grid grid-cols-2 gap-4">
                        <Button variant="secondary" className="rounded-xl font-bold">Orders History</Button>
                        <Button className="rounded-xl font-bold">Restock Request</Button>
                     </div>
                   </div>
                 ))}
               </div>
            </motion.div>
          )}

          {activeTab === "chat" && (
            <motion.div key="chat" className="h-[calc(100vh-250px)] rounded-[2.5rem] border border-border bg-card overflow-hidden flex shadow-2xl">
               {/* Contact List */}
               <div className="w-80 border-r border-border flex flex-col">
                 <div className="p-6 border-b border-border font-black text-xl">Messages</div>
                 <div className="flex-1 overflow-y-auto p-4 space-y-2">
                   {[{ id: 'adm', name: 'Simba Global Admin', role: 'admin' }, ...suppliers.map(s => ({ ...s, role: 'supplier' }))].map(c => (
                     <button 
                        key={c.id} 
                        onClick={() => setChatUser(c.id)}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${
                          chatUser === c.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted/50'
                        }`}
                     >
                        <div className={`h-10 w-10 rounded-full grid place-items-center font-bold ${
                          chatUser === c.id ? 'bg-primary-foreground/20' : 'bg-primary/10 text-primary'
                        }`}>
                          {c.name[0]}
                        </div>
                        <div className="text-left">
                          <div className="font-bold text-sm truncate">{c.name}</div>
                          <div className={`text-[10px] font-bold uppercase tracking-widest ${
                            chatUser === c.id ? 'text-primary-foreground/70' : 'text-muted-foreground'
                          }`}>{c.role}</div>
                        </div>
                     </button>
                   ))}
                 </div>
               </div>
               
               {/* Chat Window */}
               <div className="flex-1 flex flex-col bg-muted/5">
                 {chatUser ? (
                    <>
                      <div className="p-6 border-b border-border bg-card flex items-center justify-between">
                         <div className="flex items-center gap-3">
                           <div className="h-10 w-10 rounded-full bg-primary/10 grid place-items-center font-bold text-primary">
                             {chatUser[0].toUpperCase()}
                           </div>
                           <div className="font-bold">Chat with {chatUser === 'adm' ? 'Global Admin' : suppliers.find(s => s.id === chatUser)?.name}</div>
                         </div>
                         <Button variant="ghost" size="icon" className="rounded-full"><Settings className="h-5 w-5" /></Button>
                      </div>
                      <div className="flex-1 p-6 overflow-y-auto space-y-4">
                         <div className="max-w-[80%] p-4 rounded-2xl rounded-tl-none bg-card border border-border text-sm">
                           Hello! How can we assist you today?
                         </div>
                         <div className="max-w-[80%] ml-auto p-4 rounded-2xl rounded-br-none bg-primary text-primary-foreground text-sm">
                           I need to request a restock for the Basmati Rice. We are running low.
                         </div>
                      </div>
                      <div className="p-6 bg-card border-t border-border">
                        <div className="relative">
                          <Input placeholder="Type your message..." className="pr-20 h-14 rounded-2xl bg-muted/50 border-none focus:ring-primary" />
                          <Button className="absolute right-2 top-2 h-10 px-6 rounded-xl bg-primary">Send</Button>
                        </div>
                      </div>
                    </>
                 ) : (
                   <div className="flex-1 grid place-items-center text-muted-foreground">
                      <div className="text-center">
                        <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-20" />
                        <h3 className="text-xl font-bold">Select a conversation</h3>
                        <p>Stay connected with admins and suppliers</p>
                      </div>
                   </div>
                 )}
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Meeting Modal */}
        <AnimatePresence>
          {isMeetingOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                onClick={() => setIsMeetingOpen(false)}
              />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                className="relative w-full max-w-4xl aspect-video rounded-[3rem] bg-card border-4 border-primary shadow-2xl overflow-hidden flex flex-col"
              >
                <div className="flex-1 bg-neutral-900 relative">
                   <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center">
                      <div className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center mb-6 border-2 border-primary/50 animate-bounce">
                         <Video className="h-10 w-10 text-primary" />
                      </div>
                      <h2 className="text-3xl font-black mb-2">Simba Global Meeting</h2>
                      <p className="text-white/60 font-medium">Connecting to Global Administrator...</p>
                   </div>
                </div>
                <div className="h-24 bg-card border-t border-border flex items-center justify-center gap-4 px-8">
                   <Button variant="outline" size="icon" className="rounded-full h-12 w-12 hover:bg-red-500 hover:text-white transition-colors" onClick={() => setIsMeetingOpen(false)}>
                      <XCircle className="h-6 w-6" />
                   </Button>
                   <Button variant="outline" size="icon" className="rounded-full h-12 w-12">
                      <Mic className="h-6 w-6" />
                   </Button>
                   <div className="h-8 w-px bg-border mx-2" />
                   <Button className="rounded-2xl h-12 px-8 bg-red-500 hover:bg-red-600 text-white font-bold" onClick={() => setIsMeetingOpen(false)}>
                      Leave Meeting
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

function SidebarLink({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${
        active 
          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
      }`}
    >
      <span className={active ? "text-primary-foreground" : "text-muted-foreground"}>{icon}</span>
      {label}
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
