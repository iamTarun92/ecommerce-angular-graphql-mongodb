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
  Wishlist,
  Address,
  Order,
  Review,
} from "./mongo-schema.js";
import Mutation from "./mutation-gql.js";
import Query from "./query-gql.js";

const resolvers = {
  Student: {
    dep_id: async (student) =>
      await Department.findOne({ _id: student.dep_id }),
    gender: (student) => student.gender,
  },
  Post: {
    author: async (post) => await User.findOne({ _id: post.author }),
  },
  Product: {
    categoryId: async (product) =>
      await Category.findOne({ _id: product.categoryId }),
  },
  Wishlist: {
    productId: async (product) =>
      await Product.findOne({ _id: product.productId }),
  },
  Review: {
    author: async (review) => await User.findOne({ _id: review.author }),
    product: async (review) => await Product.findOne({ _id: review.product }),
  },
  Mark: {
    student_id: async (mark) => await Student.findOne({ _id: mark.student_id }),
    exam_id: async (mark) => await Exam.findOne({ _id: mark.exam_id }),
    subject_id: async (mark) => await Subject.findOne({ _id: mark.subject_id }),
  },
  Query,
  Mutation,
};

export default resolvers;
