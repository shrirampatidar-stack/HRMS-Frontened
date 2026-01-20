import { useEffect, useState } from "react";
import { api } from "../services/api";
import Card from "../components/ui/Card";
import Loader from "../components/ui/Loader";
import EmptyState from "../components/ui/EmptyState";
import { useToast } from "../hooks/useToast";
import Layout from "../components/layout/Layout";
import {
  Table,
  TableHeader,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
} from "../components/ui/Table";
import Badge from "../components/ui/Badge";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalPresentToday: 0,
    totalAbsentToday: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentAttendance, setRecentAttendance] = useState([]);
  const { showToast } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load employees
      const employeesResponse = await api.get("/employees");
      const employees = employeesResponse.data || [];

      // Load today's attendance
      const today = new Date().toISOString().split("T")[0];
      let todayAttendance = [];

      try {
        const attendanceResponse = await api.get(`/attendance/date/${today}`);
        todayAttendance = attendanceResponse.data || [];
      } catch (err) {
        // If date endpoint doesn't exist, fetch all and filter
        if (err.response?.status === 404) {
          const attendancePromises = employees.slice(0, 5).map(async (emp) => {
            try {
              const empAttendance = await api.get(
                `/attendance/${emp.employeeId || emp._id}`
              );
              return empAttendance.data || [];
            } catch {
              return [];
            }
          });

          const allAttendance = await Promise.all(attendancePromises);
          todayAttendance = allAttendance
            .flat()
            .filter((record) => {
              const recordDate = new Date(record.date).toISOString().split("T")[0];
              return recordDate === today;
            });
        }
      }

      const presentToday = todayAttendance.filter(
        (a) => a.status === "Present"
      ).length;
      const absentToday = todayAttendance.filter(
        (a) => a.status === "Absent"
      ).length;

      // Get recent attendance records
      const recentRecords = [];
      for (const emp of employees.slice(0, 10)) {
        try {
          const empAttendance = await api.get(
            `/attendance/${emp.employeeId || emp._id}`
          );
          const records = empAttendance.data || [];
          if (records.length > 0) {
            const latest = records.sort(
              (a, b) => new Date(b.date) - new Date(a.date)
            )[0];
            recentRecords.push({
              employee: emp.fullName,
              employeeId: emp.employeeId,
              date: latest.date,
              status: latest.status,
            });
          }
        } catch {
          // Skip if error
        }
      }

      setStats({
        totalEmployees: employees.length,
        totalPresentToday: presentToday,
        totalAbsentToday: absentToday,
      });
      setRecentAttendance(recentRecords.slice(0, 5));
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to load dashboard data",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color, gradient }) => (
    <Card className="p-6 bg-gradient-to-br from-white/95 to-white/80 hover:from-white to-white/95 group cursor-pointer">
      <div className="flex items-center justify-between relative z-10">
        <div className="flex-1">
          <p className="text-sm font-bold text-gray-600 mb-3 uppercase tracking-wide">{title}</p>
          <p className={`text-5xl font-black ${gradient} bg-clip-text text-transparent animate-bounce-in`}>
            {value}
          </p>
        </div>
        <div className={`p-5 rounded-2xl ${gradient.replace("bg-gradient-to-r ", "")} shadow-2xl opacity-95 group-hover:opacity-100 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 animate-float`}>
          <div className="text-white drop-shadow-lg">
            {icon}
          </div>
        </div>
      </div>
      {/* Decorative gradient line */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-2xl`}></div>
    </Card>
  );

  return (
    <Layout title="Dashboard">
      <div className="space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Total Employees"
            value={stats.totalEmployees}
            gradient="bg-gradient-to-r from-blue-600 to-indigo-600"
            icon={
              <svg
                className="w-7 h-7"
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
          <StatCard
            title="Present Today"
            value={stats.totalPresentToday}
            gradient="bg-gradient-to-r from-green-500 to-emerald-600"
            icon={
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
          />
          <StatCard
            title="Absent Today"
            value={stats.totalAbsentToday}
            gradient="bg-gradient-to-r from-red-500 to-pink-600"
            icon={
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
          />
        </div>

        {/* Recent Attendance */}
        <Card
          title="Recent Attendance"
          subtitle="Latest attendance records across employees"
        >
          {loading ? (
            <div className="py-12">
              <Loader size="lg" />
            </div>
          ) : recentAttendance.length === 0 ? (
            <EmptyState
              title="No recent attendance records"
              description="Attendance records will appear here once employees mark their attendance."
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
            <Table>
              <TableHeader>
                <TableHeaderCell>Employee</TableHeaderCell>
                <TableHeaderCell>Employee ID</TableHeaderCell>
                <TableHeaderCell>Date</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
              </TableHeader>
              <TableBody>
                {recentAttendance.map((record, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{record.employee}</TableCell>
                    <TableCell className="text-gray-600">{record.employeeId}</TableCell>
                    <TableCell className="text-gray-600">
                      {new Date(record.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={record.status === "Present" ? "success" : "danger"}
                      >
                        {record.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>
    </Layout>
  );
}
