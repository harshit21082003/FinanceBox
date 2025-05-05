import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  created_at: {
    type: Date,
    default: Date.now,
  },
  category_name: {
    type: String,
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export const Category =
  mongoose.models.Category ?? mongoose.model("Category", categorySchema);
