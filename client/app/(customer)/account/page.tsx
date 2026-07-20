"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/shared/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";
import { getMyInquiries, submitInquiry, Inquiry } from "@/shared/lib/api";
import { Mail, Phone, Calendar, MessageSquare, ClipboardList, Send, ArrowRight, User } from "lucide-react";

interface Order {
  _id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export default function AccountPage() {
  const { user, token, isLoading: authLoading, logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [isLoadingInquiries, setIsLoadingInquiries] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState<"orders" | "inquiries">("orders");

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      }));
    }
  }, [user]);

  useEffect(() => {
    if (authLoading || !token) return;

    async function fetchOrders() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/my-orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load orders:", error);
      } finally {
        setIsLoadingOrders(false);
      }
    }

    async function fetchInquiries() {
      try {
        const data = await getMyInquiries(token!);
        setInquiries(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load inquiries:", error);
      } finally {
        setIsLoadingInquiries(false);
      }
    }

    fetchOrders();
    fetchInquiries();
  }, [authLoading, token]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess("");

    try {
      await submitInquiry(formData, token);
      setSubmitSuccess("Inquiry submitted successfully! We will get back to you shortly.");
      setFormData((prev) => ({
        ...prev,
        subject: "",
        message: "",
      }));
      // Refresh list
      const data = await getMyInquiries(token!);
      setInquiries(data);
    } catch (err: any) {
      setSubmitError(err.message || "Failed to submit inquiry.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <main className="min-h-screen bg-[#070707] text-[#f5f5f5] flex items-center justify-center font-sans">
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Loading profile...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-[#070707] text-[#f5f5f5] flex flex-col items-center justify-center gap-4 font-sans">
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Please login to view your account.</p>
        <Link href="/login">
          <Button className="bg-gold hover:bg-gold-hover text-black font-extrabold uppercase tracking-widest text-[10px] px-8 h-10 rounded">
            Login
          </Button>
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#070707] text-[#f5f5f5] font-sans pb-20">
      <div className="mx-auto max-w-5xl px-4 py-10">
        
        {/* Profile Card header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-[#0c0c0c] border border-zinc-900 rounded-xl p-6 md:p-8 mb-10 gap-6 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-gold/10 border border-gold/25 flex items-center justify-center text-gold">
              <User className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black uppercase text-white tracking-wide">{user.name}</h1>
              <p className="text-xs text-zinc-500 font-mono mt-0.5">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-300 font-extrabold uppercase px-3 py-1 rounded tracking-wider">
              Role: {user.role}
            </span>
            <Button
              variant="outline"
              size="sm"
              className="border-red-900/50 hover:bg-red-950/20 text-red-500 font-bold uppercase tracking-wider text-[10px] px-4 py-2 h-9 rounded"
              onClick={logout}
            >
              Logout
            </Button>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-zinc-900 mb-8 overflow-x-auto">
          {[
            { id: "orders", label: "Order History", icon: ClipboardList },
            { id: "inquiries", label: "B2B Quote Requests & Inquiries", icon: MessageSquare },
          ].map((tab) => {
            const isSelected = activeSubTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-4.5 text-xs font-black uppercase tracking-wider transition-all duration-200 border-b-2 shrink-0 cursor-pointer ${
                  isSelected
                    ? "text-gold border-gold"
                    : "text-zinc-500 border-transparent hover:text-zinc-300"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        {activeSubTab === "orders" ? (
          <div className="space-y-4">
            <h2 className="text-sm font-black uppercase tracking-widest text-zinc-400 mb-2">My Orders</h2>
            {isLoadingOrders ? (
              <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Loading orders...</p>
            ) : orders.length === 0 ? (
              <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider py-8">You haven't placed any orders yet.</p>
            ) : (
              <div className="grid gap-3.5">
                {orders.map((order) => (
                  <Link key={order._id} href={`/orders/${order._id}`}>
                    <div className="bg-[#0c0c0c] border border-zinc-900 hover:border-gold/45 rounded-lg p-5 flex items-center justify-between transition-colors shadow-lg cursor-pointer">
                      <div>
                        <p className="font-mono text-xs text-zinc-500">{order._id}</p>
                        <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-wider mt-1">
                          Ordered on: {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className="font-black text-gold text-sm">AED {order.totalAmount}</span>
                        <Badge variant="secondary" className="capitalize text-[10px] px-2.5 py-0.5 bg-zinc-900 border border-zinc-800 text-zinc-300">
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-12 gap-8 items-start">
            
            {/* Form to submit inquiries (5 cols) */}
            <div className="md:col-span-5 bg-[#0c0c0c] border border-zinc-900 rounded-xl p-5 shadow-2xl space-y-4">
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-white">New B2B Request</h3>
                <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider mt-1">
                  Request custom volumes, quotes, or product availability.
                </p>
              </div>
              
              {submitError && <div className="bg-red-950/20 text-red-500 border border-red-900/30 p-3 rounded-md text-[11px] font-semibold">{submitError}</div>}
              {submitSuccess && <div className="bg-green-950/20 text-green-500 border border-green-900/30 p-3 rounded-md text-[11px] font-semibold">{submitSuccess}</div>}

              <form onSubmit={handleInquirySubmit} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    required
                    placeholder="e.g. +971 50 123 4567"
                    className="w-full h-9 px-3 rounded bg-[#121212] border border-zinc-800 focus:border-gold text-white text-xs placeholder:text-zinc-700 focus:outline-none"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Inquiry Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleFormChange}
                    required
                    placeholder="e.g. Quote Request for M12 Hex Bolts"
                    className="w-full h-9 px-3 rounded bg-[#121212] border border-zinc-800 focus:border-gold text-white text-xs placeholder:text-zinc-700 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Detailed Message</label>
                  <textarea
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleFormChange}
                    required
                    placeholder="Describe your requirements, quantity needed, and company details..."
                    className="w-full p-3 rounded bg-[#121212] border border-zinc-800 focus:border-gold text-white text-xs placeholder:text-zinc-700 focus:outline-none leading-relaxed resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gold hover:bg-gold-hover disabled:bg-zinc-800 text-black font-extrabold uppercase tracking-widest text-[10px] py-3 rounded cursor-pointer transition-all duration-300 flex items-center justify-center gap-1.5"
                >
                  <Send className="h-3 w-3" />
                  {isSubmitting ? "Submitting..." : "Send Request"}
                </button>
              </form>
            </div>

            {/* Inquiry list (7 cols) */}
            <div className="md:col-span-7 space-y-4">
              <h2 className="text-sm font-black uppercase tracking-widest text-zinc-400">Past Requests</h2>
              
              {isLoadingInquiries ? (
                <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Loading inquiries...</p>
              ) : inquiries.length === 0 ? (
                <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider py-8">No requests or inquiries submitted yet.</p>
              ) : (
                <div className="space-y-4">
                  {inquiries.map((inq) => (
                    <div key={inq._id} className="bg-[#0c0c0c] border border-zinc-900 rounded-lg p-5 space-y-3.5 shadow-lg">
                      {/* Header */}
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <p className="font-extrabold text-xs text-white uppercase tracking-wider leading-tight">{inq.subject || "No Subject"}</p>
                          <span className="inline-flex items-center gap-1 font-mono text-[9px] text-zinc-500 mt-1 uppercase font-bold">
                            <Calendar className="h-3 w-3" />
                            {new Date(inq.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <Badge variant={inq.status === "resolved" ? "default" : "destructive"} className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 border-0">
                          {inq.status}
                        </Badge>
                      </div>

                      {/* Product Tag Link */}
                      {inq.product && (
                        <div className="flex items-center gap-1.5 text-[9px] text-gold font-bold uppercase tracking-wider bg-zinc-950 p-1.5 rounded border border-zinc-900/60 max-w-fit">
                          <span>Product:</span>
                          <Link href={`/products/${inq.product.slug}`} className="hover:underline">
                            {inq.product.name} (SKU: {inq.product.sku})
                          </Link>
                        </div>
                      )}

                      {/* Message body */}
                      <div className="text-zinc-400 text-xs leading-relaxed bg-[#121212]/60 p-3 rounded border border-zinc-900">
                        {inq.message}
                      </div>

                      {/* Admin response */}
                      {inq.adminResponse && (
                        <div className="bg-gold/5 border border-gold/15 p-4 rounded-md space-y-1.5">
                          <p className="text-[9px] font-bold text-gold uppercase tracking-[0.15em] flex items-center gap-1.5">
                            <MessageSquare className="h-3 w-3" />
                            Sales Representative Reply:
                          </p>
                          <p className="text-zinc-300 text-xs leading-relaxed">
                            {inq.adminResponse}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </main>
  );
}