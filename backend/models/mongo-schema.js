import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  dep_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: false,
  },
});

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const examSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const markSchema = new mongoose.Schema({
  subject_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: false,
  },
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: false,
  },
  exam_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exam",
    required: false,
  },
  mark: {
    type: Number,
    required: false,
  },
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
});

const categorySchema = new mongoose.Schema({
  name: String,
  image: String,
});

const productSchema = new mongoose.Schema({
  name: String,
  discription: String,
  price: Number,
  specialPrice: Number,
  isFixedPrice: Boolean,
  stock: Number,
  image: String,
  attributes: Array,
  categoryId: String,
});

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    minOrder: {
      type: Number,
      required: false,
    },
    isFixed: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Student = mongoose.model("Student", studentSchema);
const Department = mongoose.model("Department", departmentSchema);
const Subject = mongoose.model("Subject", subjectSchema);
const Mark = mongoose.model("Mark", markSchema);
const Exam = mongoose.model("Exam", examSchema);
const User = mongoose.model("User", userSchema);
const Post = mongoose.model("Post", postSchema);
const Product = mongoose.model("Product", productSchema);
const Category = mongoose.model("Category", categorySchema);
const Coupon = mongoose.model("Coupon", couponSchema);

export {
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
};