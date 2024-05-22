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
    const order = new Order({
      ...newOrder,
    });
    await order.save();
    return order;
  },

  addAddress: async (_, { newAddress }) => {
    const address = new Address({
      ...newAddress,
    });
    await address.save();
    return address;
  },

  updateAddress: async (_, { id, address }) => {
    return await Address.findByIdAndUpdate(id, address, { new: true });
  },

  deleteAddress: async (_, { id }) => {
    return await Address.findByIdAndDelete(id);
  },
};

export default Mutation;
