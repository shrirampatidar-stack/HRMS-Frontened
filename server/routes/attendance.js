import express from "express";
import { body, validationResult } from "express-validator";
import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";

const router = express.Router();

// Validation middleware
const validateAttendance = [
  body("employeeId")
    .trim()
    .notEmpty()
    .withMessage("Employee ID is required"),
  body("date")
    .notEmpty()
    .withMessage("Date is required")
    .isISO8601()
    .withMessage("Please provide a valid date"),
  body("status")
    .isIn(["Present", "Absent"])
    .withMessage("Status must be either 'Present' or 'Absent'"),
];

// POST /api/attendance - Mark attendance
router.post("/", validateAttendance, async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { employeeId, date, status } = req.body;

    // Check if employee exists
    const employee = await Employee.findOne({ employeeId });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Ensure date is set to start of day for consistency
    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    // Check if attendance already marked for this date
    const existingAttendance = await Attendance.findOne({
      employeeId,
      date: attendanceDate,
    });

    if (existingAttendance) {
      // Update existing attendance
      existingAttendance.status = status;
      await existingAttendance.save();
      return res.json({
        message: "Attendance updated successfully",
        attendance: existingAttendance,
      });
    }

    // Create new attendance record
    const attendance = new Attendance({
      employeeId,
      date: attendanceDate,
      status,
    });

    await attendance.save();
    res.status(201).json({
      message: "Attendance marked successfully",
      attendance,
    });
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error (shouldn't happen with update logic above, but just in case)
      return res.status(409).json({
        message: "Attendance already marked for this date",
      });
    }
    next(error);
  }
});

// GET /api/attendance/:employeeId - Get attendance records for an employee
router.get("/:employeeId", async (req, res, next) => {
  try {
    const { employeeId } = req.params;

    // Check if employee exists
    const employee = await Employee.findOne({ employeeId });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const records = await Attendance.find({ employeeId })
      .sort({ date: -1 })
      .select("-__v");

    res.json(records);
  } catch (error) {
    next(error);
  }
});

// GET /api/attendance/date/:date - Get attendance records for a specific date
router.get("/date/:date", async (req, res, next) => {
  try {
    const { date } = req.params;
    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    const nextDay = new Date(attendanceDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const records = await Attendance.find({
      date: {
        $gte: attendanceDate,
        $lt: nextDay,
      },
    })
      .sort({ createdAt: -1 })
      .select("-__v");

    res.json(records);
  } catch (error) {
    next(error);
  }
});

export default router;
