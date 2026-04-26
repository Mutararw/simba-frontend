import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ApiError, api } from "@/lib/api";
import { formatRWF } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Loader2, Package, Calendar, MapPin } from "lucide-react";
import { useOrder } from "@/store/order";

interface OrderItem {
  orderItemId: number;
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

export default function Orders() {
  const { t } = useTranslation();
  const lastOrder = useOrder((s) => s.lastOrder);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    api
      .get("/api/orders/me")
      .then((res) => setOrders(res.data))
      .catch((err) => {
        console.error("Failed to fetch orders", err);

        if (err instanceof ApiError && err.isNetworkError) {
          setNotice("Backend unavailable. Showing locally saved orders only.");
        } else {
          setNotice("Could not load your full order history right now.");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const localOrders = useMemo(() => {
    if (!lastOrder) return [];

    return [
      {
        orderId: Number(lastOrder.id.replace(/\D/g, "").slice(-9) || Date.now()),
        totalAmount: lastOrder.total,
        status: "saved",
        createdAt: lastOrder.createdAt,
        branchId: lastOrder.branchName,
        pickupTime: lastOrder.pickupTime,
        items: lastOrder.items.map((item, index) => ({
          orderItemId: index + 1,
          productName: item.product.name,
          imageUrl: item.product.image,
          quantity: item.qty,
          unitPrice: item.product.price,
        })),
      },
    ] satisfies Order[];
  }, [lastOrder]);

  const displayOrders = orders.length > 0 ? orders : localOrders;

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

      {notice ? (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {notice}
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
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      order.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="p-6">
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
