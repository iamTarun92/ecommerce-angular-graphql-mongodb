import {
  User,
  Post,
  Wishlist,
  Address,
  Order,
  Review,
} from "./mongo-schema.js";
import { sendEmail } from "./email.js";
import { securePassword, crateToken } from "../controllers/db.js";

const Mutation = {
  signUp: async (_, { newUser }) => {
    try {
      const { email, password } = newUser;

      // Check if the email is already registered
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error("Email already registered.");
      }

      // Hash the password
      const hashedPassword = await securePassword(password);

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

  requestPasswordReset: async (_, { email }) => {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("User not found");
      }
      const token = await crateToken(user._id);
      console.log(token);
      const updatedUser = await User.updateOne(
        { email },
        { $set: { token } },
        { new: true }
      );
      if (!updatedUser) {
        throw new Error("Failed to update user");
      }
      const resetURL = `http://localhost:4200/reset-password?token=${token}`;
      await sendEmail(
        email,
        "Password Reset Request",
        `Please use this link to reset your password: ${resetURL}`
      );

      return true;
    } catch (err) {
      console.error(err);
    }
  },

  resetPassword: async (_, { token, newPassword }) => {
    const user = await User.findOne({
      token,
    });

    if (!user) {
      throw new Error("Token is invalid or has expired");
    }

    const hashedPassword = await securePassword(newPassword);

    await User.updateOne(
      { email: user.email },
      {
        $set: { password: hashedPassword },
        $unset: { token: "" },
      }
    );

    return true;
  },
};

export default Mutation;
