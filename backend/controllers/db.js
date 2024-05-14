import { Student, Department, Subject, Mark, Exam } from "../models/mongo-schema.js";
import mongoose from "mongoose";

async function handlegetSubjectss(req, res) {
  const subjects = await Subject.find();
  res.json(subjects);
}

async function handlegetMarks(req, res) {
  const marks = await Mark.aggregate([
    // {
    //   $match: {
    //     "student_id._id": ObjectId("661fbdbd92c125f5eee4365f"),
    //   },
    // },
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
}

async function handlegetStudentss(req, res) {
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
}

async function handlegetDepartmentss(req, res) {
  const departments = await Department.find();
  res.json(departments);
}

async function addStudent(req, res) {
  try {
    const { name, age, gender } = req.body;

    const doc = new Student({ name, age, gender });
    await doc.save();
    res.status(200).send("Document inserted successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to insert document");
  }
}

export {
  handlegetSubjectss,
  handlegetMarks,
  handlegetStudentss,
  handlegetDepartmentss,
  addStudent,
};
