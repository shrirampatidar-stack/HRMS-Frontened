import { useEffect, useState } from "react";
import { api } from "../services/api";
import Layout from "../components/layout/Layout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Loader from "../components/ui/Loader";
import EmptyState from "../components/ui/EmptyState";
import Badge from "../components/ui/Badge";
import { useToast } from "../hooks/useToast";
import {
  Table,
  TableHeader,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
} from "../components/ui/Table";

export default function Attendance() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [filterDate, setFilterDate] = useState("");
  const { showToast } = useToast();

  const [attendanceForm, setAttendanceForm] = useState({
    date: new Date().toISOString().split("T")[0],
    status: "Present",
  });

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const response = await api.get("/employees");
      setEmployees(response.data || []);
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to load employees",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const loadRecords = async (employeeId) => {
    if (!employeeId) {
      setRecords([]);
      return;
    }

    try {
      setRecordsLoading(true);
      const response = await api.get(`/attendance/${employeeId}`);
      setRecords(response.data || []);
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to load attendance records",
        "error"
      );
    } finally {
      setRecordsLoading(false);
    }
  };

  const handleEmployeeSelect = (e) => {
    const employeeId = e.target.value;
    setSelectedEmployeeId(employeeId);
    setFilterDate("");
    if (employeeId) {
      loadRecords(employeeId);
    } else {
      setRecords([]);
    }
  };

  const handleMarkAttendance = async (e) => {
    e.preventDefault();

    if (!selectedEmployeeId) {
      showToast("Please select an employee first", "warning");
      return;
    }

    try {
      setSubmitting(true);
      await api.post("/attendance", {
        employeeId: selectedEmployeeId,
        date: attendanceForm.date,
        status: attendanceForm.status,
      });
      showToast("Attendance marked successfully!", "success");
      setAttendanceForm({
        date: new Date().toISOString().split("T")[0],
        status: "Present",
      });
      loadRecords(selectedEmployeeId);
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to mark attendance",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const getFilteredRecords = () => {
    if (!filterDate) return records;
    return records.filter((record) => {
      const recordDate = new Date(record.date).toISOString().split("T")[0];
      return recordDate === filterDate;
    });
  };

  const getTotalPresentDays = () => {
    return records.filter((r) => r.status === "Present").length;
  };

  const selectedEmployee = employees.find(
    (e) => (e.employeeId || e._id) === selectedEmployeeId
  );

  const filteredRecords = getFilteredRecords();
  const employeeOptions = employees.map((emp) => ({
    value: emp.employeeId || emp._id,
    label: `${emp.fullName} (${emp.employeeId})`,
  }));

  return (
    <Layout title="Attendance Management">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Mark Attendance Card */}
        <Card title="Mark Attendance">
          <form onSubmit={handleMarkAttendance} className="space-y-4">
            <Select
              label="Select Employee"
              required
              value={selectedEmployeeId}
              onChange={handleEmployeeSelect}
              options={employeeOptions}
              placeholder="Choose an employee"
            />

            <Input
              label="Date"
              type="date"
              required
              value={attendanceForm.date}
              onChange={(e) =>
                setAttendanceForm({ ...attendanceForm, date: e.target.value })
              }
              max={new Date().toISOString().split("T")[0]}
            />

            <Select
              label="Status"
              required
              value={attendanceForm.status}
              onChange={(e) =>
                setAttendanceForm({ ...attendanceForm, status: e.target.value })
              }
              options={[
                { value: "Present", label: "Present" },
                { value: "Absent", label: "Absent" },
              ]}
            />

            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={!selectedEmployeeId || submitting}
            >
              {submitting ? "Marking..." : "Mark Attendance"}
            </Button>
          </form>
        </Card>

        {/* Attendance Records Card */}
        <Card title="Attendance Records">
          {loading ? (
            <div className="py-12">
              <Loader size="lg" />
            </div>
          ) : !selectedEmployeeId ? (
            <EmptyState
              title="No employee selected"
              description="Select an employee from the dropdown to view their attendance records."
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
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              }
            />
          ) : (
            <div className="space-y-4">
              {selectedEmployee && (
                <div className="bg-gradient-to-r from-purple-100/90 via-indigo-100/90 to-purple-100/90 rounded-2xl p-5 border-2 border-purple-300/60 backdrop-blur-sm shadow-xl relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
                  {/* Decorative gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="flex items-center justify-between mb-3 relative z-10">
                    <h4 className="font-black text-gray-900 text-xl gradient-text">
                      {selectedEmployee.fullName}
                    </h4>
                    <Badge variant="primary">{selectedEmployee.employeeId}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm font-bold relative z-10">
                    <span className="text-gray-700">Department: <span className="text-purple-600 font-black">{selectedEmployee.department}</span></span>
                    <span className="font-black bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 bg-clip-text text-transparent text-base animate-pulse-glow">
                      ✨ Total Present: {getTotalPresentDays()}
                    </span>
                  </div>
                  
                  {/* Bottom accent line */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              )}

              <div>
                <Input
                  label="Filter by Date"
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                />
                {filterDate && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFilterDate("")}
                    className="mt-2"
                  >
                    Clear filter
                  </Button>
                )}
              </div>

              {recordsLoading ? (
                <div className="py-8">
                  <Loader />
                </div>
              ) : filteredRecords.length === 0 ? (
                <EmptyState
                  title={
                    filterDate
                      ? "No records found for selected date"
                      : "No attendance records"
                  }
                  description="Mark attendance for this employee to see records here."
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
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  }
                />
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableHeaderCell>Date</TableHeaderCell>
                      <TableHeaderCell>Status</TableHeaderCell>
                    </TableHeader>
                    <TableBody>
                      {filteredRecords.map((record) => (
                        <TableRow key={record._id || record.id}>
                          <TableCell className="font-medium">
                            {new Date(record.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                record.status === "Present" ? "success" : "danger"
                              }
                            >
                              {record.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
}
