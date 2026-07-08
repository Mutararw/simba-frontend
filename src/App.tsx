import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, HashRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/layout/Layout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Browse from "./pages/Browse";
import ProductPage from "./pages/ProductPage";
import Cart from "./pages/Cart";
import Branches from "./pages/Branches";
import Checkout from "./pages/Checkout";
import Confirmation from "./pages/Confirmation";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Forgot from "./pages/Forgot";
import Orders from "./pages/Orders";
import { AiAssistant } from "@/components/shop/AiAssistant";
import { GlobalReviewPrompter } from "@/components/shop/GlobalReviewPrompter";
import Dashboard from "@/pages/Dashboard";
import BranchDashboard from "@/pages/BranchDashboard";
import Profile from "@/pages/Profile";
import Notifications from "@/pages/Notifications";
import Promotions from "@/pages/Promotions";
import Wishlist from "@/pages/Wishlist";
import About from "@/pages/About";
import ScrollToTop from "@/components/ScrollToTop";
import { ROUTER_MODE } from "@/lib/config";
import { SessionManager } from "@/lib/SessionManager";

const queryClient = new QueryClient();
const Router = ROUTER_MODE === "hash" ? HashRouter : BrowserRouter;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SessionManager />
      <Toaster />
      <Sonner />
      <Router>
        <ScrollToTop />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/branches" element={<Branches />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/confirmation" element={<Confirmation />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot" element={<Forgot />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/promotions" element={<Promotions />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/about" element={<About />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
        <AiAssistant />
        <GlobalReviewPrompter />
      </Router>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
