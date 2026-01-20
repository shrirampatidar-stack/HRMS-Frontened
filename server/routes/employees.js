import express from "express";
import { body, validationResult } from "express-validator";
import Employee from "../models/Employee.js";

const router = express.Router();

// Validation middleware
const validateEmployee = [
  body("employeeId")
    .trim()
    .notEmpty()
    .withMessage("Employee ID is required"),
  body("fullName")
    .trim()
    .notEmpty()
    .withMessage("Full Name is required")
    .isLength({ min: 2 })
    .withMessage("Full Name must be at least 2 characters long"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address"),
  body("department")
    .trim()
    .notEmpty()
    .withMessage("Department is required"),
];

// GET /api/employees - Get all employees
router.get("/", async (req, res, next) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.json(employees);
  } catch (error) {
    next(error);
  }
});

// GET /api/employees/:id - Get employee by ID
router.get("/:id", async (req, res, next) => {
  try {
    const employee = await Employee.findOne({
      employeeId: req.params.id,
    });
    
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    
    res.json(employee);
  } catch (error) {
    next(error);
  }
});

// POST /api/employees - Create a new employee
router.post("/", validateEmployee, async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { employeeId, fullName, email, department } = req.body;

    // Check if employee with same ID already exists
    const existingEmployee = await Employee.findOne({ employeeId });
    if (existingEmployee) {
      return res.status(409).json({
        message: "Employee with this ID already exists",
      });
    }

    // Check if employee with same email already exists
    const existingEmail = await Employee.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return res.status(409).json({
        message: "Employee with this email already exists",
      });
    }

    const employee = new Employee({
      employeeId,
      fullName,
      email: email.toLowerCase(),
      department,
    });

    await employee.save();
    res.status(201).json(employee);
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error
      const field = Object.keys(error.keyPattern)[0];
      return res.status(409).json({
        message: `Employee with this ${field} already exists`,
      });
    }
    next(error);
  }
});

// DELETE /api/employees/:id - Delete an employee
router.delete("/:id", async (req, res, next) => {
  try {
    const employee = await Employee.findOneAndDelete({
      employeeId: req.params.id,
    });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Also delete all attendance records for this employee
    const { default: Attendance } = await import("../models/Attendance.js");
    await Attendance.deleteMany({ employeeId: req.params.id });

    res.json({ message: "Employee deleted successfully", employee });
  } catch (error) {
    next(error);
  }
});

export default router;
