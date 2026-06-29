import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { 
  Truck, Package, MessageSquare, TrendingUp, 
  Clock, CheckCircle2, AlertCircle, ShoppingBag,
  Search, Filter, ArrowUpRight, DollarSign,
  Send, Plus, History, ArrowLeft
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

const MOCK_CONTACTS = [
  { id: 1, name: "Jean-Pierre", role: "Branch Manager - Remera", avatar: "JP", online: true, lastMessage: "Need more rice urgently" },
  { id: 2, name: "Alice Mugisha", role: "Branch Manager - Kacyiru", avatar: "AM", online: true, lastMessage: "Oil shipment status?" },
  { id: 3, name: "David Habimana", role: "Admin - Kimironko", avatar: "DH", online: false, lastMessage: "Thanks for the delivery" },
  { id: 4, name: "Grace Uwimana", role: "Branch Manager - Kanombe", avatar: "GU", online: true, lastMessage: "When is the next supply?" },
];

const MOCK_MESSAGES: Record<number, { id: number; senderId: number; text: string; timestamp: string }[]> = {
  1: [
    { id: 1, senderId: 1, text: "Hi, we need 50 units of Basmati Rice urgently", timestamp: "2024-04-27T09:00:00" },
    { id: 2, senderId: 0, text: "Sure, I can process that today", timestamp: "2024-04-27T09:05:00" },
    { id: 3, senderId: 1, text: "Great, please confirm when dispatched", timestamp: "2024-04-27T09:10:00" },
  ],
  2: [
    { id: 1, senderId: 2, text: "Hello, any update on the cooking oil order?", timestamp: "2024-04-26T14:00:00" },
    { id: 2, senderId: 0, text: "It's being processed, should ship tomorrow", timestamp: "2024-04-26T14:30:00" },
  ],
  3: [
    { id: 1, senderId: 3, text: "Thanks for the milk powder delivery!", timestamp: "2024-04-25T10:00:00" },
    { id: 2, senderId: 0, text: "You're welcome! Let me know if you need more", timestamp: "2024-04-25T10:15:00" },
  ],
};

const MOCK_PRODUCT_HISTORY = [
  { id: 1, product: "Basmati Rice 5kg", qty: 150, date: "2024-04-20", branch: "Remera", status: "delivered" },
  { id: 2, product: "Cooking Oil 3L", qty: 80, date: "2024-04-18", branch: "Kacyiru", status: "delivered" },
  { id: 3, product: "Milk Powder 1kg", qty: 200, date: "2024-04-15", branch: "Kimironko", status: "delivered" },
  { id: 4, product: "Sugar 2kg", qty: 120, date: "2024-04-12", branch: "Kanombe", status: "delivered" },
  { id: 5, product: "Maize Flour 5kg", qty: 90, date: "2024-04-10", branch: "Remera", status: "delivered" },
];

export default function SupplierDashboard() {
  const user = useAuth(s => s.user);
  const [requests, setRequests] = useState(MOCK_REQUESTS);
  const [activeSection, setActiveSection] = useState("overview");

  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<{ id: number; senderId: number; text: string; timestamp: string }[]>([]);
  const [contacts, setContacts] = useState(MOCK_CONTACTS);
  const [selectedContact, setSelectedContact] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [orderProduct, setOrderProduct] = useState("");
  const [orderQty, setOrderQty] = useState("");

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    fetchContacts();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/chat/contacts");
      if (res.ok) {
        const data = await res.json();
        setContacts(data);
      }
    } catch {
      // Using mock data
    }
    setLoading(false);
  };

  const fetchMessages = async (otherUserId: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/chat/${otherUserId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch {
      setMessages(MOCK_MESSAGES[otherUserId] || []);
    }
    setLoading(false);
  };

  const handleSelectContact = (contactId: number) => {
    setSelectedContact(contactId);
    fetchMessages(contactId);
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || selectedContact === null) return;
    const newMessage = {
      id: Date.now(),
      senderId: 0,
      text: messageText.trim(),
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, newMessage]);
    setMessageText("");
    try {
      await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId: selectedContact, content: newMessage.text }),
      });
    } catch {
      // Mock fallback
    }
  };

  const handlePlaceOrder = async () => {
    if (!orderProduct.trim() || !orderQty.trim() || selectedContact === null) {
      toast.error("Please fill in product name and quantity");
      return;
    }
    const orderText = `ORDER: ${orderProduct.trim()} x ${orderQty.trim()}`;
    const newMessage = {
      id: Date.now(),
      senderId: 0,
      text: orderText,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, newMessage]);
    setOrderProduct("");
    setOrderQty("");
    toast.success("Order sent to branch manager");
    try {
      await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId: selectedContact, content: orderText }),
      });
    } catch {
      // Mock fallback
    }
  };

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

  const getContactName = (contactId: number | null) => {
    if (contactId === null) return "";
    const contact = contacts.find(c => c.id === contactId);
    return contact ? contact.name : "Unknown";
  };

  const handleCloseChat = () => {
    setSelectedContact(null);
    setMessages([]);
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-background">
      {/* Sidebar */}
      <div className="hidden lg:flex w-72 flex-col border-r border-border bg-card/50 backdrop-blur-xl p-6">
        <div className="flex items-center gap-3 px-3 py-2 rounded-2xl bg-primary/10 text-primary mb-8">
          <Truck className="h-5 w-5" />
          <span className="font-bold text-sm">Supplier Portal</span>
        </div>
        <nav className="space-y-2">
          <button onClick={() => { setActiveSection("overview"); handleCloseChat(); }} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${activeSection === "overview" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"}`}>
            <TrendingUp className="h-4 w-4" /> Overview
          </button>
          <button onClick={() => { setActiveSection("restock"); handleCloseChat(); }} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${activeSection === "restock" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"}`}>
            <Package className="h-4 w-4" /> Restock Requests
          </button>
          <button onClick={() => { setActiveSection("history"); handleCloseChat(); }} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${activeSection === "history" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"}`}>
            <History className="h-4 w-4" /> Product History
          </button>
          <button onClick={() => setActiveSection("messages")} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${activeSection === "messages" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"}`}>
            <MessageSquare className="h-4 w-4" /> Messages
          </button>
        </nav>
      </div>

      <main className="flex-1 p-8 overflow-y-auto">
        {(activeSection === "overview" || activeSection === "restock") && (
          <>
            {activeSection === "overview" && (
              <header className="mb-8">
                <h1 className="text-3xl font-black tracking-tight">Supplier Dashboard</h1>
                <p className="text-muted-foreground mt-1">Manage your supply chain and branch requests.</p>
              </header>
            )}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <StatCard title="Active Requests" value={stats.pendingOrders.toString()} icon={<Clock />} />
              <StatCard title="Fulfilled" value={stats.fulfilledThisMonth.toString()} icon={<CheckCircle2 />} />
              <StatCard title="Total Revenue" value={`RWF ${stats.revenue.toLocaleString()}`} icon={<DollarSign />} />
              <StatCard title="Supply Rating" value={stats.rating.toString()} icon={<TrendingUp />} />
            </div>

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
          </>
        )}

        {activeSection === "history" && (
          <div className="space-y-6">
            <header className="mb-8">
              <h1 className="text-3xl font-black tracking-tight">Product History</h1>
              <p className="text-muted-foreground mt-1">Products you have supplied to branches.</p>
            </header>
            <div className="rounded-[2.5rem] border border-border bg-card overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-muted/30 border-b border-border">
                  <tr>
                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-muted-foreground">Product</th>
                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-muted-foreground">Branch</th>
                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-muted-foreground">Qty Supplied</th>
                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-muted-foreground">Date</th>
                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {MOCK_PRODUCT_HISTORY.map(item => (
                    <tr key={item.id} className="hover:bg-muted/10 transition-colors">
                      <td className="px-6 py-4 font-bold text-sm">{item.product}</td>
                      <td className="px-6 py-4 text-sm font-medium">{item.branch}</td>
                      <td className="px-6 py-4 font-black">{item.qty}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{item.date}</td>
                      <td className="px-6 py-4">
                        <Badge className="rounded-full px-3 py-1 text-[10px] font-black uppercase bg-green-500/10 text-green-500">
                          {item.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeSection === "messages" && (
          <div className="flex h-[calc(100vh-10rem)] gap-6">
            <div className="w-80 flex-shrink-0 space-y-4">
              <h2 className="text-2xl font-black">Messages</h2>
              <p className="text-muted-foreground text-sm -mt-3">Chat with branch managers and admins.</p>
              <div className="space-y-2 mt-6">
                {contacts.map(contact => (
                  <button
                    key={contact.id}
                    onClick={() => handleSelectContact(contact.id)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all ${
                      selectedContact === contact.id
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border bg-card hover:border-primary/30 hover:bg-muted/10"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 text-primary grid place-items-center text-sm font-bold relative">
                        {contact.avatar}
                        {contact.online && (
                          <span className="absolute -top-0.5 -right-0.5 h-3 w-3 bg-green-500 rounded-full border-2 border-background" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm truncate">{contact.name}</div>
                        <div className="text-xs text-muted-foreground truncate">{contact.role}</div>
                        <div className="text-xs text-muted-foreground/60 truncate mt-0.5">{contact.lastMessage}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 flex flex-col rounded-[2.5rem] border border-border bg-card overflow-hidden shadow-sm">
              {selectedContact ? (
                <>
                  <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/10">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 text-primary grid place-items-center text-sm font-bold">
                        {contacts.find(c => c.id === selectedContact)?.avatar}
                      </div>
                      <div>
                        <div className="font-bold text-sm">{getContactName(selectedContact)}</div>
                        <div className="text-xs text-muted-foreground">{contacts.find(c => c.id === selectedContact)?.role}</div>
                      </div>
                    </div>
                    <button onClick={handleCloseChat} className="text-muted-foreground hover:text-foreground transition-colors">
                      <ArrowLeft className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {loading ? (
                      <div className="flex items-center justify-center h-full text-muted-foreground">Loading messages...</div>
                    ) : messages.length === 0 ? (
                      <div className="flex items-center justify-center h-full text-muted-foreground">No messages yet. Start a conversation!</div>
                    ) : (
                      messages.map(msg => (
                        <div key={msg.id} className={`flex ${msg.senderId === 0 ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-[70%] p-4 rounded-2xl ${
                            msg.senderId === 0
                              ? "bg-primary text-primary-foreground rounded-br-md"
                              : "bg-muted/30 border border-border rounded-bl-md"
                          }`}>
                            {msg.text.startsWith("ORDER:") ? (
                              <div>
                                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-1 text-amber-400">
                                  <ShoppingBag className="h-3 w-3" /> New Order
                                </div>
                                <div className="font-bold">{msg.text.replace("ORDER:", "").trim()}</div>
                              </div>
                            ) : (
                              <div className="text-sm">{msg.text}</div>
                            )}
                            <div className={`text-[10px] mt-1 ${msg.senderId === 0 ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  <div className="border-t border-border p-4 space-y-3">
                    <div className="grid grid-cols-[1fr_80px_auto] gap-2">
                      <Input
                        placeholder="Product name..."
                        value={orderProduct}
                        onChange={e => setOrderProduct(e.target.value)}
                        className="rounded-xl text-sm"
                      />
                      <Input
                        type="number"
                        placeholder="Qty"
                        value={orderQty}
                        onChange={e => setOrderQty(e.target.value)}
                        className="rounded-xl text-sm"
                      />
                      <Button size="sm" className="rounded-xl" onClick={handlePlaceOrder}>
                        <Plus className="h-4 w-4 mr-1" /> Order
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type a message..."
                        value={messageText}
                        onChange={e => setMessageText(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && handleSendMessage()}
                        className="rounded-xl text-sm flex-1"
                      />
                      <Button size="sm" className="rounded-xl" onClick={handleSendMessage}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground flex-col gap-2">
                  <MessageSquare className="h-12 w-12 opacity-30" />
                  <p className="font-medium">Select a contact to start chatting</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
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
