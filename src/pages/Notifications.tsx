import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Check, Clock, Trash2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const MOCK_NOTIFICATIONS = [
  { id: "1", title: "Order Accepted", message: "Your pickup order #ORD-101 has been accepted by the branch manager.", time: "10 mins ago", isRead: false },
  { id: "2", title: "Flash Sale!", message: "Get 50% off on all dairy products this weekend.", time: "2 hours ago", isRead: true },
  { id: "3", title: "Delivery Update", message: "Your order #ORD-095 is out for delivery.", time: "Yesterday", isRead: true },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const markRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    toast.success("Marked as read");
  };

  const deleteNotif = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast.info("Notification deleted");
  };

  return (
    <div className="container py-12 max-w-3xl min-h-screen">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            Notifications
            <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
              {notifications.filter(n => !n.isRead).length}
            </span>
          </h1>
          <p className="text-muted-foreground mt-1">Stay updated with your orders and offers.</p>
        </div>
        <Button variant="outline" size="sm" className="rounded-xl border-border" onClick={() => setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))}>
          Mark all as read
        </Button>
      </header>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {notifications.length > 0 ? (
            notifications.map((n) => (
              <motion.div
                key={n.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={`p-6 rounded-[2rem] border transition-all ${
                  n.isRead ? "bg-card border-border opacity-70" : "bg-card border-primary/30 shadow-md ring-1 ring-primary/5"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`h-12 w-12 rounded-2xl grid place-items-center flex-shrink-0 ${
                    n.isRead ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"
                  }`}>
                    <Bell className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-lg">{n.title}</h3>
                      <span className="text-xs text-muted-foreground font-medium">{n.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{n.message}</p>
                    <div className="mt-4 flex items-center gap-2">
                      {!n.isRead && (
                        <Button size="sm" variant="secondary" className="rounded-xl h-9 px-4 gap-2 text-xs font-bold" onClick={() => markRead(n.id)}>
                          <Check className="h-3 w-3" /> Mark as read
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" className="rounded-xl h-9 w-9 p-0 text-red-500 hover:bg-red-500/10" onClick={() => deleteNotif(n.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="py-20 text-center text-muted-foreground">
              <Info className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>No notifications to show.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
