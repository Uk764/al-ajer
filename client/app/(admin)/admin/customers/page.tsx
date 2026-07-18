"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/shared/context/AuthContext";
import {
  getCustomers,
  updateAdminUser,
  deleteAdminUser,
  AdminUser,
} from "@/shared/lib/api";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Trash2, RefreshCw, Power } from "lucide-react";

export default function AdminCustomersPage() {
  const { token } = useAuth();
  const [customers, setCustomers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Filter
  const [searchQuery, setSearchQuery] = useState("");

  // Delete Confirm Modal
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<AdminUser | null>(null);

  useEffect(() => {
    fetchData();
  }, [token]);

  async function fetchData() {
    if (!token) return;
    setIsLoading(true);
    setError("");
    try {
      const data = await getCustomers(token);
      setCustomers(data);
    } catch {
      setError("Failed to load customers.");
    } finally {
      setIsLoading(false);
    }
  }

  async function toggleStatus(customer: AdminUser) {
    if (!token) return;
    setError("");
    setSuccess("");

    try {
      await updateAdminUser(token, customer._id, {
        isActive: !customer.isActive,
      });
      setSuccess(`Customer ${customer.name} status updated.`);
      fetchData();
    } catch (err: any) {
      setError(err.message || "Failed to update customer status.");
    }
  }

  function handleDeleteClick(customer: AdminUser) {
    setCustomerToDelete(customer);
    setIsDeleteConfirmOpen(true);
  }

  async function handleConfirmDelete() {
    if (!token || !customerToDelete) return;
    setError("");
    setSuccess("");

    try {
      await deleteAdminUser(token, customerToDelete._id);
      setSuccess("Customer account deleted successfully.");
      setIsDeleteConfirmOpen(false);
      setCustomerToDelete(null);
      fetchData();
    } catch (err: any) {
      setError(err.message || "Failed to delete customer.");
      setIsDeleteConfirmOpen(false);
    }
  }

  const filteredCustomers = customers.filter((c) => {
    const name = c.name?.toLowerCase() || "";
    const email = c.email?.toLowerCase() || "";
    const phone = c.phone?.toLowerCase() || "";
    const query = searchQuery.toLowerCase();

    return name.includes(query) || email.includes(query) || phone.includes(query);
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
          <p className="text-sm text-muted-foreground">Manage registered customer accounts</p>
        </div>
        <Button variant="outline" size="icon" onClick={fetchData} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {error && <div className="bg-destructive/15 text-destructive p-3 rounded-md mb-4 text-sm">{error}</div>}
      {success && <div className="bg-green-600/15 text-green-500 p-3 rounded-md mb-4 text-sm">{success}</div>}

      <div className="mb-6">
        <Input
          placeholder="Search by Name, Email, or Phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Registered Customers ({filteredCustomers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground text-sm">Loading customers list...</div>
          ) : filteredCustomers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">No customers found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border text-muted-foreground font-medium">
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Phone</th>
                    <th className="py-3 px-4">Joined Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredCustomers.map((customer) => (
                    <tr key={customer._id} className="hover:bg-secondary/40 transition-colors">
                      <td className="py-3 px-4 font-medium">{customer.name}</td>
                      <td className="py-3 px-4 text-muted-foreground">{customer.email}</td>
                      <td className="py-3 px-4 text-muted-foreground">{customer.phone || "N/A"}</td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {new Date(customer.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={customer.isActive !== false ? "default" : "secondary"}>
                          {customer.isActive !== false ? "Active" : "Disabled"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleStatus(customer)}
                            title={customer.isActive ? "Deactivate Account" : "Activate Account"}
                            className={customer.isActive ? "text-amber-500" : "text-emerald-500"}
                          >
                            <Power className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(customer)}
                            title="Delete Customer Account"
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
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card border border-border w-full max-w-sm rounded-lg shadow-lg overflow-hidden animate-in fade-in duration-150">
            <div className="p-6">
              <h3 className="font-semibold text-lg mb-2">Delete Customer Account</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Are you sure you want to permanently delete the customer account for <strong>{customerToDelete?.name}</strong>? All their profile details will be removed.
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
