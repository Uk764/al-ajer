"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/shared/context/AuthContext";
import {
  getStaff,
  createStaff,
  updateAdminUser,
  deleteAdminUser,
  AdminUser,
} from "@/shared/lib/api";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Plus, Pencil, Trash2, X, RefreshCw } from "lucide-react";

export default function AdminStaffPage() {
  const { token } = useAuth();
  const [staffList, setStaffList] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Modal / Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<AdminUser | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "staff",
    phone: "",
    isActive: true,
  });

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState<AdminUser | null>(null);

  useEffect(() => {
    fetchData();
  }, [token]);

  async function fetchData() {
    if (!token) return;
    setIsLoading(true);
    setError("");
    try {
      const data = await getStaff(token);
      setStaffList(data);
    } catch {
      setError("Failed to load staff list.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleAddClick() {
    setEditingStaff(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "staff",
      phone: "",
      isActive: true,
    });
    setError("");
    setIsModalOpen(true);
  }

  function handleEditClick(staff: AdminUser) {
    setEditingStaff(staff);
    setFormData({
      name: staff.name,
      email: staff.email,
      password: "", // blank by default on edit
      role: staff.role,
      phone: staff.phone || "",
      isActive: staff.isActive !== false,
    });
    setError("");
    setIsModalOpen(true);
  }

  function handleDeleteClick(staff: AdminUser) {
    setStaffToDelete(staff);
    setIsDeleteConfirmOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!token) return;

    try {
      const payload: Record<string, unknown> = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        phone: formData.phone || null,
        isActive: formData.isActive,
      };

      if (formData.password) {
        payload.password = formData.password;
      }

      if (editingStaff) {
        await updateAdminUser(token, editingStaff._id, payload);
        setSuccess("Staff member updated successfully.");
      } else {
        if (!formData.password) {
          setError("Password is required for new staff members.");
          return;
        }
        await createStaff(token, payload);
        setSuccess("Staff member created successfully.");
      }

      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      setError(err.message || "Operation failed.");
    }
  }

  async function handleConfirmDelete() {
    if (!token || !staffToDelete) return;
    setError("");
    setSuccess("");

    try {
      await deleteAdminUser(token, staffToDelete._id);
      setSuccess("Staff member deleted successfully.");
      setIsDeleteConfirmOpen(false);
      setStaffToDelete(null);
      fetchData();
    } catch (err: any) {
      setError(err.message || "Failed to delete staff member.");
      setIsDeleteConfirmOpen(false);
    }
  }

  const roleColors: Record<string, string> = {
    admin: "bg-red-500/10 text-red-500 border border-red-500/20",
    manager: "bg-purple-500/10 text-purple-500 border border-purple-500/20",
    cashier: "bg-blue-500/10 text-blue-500 border border-blue-500/20",
    staff: "bg-zinc-500/10 text-zinc-400 border border-zinc-500/20",
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Staff Management</h1>
          <p className="text-sm text-muted-foreground">Manage administrative team members and authorization roles</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={fetchData} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
          <Button onClick={handleAddClick} className="gap-2">
            <Plus className="h-4 w-4" /> Add Team Member
          </Button>
        </div>
      </div>

      {error && <div className="bg-destructive/15 text-destructive p-3 rounded-md mb-4 text-sm">{error}</div>}
      {success && <div className="bg-green-600/15 text-green-500 p-3 rounded-md mb-4 text-sm">{success}</div>}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Staff List ({staffList.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground text-sm">Loading staff members...</div>
          ) : staffList.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">No staff members found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border text-muted-foreground font-medium">
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Phone</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {staffList.map((staff) => (
                    <tr key={staff._id} className="hover:bg-secondary/40 transition-colors">
                      <td className="py-3 px-4 font-medium">{staff.name}</td>
                      <td className="py-3 px-4 text-muted-foreground">{staff.email}</td>
                      <td className="py-3 px-4 text-muted-foreground">{staff.phone || "N/A"}</td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2.5 py-1 rounded capitalize font-medium ${roleColors[staff.role] || "bg-zinc-500/10 text-zinc-400"}`}>
                          {staff.role}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={staff.isActive !== false ? "default" : "secondary"}>
                          {staff.isActive !== false ? "Active" : "Disabled"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditClick(staff)}
                            title="Edit Staff Member"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(staff)}
                            title="Delete Staff Member"
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

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card border border-border w-full max-w-md rounded-lg shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center p-4 border-b border-border">
              <h3 className="font-semibold text-lg">{editingStaff ? "Edit Staff Member" : "Add Staff Member"}</h3>
              <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                    placeholder="e.g. John Doe"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                    placeholder="e.g. john@alajer.com"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password">Password {editingStaff && "(Leave blank to keep current)"}</Label>
                  <Input
                    type="password"
                    id="password"
                    value={formData.password}
                    onChange={(e) => setFormData((p) => ({ ...p, password: e.target.value }))}
                    placeholder={editingStaff ? "••••••••" : "At least 6 characters"}
                    required={!editingStaff}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="role">Role</Label>
                    <select
                      id="role"
                      value={formData.role}
                      onChange={(e) => setFormData((p) => ({ ...p, role: e.target.value }))}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="staff">Staff</option>
                      <option value="cashier">Cashier</option>
                      <option value="manager">Manager</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                      placeholder="e.g. 05XXXXXXXX"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData((p) => ({ ...p, isActive: e.target.checked }))}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="isActive" className="cursor-pointer">Active Account</Label>
                </div>
              </div>
              <div className="p-4 border-t border-border flex justify-end gap-2 bg-secondary/20">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingStaff ? "Save Changes" : "Create Account"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card border border-border w-full max-w-sm rounded-lg shadow-lg overflow-hidden animate-in fade-in duration-150">
            <div className="p-6">
              <h3 className="font-semibold text-lg mb-2">Delete Staff Member</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Are you sure you want to delete staff member <strong>{staffToDelete?.name}</strong>? They will lose access to the Admin Panel immediately.
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
