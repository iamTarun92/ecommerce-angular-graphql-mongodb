import {
  Student,
  Mark,
  User,
  Product,
  Category,
  Coupon,
  Wishlist,
  Address,
  Order,
  Review,
} from "./mongo-schema.js";
import bcrypt from "bcrypt";
import { crateToken } from "../controllers/db.js";

const Query = {
  getCategories: async () => await Category.find(),

  getProducts: async () => await Product.find(),

  getProductById: async (parent, { id }) => {
    return await Product.findById(id);
  },

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
    return await Coupon.findOne({ code });
  },

  getWishlists: async (parent, { email }) => {
    return await Wishlist.find({ email });
  },

  getAddressByEmail: async (parent, { email }) => {
    return await Address.find({ email });
  },

  signIn: async (_, { newUser }) => {
    try {
      const { email, password } = newUser;
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("Invalid email.");
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error("Invalid password.");
      }
      const token = await crateToken(user._id);
      return { user, token };
    } catch (error) {
      throw error;
    }
  },

  getOrders: async () => {
    return await Order.find();
  },

  getOrdersByEmail: async (parent, { email }) => {
    return await Order.find({ email });
  },

  getOrderByOrderId: async (parent, { orderId }) => {
    return await Order.findOne({ orderId });
  },

  getReviewsByProductId: async (parent, { product }) => {
    return await Review.find({ product });
  },
};

export default Query;
