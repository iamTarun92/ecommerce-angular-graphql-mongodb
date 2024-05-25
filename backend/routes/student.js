import express from "express";
import {
  handlegetDepartmentss,
  handlegetMarks,
  handlegetStudentss,
  handlegetSubjectss,
  addStudent,
  forgotPassword,
} from "../controllers/db.js";

const router = express.Router();

router.get("/departments", handlegetDepartmentss);
router.get("/marks", handlegetMarks);
router.get("/students", handlegetStudentss);
router.get("/subjects", handlegetSubjectss);
router.post("/students", addStudent);
router.post("/forgot-pasword", forgotPassword);
export { router };
