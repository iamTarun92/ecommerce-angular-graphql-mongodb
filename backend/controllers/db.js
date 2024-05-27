import {
  Student,
  Department,
  Subject,
  Mark,
  Exam,
  User,
} from "../models/mongo-schema.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";
import { sendEmail } from "../models/email.js";
import bcrypt from "bcrypt";

export const crateToken = async (userId) => {
  try {
    const payload = { userId };
    const expiryTime = 3000;
    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: expiryTime,
    });
    return token;
  } catch (error) {
    console.warn(error);
  }
};

export const securePassword = async (password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  } catch (error) {
    console.warn(error);
  }
};

export const handlegetSubjectss = async (req, res) => {
  const subjects = await Subject.find();
  res.json(subjects);
};

export const handlegetMarks = async (req, res) => {
  const marks = await Mark.aggregate([
    {
      $match: {
        $expr: { student_id: "661fbdbd92c125f5eee4365f" },
      },
    },
    {
      $lookup: {
        from: "students",
        localField: "student_id",
        foreignField: "_id",
        as: "student_id",
      },
    },
    {
      $unwind: {
        path: "$student_id",
      },
    },
    {
      $lookup: {
        from: "subjects",
        localField: "subject_id",
        foreignField: "_id",
        as: "subject_id",
      },
    },
    {
      $unwind: {
        path: "$subject_id",
      },
    },
    {
      $lookup: {
        from: "exams",
        localField: "exam_id",
        foreignField: "_id",
        as: "exam_id",
      },
    },
    {
      $unwind: {
        path: "$exam_id",
      },
    },
    {
      $addFields: {
        "subjects.mark": "$mark",
      },
    },
    {
      $group: {
        _id: "$exam_id._id",
        students: {
          $push: "$student_id",
        },
        subjects: {
          $push: "$subject_id",
        },
        exams: {
          $push: "$exam_id",
        },
        averageMark: {
          $avg: "$mark",
        },
      },
    },
    {
      $project: {
        student: {
          $first: "$students",
        },
        subjects: 1,
        exams: {
          $first: "$exams",
        },
        averageMark: 1,
      },
    },
  ]);
  res.json(marks);
};

export const handlegetStudentss = async (req, res) => {
  try {
    const students = await Student.find().populate({
      path: "dep_id",
      model: "Department",
    });
    res.json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const handlegetDepartmentss = async (req, res) => {
  const departments = await Department.find();
  res.json(departments);
};

export const addStudent = async (req, res) => {
  try {
    const { name, age, gender } = req.body;

    const doc = new Student({ name, age, gender });
    await doc.save();
    res.status(200).send("Document inserted successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to insert document");
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email }); // Use await to handle the promise
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }

    const token = await crateToken(user._id);
    const updatedUser = await User.updateOne(
      { email },
      { $set: { token } },
      { new: true }
    );
    if (!updatedUser) {
      res.status(500).json({ message: "Failed to update user" });
    }
    const resetURL = `http://localhost:4200/reset?token=${token}`;
    await sendEmail(
      "pandeyt152@gmail.com",
      "Password Reset Request",
      `Please use this link to reset your password: ${resetURL}`
    );

    res.status(200).send("Token has been send on your email.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to process request");
  }
};
