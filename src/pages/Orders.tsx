import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ApiError, api } from "@/lib/api";
import { formatRWF } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Loader2, Package, Calendar, MapPin, RotateCcw, Trash2, WifiOff } from "lucide-react";
import { useCart } from "@/store/cart";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface OrderItem {
  orderItemId: number;
  productId: number;
  productName: string;
  imageUrl: string;
  quantity: number;
  unitPrice: number;
}

interface Order {
  orderId: number;
  totalAmount: number;
  status: string;
  createdAt: string;
  branchId?: string;
  pickupTime?: string;
  items: OrderItem[];
}

const STATUS_STEPS = ["Placed", "Confirmed", "Packed", "Out for Delivery", "Delivered"];

export default function Orders() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    api
      .get("/api/orders/me")
      .then((res) => setOrders(res.data))
      .catch((err) => {
        console.error("Failed to fetch orders", err);
        if (err instanceof ApiError && err.isNetworkError) {
          setIsOffline(true);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const deleteOrder = async (orderId: number) => {
    if (!confirm("Delete this order permanently?")) return;
    try {
      await api.delete(`/api/orders/${orderId}`);
      setOrders(prev => prev.filter(o => o.orderId !== orderId));
      toast.success("Order deleted");
    } catch (err) {
      console.error("delete order error:", err);
      toast.error(err instanceof Error ? err.message : "Failed to delete order");
    }
  };

  const displayOrders = orders;

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="font-display text-3xl font-bold">{t("nav.orders", { defaultValue: "My Orders" })}</h1>

      {isOffline ? (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 flex items-center gap-2">
          <WifiOff className="h-4 w-4" />
          Backend unavailable. Sign in or try again later.
        </div>
      ) : null}

      {displayOrders.length === 0 ? (
        <div className="py-20 text-center">
          <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-secondary text-muted-foreground">
            <Package className="h-8 w-8" />
          </div>
          <p className="text-muted-foreground">You haven't placed any orders yet.</p>
          <Button asChild className="mt-4 rounded-full">
            <Link to="/browse">Start shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          {displayOrders.map((order) => (
            <div key={order.orderId} className="overflow-hidden rounded-2xl border border-border bg-card">
              <div className="flex flex-wrap items-center justify-between gap-4 bg-secondary/50 px-6 py-4">
                <div className="flex gap-6">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Order ID</div>
                    <div className="font-mono text-sm font-bold">#{order.orderId}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Date</div>
                    <div className="flex items-center gap-1 text-sm font-semibold">
                      <Calendar className="h-3 w-3" />
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Total</div>
                    <div className="font-bold text-primary">{formatRWF(order.totalAmount)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 gap-1.5 rounded-full text-xs"
                    onClick={() => {
                      order.items.forEach(item => {
                        useCart.getState().addItem({
                          id: item.productId,
                          name: item.productName,
                          price: item.unitPrice,
                          image: item.imageUrl,
                          category: "Reorder"
                        });
                      });
                      toast.success("Order items added to cart!");
                      navigate("/cart");
                    }}
                  >
                    <RotateCcw className="h-3.5 w-3.5" /> Buy Again
                  </Button>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      order.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {order.status}
                  </span>
                  {(order.status === "Delivered" || order.status === "completed" || order.status === "Cancelled") && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-red-500 hover:bg-red-50"
                      onClick={() => deleteOrder(order.orderId)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>

              <div className="p-6">
                {/* Status Timeline */}
                <div className="mb-8 px-2">
                  <div className="relative flex justify-between">
                    <div className="absolute top-1/2 left-0 h-0.5 w-full -translate-y-1/2 bg-muted" />
                    <div 
                      className="absolute top-1/2 left-0 h-0.5 -translate-y-1/2 bg-primary transition-all duration-500" 
                      style={{ 
                        width: `${Math.max(0, (STATUS_STEPS.indexOf(order.status) / (STATUS_STEPS.length - 1)) * 100)}%` 
                      }}
                    />
                    {STATUS_STEPS.map((step, idx) => (
                      <div key={step} className="relative z-10 flex flex-col items-center">
                        <div 
                          className={`grid h-6 w-6 place-items-center rounded-full text-[10px] font-bold transition-colors ${
                            idx <= STATUS_STEPS.indexOf(order.status) ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {idx + 1}
                        </div>
                        <div className={`mt-2 text-[10px] font-semibold uppercase tracking-tighter ${
                          idx <= STATUS_STEPS.indexOf(order.status) ? "text-primary" : "text-muted-foreground"
                        }`}>
                          {step}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {order.branchId ? (
                  <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>
                      Pick up at <b>{order.branchId}</b> {order.pickupTime ? `at ${order.pickupTime}` : ""}
                    </span>
                  </div>
                ) : null}

                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.orderItemId} className="flex items-center gap-4">
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-secondary">
                        <img src={item.imageUrl} alt={item.productName} className="h-full w-full object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-bold">{item.productName}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.quantity} x {formatRWF(item.unitPrice)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
