import {
  Student,
  Department,
  Subject,
  Mark,
  Exam,
  User,
  Post,
  Product,
  Category,
  Coupon,
} from "./mongo-schema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";

const resolvers = {
  Student: {
    dep_id: async (student) =>
      await Department.findOne({ _id: student.dep_id }),
    gender: (student) => student.gender,
  },
  Post: {
    author: async (post) => await User.findOne({ _id: post.author }),
  },
  Mark: {
    student_id: async (mark) => await Student.findOne({ _id: mark.student_id }),
    exam_id: async (mark) => await Exam.findOne({ _id: mark.exam_id }),
    subject_id: async (mark) => await Subject.findOne({ _id: mark.subject_id }),
  },
  Query: {
    getCategories: async () => await Category.find(),
    getProducts: async () => await Product.find(),
    getProductById: async (parent, { productId }) => await Product.findById(productId),
    getStudentByFilter: async (parent, { name, age }) => {
      let filter = {};
      if (name || age) {
        filter.$and = [];
        if (name) {
          filter.$and.push({ name: name });
        }
        if (age) {
          filter.$and.push({ age: age });
        }
      }
      return await Student.find(filter);
    },
    getMarkByFilter: async (parent, { student_id }) => {
      const marks = await Mark.aggregate([
        {
          $match: {
            $expr: { student_id },
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
        // Group the matched documents by exam_id._id and calculate the average mark for each group
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
      return marks;
    },
    getCoupons: async () => {
      return await Coupon.find();
    },
    getCouponById: async (parent, { id }) => {
      return await Coupon.findById(id);
    },
    getCouponByCode: async (parent, { code }) => {
      return await Coupon.findOne({code});
    },
  },
  Mutation: {
    signUp: async (_, { newUser }) => {
      try {
        // Check if the email is already registered
        const existingUser = await User.findOne({ email: newUser.email });
        if (existingUser) {
          throw new Error("Email already registered.");
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(newUser.password, 10);

        // Create a new user
        const doc = new User({
          ...newUser,
          password: hashedPassword,
        });
        return await doc.save();
      } catch (error) {
        throw error;
      }
    },
    signIn: async (_, { newUser }) => {
      try {
        const user = await User.findOne({ email: newUser.email });
        if (!user) {
          throw new Error("Invalid email.");
        }
        const isPasswordValid = await bcrypt.compare(
          newUser.password,
          user.password
        );
        if (!isPasswordValid) {
          throw new Error("Invalid password.");
        }
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
          expiresIn: "1h",
        });
        return { token };
      } catch (error) {
        throw error;
      }
    },
    addPost: async (parent, { post }, { userId }) => {
      if (!userId) {
        throw new Error("Authentication required");
      }

      const newPost = new Post({ ...post, author: userId });
      await newPost.save();
      return newPost;
    },
  },
};

export default resolvers;

// const createDoc = async () => {
//   try {
//     const data = new Student({
//       name: "sass",
//       age: 20,
//     });

//     const result = await data.save();
//     console.log(result);
//   } catch (error) {
//     console.log(error);
//   }
// };
