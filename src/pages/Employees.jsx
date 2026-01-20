import { useEffect, useState } from "react";
import { api } from "../services/api";
import Layout from "../components/layout/Layout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Modal from "../components/ui/Modal";
import Loader from "../components/ui/Loader";
import EmptyState from "../components/ui/EmptyState";
import { useToast } from "../hooks/useToast";
import { useModal } from "../hooks/useModal";
import {
  Table,
  TableHeader,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
} from "../components/ui/Table";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, employee: null });
  const { showToast } = useToast();
  const addModal = useModal();

  const [form, setForm] = useState({
    employeeId: "",
    fullName: "",
    email: "",
    department: "",
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const response = await api.get("/employees");
      // Ensure we always set an array, even if response.data is null/undefined
      const employeesList = Array.isArray(response.data) ? response.data : [];
      setEmployees(employeesList);
      console.log("Loaded employees from database:", employeesList.length);
    } catch (err) {
      console.error("Error loading employees:", err);
      showToast(
        err.response?.data?.message || "Failed to load employees",
        "error"
      );
      // Set empty array on error to clear the list
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!form.employeeId.trim()) {
      errors.employeeId = "Employee ID is required";
    }

    if (!form.fullName.trim()) {
      errors.fullName = "Full Name is required";
    } else if (form.fullName.trim().length < 2) {
      errors.fullName = "Full Name must be at least 2 characters";
    }

    if (!form.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = "Invalid email format";
    }

    if (!form.department.trim()) {
      errors.department = "Department is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      await api.post("/employees", form);
      setForm({ employeeId: "", fullName: "", email: "", department: "" });
      setFormErrors({});
      addModal.close();
      showToast("Employee added successfully!", "success");
      loadEmployees();
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to add employee",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.employee) return;

    const employeeToDelete = deleteModal.employee;
    // Use database id (Long) instead of employeeId (String) for deletion
    const databaseId = employeeToDelete.id;
    
    if (!databaseId) {
      showToast("Invalid employee data. Cannot delete.", "error");
      setDeleteModal({ isOpen: false, employee: null });
      return;
    }
    
    // Store the employee for potential rollback
    const deletedEmployee = { ...employeeToDelete };
    
    // Close modal immediately
    setDeleteModal({ isOpen: false, employee: null });
    
    // Optimistically remove from UI immediately - MUST happen before API call
    setEmployees(prev => {
      return prev.filter(emp => emp.id !== databaseId);
    });
    
    try {
      // Delete from backend using database id
      const response = await api.delete(`/employees/${databaseId}`);
      
      // Check if deletion was successful
      // Accept 200/204 status codes or response with success message
      const isSuccess = 
        response.status === 200 || 
        response.status === 204 || 
        (response.data && (response.data.success === true || response.data.success === 'true' || response.data.message));
      
      if (isSuccess) {
        // Show success message
        showToast("Employee deleted successfully from database!", "success");
        // Refresh the list to ensure consistency with database
        // Small delay to ensure backend has processed
        setTimeout(async () => {
          await loadEmployees();
        }, 300);
      } else {
        throw new Error(response.data?.error || response.data?.message || "Delete operation failed");
      }
      
    } catch (err) {
      // If delete fails, restore the employee to the list
      setEmployees(prev => {
        // Check if employee is already in the list
        const exists = prev.some(emp => emp.id === databaseId);
        
        if (!exists) {
          // Restore the deleted employee at the end
          return [...prev, deletedEmployee];
        }
        return prev;
      });
      
      // Log error for debugging
      console.error("Delete error:", err);
      
      const errorMessage = 
        err.response?.data?.error || 
        err.response?.data?.message || 
        err.message || 
        "Failed to delete employee from database. Please try again.";
      
      showToast(errorMessage, "error");
    }
  };

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
    if (formErrors[field]) {
      setFormErrors({ ...formErrors, [field]: "" });
    }
  };

  return (
    <Layout
      title="Employees"
      topbarActions={
        <Button onClick={addModal.open} variant="primary">
          <svg
            className="w-5 h-5 inline mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Employee
        </Button>
      }
    >
      <div className="space-y-6">
        <Card>
          {loading ? (
            <div className="py-12">
              <Loader size="lg" />
            </div>
          ) : employees.length === 0 ? (
            <EmptyState
              title="No employees found"
              description="Get started by adding your first employee to the system."
              action={
                <Button onClick={addModal.open} variant="primary">
                  Add First Employee
                </Button>
              }
              icon={
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              }
            />
          ) : (
            <Table>
              <TableHeader>
                <TableHeaderCell>Employee ID</TableHeaderCell>
                <TableHeaderCell>Full Name</TableHeaderCell>
                <TableHeaderCell>Email</TableHeaderCell>
                <TableHeaderCell>Department</TableHeaderCell>
                <TableHeaderCell className="text-right">Actions</TableHeaderCell>
              </TableHeader>
              <TableBody>
                {employees.map((employee) => {
                  // Use database id as key for React rendering
                  const employeeKey = employee.id || employee.employeeId || employee._id;
                  return (
                    <TableRow key={employeeKey}>
                      <TableCell className="font-black text-lg bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent animate-pulse-glow">
                        {employee.employeeId}
                      </TableCell>
                      <TableCell className="font-medium">{employee.fullName}</TableCell>
                      <TableCell className="text-gray-600">{employee.email}</TableCell>
                      <TableCell>{employee.department}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() =>
                            setDeleteModal({ isOpen: true, employee })
                          }
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>

      {/* Add Employee Modal */}
      <Modal
        isOpen={addModal.isOpen}
        onClose={addModal.close}
        title="Add New Employee"
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Employee ID"
            required
            value={form.employeeId}
            onChange={(e) => handleChange("employeeId", e.target.value)}
            error={formErrors.employeeId}
            placeholder="Enter unique Employee ID"
          />

          <Input
            label="Full Name"
            required
            value={form.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            error={formErrors.fullName}
            placeholder="Enter full name"
          />

          <Input
            label="Email Address"
            type="email"
            required
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            error={formErrors.email}
            placeholder="Enter email address"
          />

          <Input
            label="Department"
            required
            value={form.department}
            onChange={(e) => handleChange("department", e.target.value)}
            error={formErrors.department}
            placeholder="Enter department"
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={addModal.close}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? "Adding..." : "Add Employee"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, employee: null })}
        title="Delete Employee"
        size="sm"
      >
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-gray-900">
            {deleteModal.employee?.fullName}
          </span>
          ? This action cannot be undone and will also delete all attendance records
          for this employee.
        </p>
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => setDeleteModal({ isOpen: false, employee: null })}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </Modal>
    </Layout>
  );
}
