import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { CheckCircle2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useOrder } from "@/store/order";
import { useReviews } from "@/store/reviews";
import { useAuth } from "@/store/auth";
import { toast } from "sonner";
import { formatRWF } from "@/lib/products";

export default function Confirmation() {
  const { t } = useTranslation();
  const order = useOrder((s) => s.lastOrder);
  const { hasReviewed, addReview } = useReviews();
  const user = useAuth((s) => s.user);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const canReview =
    user?.role === "user" || user?.accountType === "user" || user?.role === "customer";

  if (!order) return <Navigate to="/" replace />;

  const handlePrintInvoice = () => {
    if (!order) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Popup blocked! Please allow popups to print the invoice.");
      return;
    }

    const itemsHtml = order.items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.product.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.qty}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${formatRWF(item.product.price)}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${formatRWF(item.product.price * item.qty)}</td>
      </tr>
    `).join("");

    const isDelivery = order.address !== undefined;
    const totalAmount = isDelivery ? order.total + order.deliveryFee : order.total;

    const invoiceHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice - Order #${order.id}</title>
          <style>
            body {
              font-family: 'Inter', system-ui, -apple-system, sans-serif;
              color: #333;
              margin: 0;
              padding: 40px;
              font-size: 14px;
              line-height: 1.5;
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              border-bottom: 2px solid #fd7e14;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .logo {
              font-size: 28px;
              font-weight: 800;
              color: #fd7e14;
            }
            .logo img {
              height: 40px;
            }
            .invoice-title {
              text-align: right;
            }
            .invoice-title h1 {
              margin: 0;
              font-size: 24px;
              color: #111;
            }
            .invoice-title p {
              margin: 5px 0 0;
              color: #666;
            }
            .details-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              margin-bottom: 30px;
            }
            .details-box h3 {
              margin-top: 0;
              border-bottom: 1px solid #ddd;
              padding-bottom: 5px;
              color: #111;
            }
            .details-box p {
              margin: 5px 0;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 30px;
            }
            th {
              background-color: #f8f9fa;
              font-weight: bold;
              text-align: left;
              padding: 10px;
              border-bottom: 2px solid #dee2e6;
            }
            .totals {
              margin-left: auto;
              width: 320px;
            }
            .totals-row {
              display: flex;
              justify-content: space-between;
              padding: 5px 0;
            }
            .totals-row.grand {
              font-weight: bold;
              font-size: 16px;
              border-top: 1px solid #ddd;
              padding-top: 10px;
              color: #fd7e14;
            }
            .footer {
              margin-top: 50px;
              text-align: center;
              color: #777;
              font-size: 12px;
              border-top: 1px solid #eee;
              padding-top: 20px;
            }
            @media print {
              body {
                padding: 20px;
              }
              .no-print {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">
              <span style="font-family: sans-serif; font-weight: 900; color: #fd7e14; font-style: italic;">SIMBA</span>
            </div>
            <div class="invoice-title">
              <h1>INVOICE</h1>
              <p>Order ID: ${order.id}</p>
            </div>
          </div>

          <div class="details-grid">
            <div class="details-box">
              <h3>Order Info</h3>
              <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()} ${new Date(order.createdAt).toLocaleTimeString()}</p>
              <p><strong>Type:</strong> ${isDelivery ? "Home Delivery" : "Store Pickup"}</p>
              <p><strong>Payment Method:</strong> ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod === 'momo' ? 'Mobile Money (MoMo)' : 'Credit/Debit Card'}</p>
            </div>
            <div class="details-box">
              <h3>${isDelivery ? "Delivery Details" : "Pickup Details"}</h3>
              ${isDelivery ? `
                <p><strong>District:</strong> ${order.district}</p>
                <p><strong>Zone:</strong> ${order.zone}</p>
                <p><strong>Address:</strong> ${order.address}</p>
                <p><strong>Delivery Slot:</strong> ${order.deliverySlot}</p>
              ` : `
                <p><strong>Branch:</strong> ${order.branchName}</p>
                <p><strong>Scheduled Time:</strong> ${order.pickupTime}</p>
              `}
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Product Name</th>
                <th style="text-align: center; width: 80px;">Qty</th>
                <th style="text-align: right; width: 120px;">Unit Price</th>
                <th style="text-align: right; width: 120px;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div class="totals">
            <div class="totals-row">
              <span>Subtotal</span>
              <span>${formatRWF(order.total)}</span>
            </div>
            ${isDelivery ? `
              <div class="totals-row">
                <span>Delivery Fee</span>
                <span>${formatRWF(order.deliveryFee)}</span>
              </div>
            ` : ""}
            
            <div class="totals-row grand">
              <span>Grand Total</span>
              <span>${formatRWF(totalAmount)}</span>
            </div>

            ${order.paymentMethod !== 'cod' ? `
              <div class="totals-row" style="color: #666; font-size: 12px; margin-top: 5px;">
                <span>Amount Paid (Deposit/Full)</span>
                <span>${formatRWF(isDelivery ? totalAmount : order.deposit)}</span>
              </div>
              <div class="totals-row" style="font-weight: bold; margin-top: 5px;">
                <span>Balance Due ${isDelivery ? 'on Delivery' : 'at Pickup'}</span>
                <span>${formatRWF(isDelivery ? 0 : order.total - order.deposit)}</span>
              </div>
            ` : `
              <div class="totals-row" style="font-weight: bold; margin-top: 5px;">
                <span>Amount Due ${isDelivery ? 'on Delivery' : 'at Pickup'}</span>
                <span>${formatRWF(totalAmount)}</span>
              </div>
            `}
          </div>

          <div class="footer">
            <p>Thank you for shopping with Simba Supermarket!</p>
            <p>If you have any questions, please contact our support team at info@Simbasupermarket.rw or call +250 788 000 000.</p>
          </div>

          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(invoiceHtml);
    printWindow.document.close();
  };

  return (
    <div className="container max-w-2xl py-12">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full bg-primary/10 text-primary"
      >
        <CheckCircle2 className="h-10 w-10" />
      </motion.div>
      <h1 className="text-center font-display text-3xl font-bold md:text-4xl">{t("confirm.title")}</h1>
      <p className="mt-3 text-center text-muted-foreground">{t("confirm.body", { branch: order.branchName })}</p>

      <div className="mt-8 grid gap-4 rounded-2xl border border-border bg-card p-6 sm:grid-cols-2">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">{t("confirm.code")}</div>
          <div className="font-display text-2xl font-extrabold tracking-wider text-primary">{order.id}</div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">{t("confirm.pickup")}</div>
          <div className="font-display text-base font-bold">{t("confirm.eta", { time: order.pickupTime })}</div>
        </div>
      </div>

      {!hasReviewed && canReview ? (
        <div className="mt-8 rounded-2xl border border-border bg-card p-6">
          <h2 className="font-display text-lg font-bold">{t("reviews.formTitle")}</h2>
          <div className="mt-3 flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} onClick={() => setRating(n)} aria-label={`${n} stars`} className="transform transition-transform hover:scale-110">
                <Star className={`h-8 w-8 transition-colors ${n <= rating ? "fill-primary text-primary" : "text-muted-foreground/30"}`} />
              </button>
            ))}
          </div>
          <Textarea
            className="mt-3 rounded-xl resize-none"
            placeholder={t("reviews.formPlaceholder")}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Button
            className="mt-4 rounded-full font-bold w-full"
            disabled={rating === 0 || !comment.trim()}
            onClick={() => {
              addReview({ name: "Guest User", rating, text: comment });
              setRating(0);
              setComment("");
            }}
          >
            {t("reviews.formSubmit")}
          </Button>
        </div>
      ) : !canReview ? (
        <div className="mt-8 rounded-2xl border border-border bg-card p-6">
          <h2 className="font-display text-lg font-bold">Customer reviews are reserved for customers</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in with a customer account to submit a review for this order.
          </p>
        </div>
      ) : null}

      <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={handlePrintInvoice} className="rounded-full gap-2 bg-[#fd7e14] hover:bg-[#fd7e14]/90 text-white font-bold shadow-md">
          Download / Print Invoice
        </Button>
        <Button asChild variant="outline" className="rounded-full">
          <Link to="/">{t("confirm.home")}</Link>
        </Button>
      </div>
    </div>
  );
}
