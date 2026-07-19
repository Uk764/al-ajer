"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/shared/context/AuthContext";
import {
  getInquiries,
  updateInquiryStatus,
  deleteInquiry,
  Inquiry,
} from "@/shared/lib/api";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import {
  CheckCircle2,
  Trash2,
  X,
  RefreshCw,
  Search,
  Mail,
  Phone,
  Calendar,
  MessageSquare,
  Eye,
} from "lucide-react";

export default function AdminInquiriesPage() {
  const { token } = useAuth();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Search & Filter state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "resolved">("all");
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // View modal state
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  // Delete confirmation state
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [inquiryToDelete, setInquiryToDelete] = useState<Inquiry | null>(null);

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token, page, statusFilter]);

  // Handle search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchData();
  };

  async function fetchData() {
    setIsLoading(true);
    setError("");
    try {
      if (!token) return;
      const params: Record<string, any> = {
        page,
        limit: 10,
        search: search.trim() || undefined,
        status: statusFilter === "all" ? undefined : statusFilter,
      };
      const res = await getInquiries(token, params);
      setInquiries(res.inquiries);
      setTotalPages(res.pagination.totalPages);
      setTotalCount(res.pagination.total);
    } catch (err: any) {
      setError(err.message || "Failed to load inquiries.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleStatusToggle(inquiry: Inquiry) {
    if (!token) return;
    setError("");
    setSuccess("");

    const newStatus = inquiry.status === "pending" ? "resolved" : "pending";

    try {
      await updateInquiryStatus(token, inquiry._id, newStatus);
      setSuccess(`Inquiry marked as ${newStatus}.`);
      
      // Update local state
      setInquiries((prev) =>
        prev.map((item) =>
          item._id === inquiry._id ? { ...item, status: newStatus } : item
        )
      );

      if (selectedInquiry?._id === inquiry._id) {
        setSelectedInquiry((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } catch (err: any) {
      setError(err.message || "Failed to update status.");
    }
  }

  function handleDeleteClick(inquiry: Inquiry) {
    setInquiryToDelete(inquiry);
    setIsDeleteConfirmOpen(true);
  }

  async function handleConfirmDelete() {
    if (!token || !inquiryToDelete) return;
    setError("");
    setSuccess("");

    try {
      await deleteInquiry(token, inquiryToDelete._id);
      setSuccess("Inquiry deleted successfully.");
      setIsDeleteConfirmOpen(false);
      setInquiryToDelete(null);
      
      if (selectedInquiry?._id === inquiryToDelete._id) {
        setSelectedInquiry(null);
      }
      
      // If we are on a page with 1 item and delete it, go back a page
      if (inquiries.length === 1 && page > 1) {
        setPage((p) => p - 1);
      } else {
        fetchData();
      }
    } catch (err: any) {
      setError(err.message || "Failed to delete inquiry.");
      setIsDeleteConfirmOpen(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Contact Inquiries</h1>
          <p className="text-sm text-muted-foreground">
            Manage customer feedback, specs enquiries, and support tickets
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={fetchData} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {error && <div className="bg-destructive/15 text-destructive p-3 rounded-md text-sm">{error}</div>}
      {success && <div className="bg-green-600/15 text-green-500 p-3 rounded-md text-sm">{success}</div>}

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        {/* Tab Filters */}
        <div className="flex bg-muted rounded-md p-1 border border-border shrink-0 self-start">
          {[
            { label: "All", id: "all" },
            { label: "Pending", id: "pending" },
            { label: "Resolved", id: "resolved" },
          ].map((tab) => {
            const isSelected = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setStatusFilter(tab.id as any);
                  setPage(1);
                }}
                className={`px-4 py-1.5 text-xs font-semibold rounded-sm transition-all cursor-pointer ${
                  isSelected
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, phone, message..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button type="submit">Search</Button>
        </form>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">
            Inquiries Catalog ({totalCount} total)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground text-sm">
              Loading inquiries...
            </div>
          ) : inquiries.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">
              No inquiries found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border text-muted-foreground font-medium">
                    <th className="py-3 px-4">Contact Info</th>
                    <th className="py-3 px-4">Subject</th>
                    <th className="py-3 px-4">Message Snippet</th>
                    <th className="py-3 px-4">Submitted At</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {inquiries.map((inq) => (
                    <tr
                      key={inq._id}
                      className="hover:bg-secondary/40 transition-colors cursor-pointer align-top"
                      onClick={() => setSelectedInquiry(inq)}
                    >
                      <td className="py-3.5 px-4 max-w-[200px]" onClick={(e) => e.stopPropagation()}>
                        <p className="font-semibold text-sm text-foreground leading-tight">{inq.name}</p>
                        <a
                          href={`mailto:${inq.email}`}
                          className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1 hover:text-primary transition-colors"
                        >
                          <Mail className="h-3 w-3 shrink-0 text-zinc-500" />
                          <span className="truncate">{inq.email}</span>
                        </a>
                        <a
                          href={`tel:${inq.phone}`}
                          className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1 hover:text-primary transition-colors"
                        >
                          <Phone className="h-3 w-3 shrink-0 text-zinc-500" />
                          <span>{inq.phone}</span>
                        </a>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-xs uppercase max-w-[150px] truncate">
                        {inq.subject || "No Subject"}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-muted-foreground max-w-xs truncate">
                        {inq.message}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-muted-foreground font-mono">
                        {new Date(inq.createdAt).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant={inq.status === "resolved" ? "default" : "destructive"}>
                          {inq.status === "resolved" ? "Resolved" : "Pending"}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            title="View Full Details"
                            onClick={() => setSelectedInquiry(inq)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            title={inq.status === "resolved" ? "Mark Pending" : "Mark Resolved"}
                            onClick={() => handleStatusToggle(inq)}
                            className="text-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-500"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Delete Inquiry"
                            onClick={() => handleDeleteClick(inq)}
                            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
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
          )}

          {/* Pagination Footer */}
          {!isLoading && totalPages > 1 && (
            <div className="flex justify-between items-center border-t border-border pt-4 mt-4">
              <span className="text-xs text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Inquiry Detail Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card border border-border w-full max-w-lg rounded-lg shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center p-4 border-b border-border bg-muted/40">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg uppercase tracking-wider text-foreground">
                  Inquiry Details
                </h3>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSelectedInquiry(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Contact Info Header */}
              <div className="grid grid-cols-2 gap-4 text-xs border-b border-border pb-4">
                <div className="space-y-1">
                  <p className="font-bold text-muted-foreground uppercase tracking-widest text-[9px]">Sender Name</p>
                  <p className="font-semibold text-sm text-foreground">{selectedInquiry.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-muted-foreground uppercase tracking-widest text-[9px]">Inquiry Status</p>
                  <div>
                    <Badge variant={selectedInquiry.status === "resolved" ? "default" : "destructive"}>
                      {selectedInquiry.status === "resolved" ? "Resolved" : "Pending"}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-muted-foreground uppercase tracking-widest text-[9px]">Email Address</p>
                  <a href={`mailto:${selectedInquiry.email}`} className="text-primary hover:underline font-medium">
                    {selectedInquiry.email}
                  </a>
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-muted-foreground uppercase tracking-widest text-[9px]">Phone Number</p>
                  <a href={`tel:${selectedInquiry.phone}`} className="text-primary hover:underline font-medium">
                    {selectedInquiry.phone}
                  </a>
                </div>
              </div>

              {/* Message Spec Box */}
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
                  <span>Subject: {selectedInquiry.subject || "No Subject"}</span>
                  <span className="flex items-center gap-1 font-mono">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(selectedInquiry.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="bg-secondary/40 border border-zinc-800 rounded-md p-4 text-sm leading-relaxed text-zinc-300 whitespace-pre-wrap max-h-60 overflow-y-auto font-sans">
                  {selectedInquiry.message}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 border-t border-border flex justify-between items-center bg-muted/40">
              <Button
                variant="destructive"
                size="sm"
                className="gap-1.5"
                onClick={() => {
                  handleDeleteClick(selectedInquiry);
                }}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusToggle(selectedInquiry)}
                  className="border-emerald-500 hover:bg-emerald-500/10 text-emerald-500"
                >
                  {selectedInquiry.status === "resolved" ? "Mark Pending" : "Mark Resolved"}
                </Button>
                <Button variant="secondary" size="sm" onClick={() => setSelectedInquiry(null)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card border border-border w-full max-w-sm rounded-lg shadow-lg overflow-hidden animate-in fade-in duration-150">
            <div className="p-6">
              <h3 className="font-semibold text-lg mb-2">Delete Inquiry</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Are you sure you want to delete the inquiry from <strong>{inquiryToDelete?.name}</strong>? This action is permanent.
              </p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleConfirmDelete}>
                  Confirm Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
