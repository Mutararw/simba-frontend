import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line 
} from "recharts";
import { 
  TrendingUp, Users, ShoppingBag, DollarSign, 
  Store, PackageCheck, AlertCircle 
} from "lucide-react";
import { useAuth } from "@/store/auth";

// --- FAKE DATA GENERATION ---
const todayRevenue = 45231;
const todayOrders = 1245;
const activeCustomers = 892;
const satisfaction = 98.2;

const branchPerformance = [
  { name: "Remera", revenue: 12400, orders: 320 },
  { name: "Kacyiru", revenue: 11200, orders: 290 },
  { name: "Kimironko", revenue: 9800, orders: 250 },
  { name: "Nyamirambo", revenue: 6500, orders: 180 },
  { name: "Gikondo", revenue: 5331, orders: 205 },
];

const revenueOverTime = [
  { time: "08:00", value: 1200 },
  { time: "10:00", value: 4500 },
  { time: "12:00", value: 12000 },
  { time: "14:00", value: 25000 },
  { time: "16:00", value: 38000 },
  { time: "18:00", value: 45231 },
];

const recentOrders = [
  { id: "#ORD-8921", customer: "Alice M.", branch: "Remera", status: "Ready", amount: "RWF 45,000" },
  { id: "#ORD-8920", customer: "David K.", branch: "Kacyiru", status: "Preparing", amount: "RWF 12,500" },
  { id: "#ORD-8919", customer: "Sarah T.", branch: "Kimironko", status: "Pending", amount: "RWF 89,000" },
  { id: "#ORD-8918", customer: "John D.", branch: "Remera", status: "Ready", amount: "RWF 5,400" },
];

export default function Dashboard() {
  const user = useAuth((s) => s.user);

  // Protect route
  if (!user || (user.role !== "admin" && user.role !== "manager")) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container py-8 min-h-screen">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
            Welcome back, {user.name}
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Here's what's happening across your branches today.
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full font-bold text-sm">
          <Store className="h-4 w-4" />
          {user.role === "admin" ? "Global Admin View" : "Branch Manager View"}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPI 
          title="Total Revenue (Today)" 
          value={`$${todayRevenue.toLocaleString()}`} 
          trend="+14.5%" 
          icon={<DollarSign className="h-5 w-5" />} 
        />
        <KPI 
          title="Total Orders" 
          value={todayOrders.toLocaleString()} 
          trend="+8.2%" 
          icon={<ShoppingBag className="h-5 w-5" />} 
        />
        <KPI 
          title="Active Customers" 
          value={activeCustomers.toLocaleString()} 
          trend="+12.1%" 
          icon={<Users className="h-5 w-5" />} 
        />
        <KPI 
          title="Satisfaction Rate" 
          value={`${satisfaction}%`} 
          trend="+1.2%" 
          icon={<TrendingUp className="h-5 w-5" />} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Branch Performance Chart */}
        <div className="lg:col-span-2 rounded-3xl border border-border bg-card p-6 shadow-sm">
          <h2 className="font-display text-xl font-bold mb-6">Branch Performance (Revenue)</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={branchPerformance} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888833" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#888888', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#888888', fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Orders Feed */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-bold">Live Orders</h2>
            <span className="flex h-3 w-3 rounded-full bg-green-500 animate-pulse" />
          </div>
          
          <div className="flex-1 space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 rounded-2xl bg-muted/50 border border-border/50">
                <div>
                  <div className="font-bold text-sm">{order.id} <span className="font-normal text-muted-foreground ml-1">({order.branch})</span></div>
                  <div className="text-xs text-muted-foreground mt-0.5">{order.customer}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold">{order.amount}</div>
                  <div className={`text-[10px] font-bold uppercase tracking-wider mt-0.5 ${
                    order.status === 'Ready' ? 'text-green-500' : 
                    order.status === 'Preparing' ? 'text-yellow-500' : 'text-blue-500'
                  }`}>
                    {order.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 text-sm font-semibold text-primary hover:underline">View All Orders</button>
        </div>
      </div>

      {/* Accounting & Revenue Over Time */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-bold">Accounting: Revenue Over Time (Today)</h2>
          <div className="text-sm font-semibold text-muted-foreground">Updated 2 mins ago</div>
        </div>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueOverTime} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888833" />
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#888888', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#888888', fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
              />
              <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={4} dot={{ r: 4, fill: "hsl(var(--primary))", strokeWidth: 2, stroke: "hsl(var(--background))" }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function KPI({ title, value, trend, icon }: { title: string, value: string, trend: string, icon: React.ReactNode }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-border bg-card p-6 shadow-sm"
    >
      <div className="flex items-center justify-between text-muted-foreground mb-4">
        <h3 className="text-sm font-bold tracking-tight">{title}</h3>
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </div>
      </div>
      <div className="flex items-end gap-3">
        <div className="font-display text-3xl font-extrabold">{value}</div>
        <div className="text-sm font-bold text-green-500 mb-1 bg-green-500/10 px-2 py-0.5 rounded-md">{trend}</div>
      </div>
    </motion.div>
  );
}
