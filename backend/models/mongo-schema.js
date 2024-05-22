import mongoose from "mongoose";
const { Schema } = mongoose;

const attributeSchema = new Schema({
  name: String,
  options: [
    {
      value: String,
      price: Number,
      description: String,
    },
  ],
});

const addressSchema = new Schema({
  email: String,
  fullName: String,
  phone: String,
  type: String,
  address: {
    street: String,
    city: String,
    state: String,
    zip: String,
  },
});

const studentSchema = new Schema({
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

const departmentSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

const subjectSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

const examSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

const markSchema = new Schema({
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

const userSchema = new Schema({
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
  phone: {
    type: String,
    required: false,
  },
});

const postSchema = new Schema({
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

const categorySchema = new Schema({
  name: String,
  image: String,
});

const attributeSchema2 = new Schema({
  name: String,
  price: Number,
  value: String,
});

const productSchema = new Schema({
  name: String,
  description: String,
  price: Number,
  specialPrice: Number,
  isFixedPrice: Boolean,
  stock: Number,
  image: String,
  attributes: [attributeSchema],
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: false,
  },
  quantity: Number,
  selectedAttributes: [attributeSchema2],
});

const couponSchema = new Schema(
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

const wishlistSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: false,
  },
});

const orderSchema = new Schema({
  email: String,
  orderId: String,
  paymentMethod: String,
  products: [productSchema],
  address: {
    billing: addressSchema,
    delivery: addressSchema,
  },
  name: String,
  transactionId: String,
  amount: Number,
  orderStatus: String,
  paymentStatus: String,
});

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
const Wishlist = mongoose.model("Wishlist", wishlistSchema);
const Address = mongoose.model("Address", addressSchema);
const Order = mongoose.model("Oder", orderSchema);

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
  Wishlist,
  Address,
  Order,
};
