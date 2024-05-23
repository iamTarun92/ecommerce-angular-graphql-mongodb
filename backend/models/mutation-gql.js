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

const Mutation = {
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

  addPost: async (parent, { post }, { userId }) => {
    try {
      if (!userId) {
        throw new Error("Authentication required");
      }

      const newPost = new Post({ ...post, author: userId });
      await newPost.save();
      return newPost;
    } catch (error) {
      throw error;
    }
  },

  addWishlist: async (parent, { email, productId }, { userId }) => {
    try {
      if (!userId) {
        throw new Error("Authentication required");
      }
      const newPost = new Wishlist({ email, productId });
      await newPost.save();
      return newPost;
    } catch (error) {
      throw error;
    }
  },

  deleteWishlist: async (_, { id }) => {
    return await Wishlist.findByIdAndDelete(id);
  },

  addOrder: async (_, { newOrder }) => {
    try {
      const order = new Order({
        ...newOrder,
      });
      await order.save();
      return order;
    } catch (error) {
      throw error;
    }
  },

  addAddress: async (_, { newAddress }) => {
    try {
      const address = new Address({
        ...newAddress,
      });
      await address.save();
      return address;
    } catch (error) {
      throw error;
    }
  },

  updateAddress: async (_, { id, address }) => {
    return await Address.findByIdAndUpdate(id, address, { new: true });
  },

  deleteAddress: async (_, { id }) => {
    return await Address.findByIdAndDelete(id);
  },

  addReview: async (_, { newReview }, { userId }) => {
    try {
      if (!userId) {
        throw new Error("Authentication required");
      }
      const review = new Review({
        ...newReview,
        author: userId,
      });
      await review.save();
      return review;
    } catch (error) {
      throw error;
    }
  },

  updateReview: async (_, { id, review }) => {
    return await Review.findByIdAndUpdate(id, review, { new: true });
  },
};

export default Mutation;
