import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
  created_at: {
    type: Date,
    default: Date.now,
  },
  account_name: {
    type: String,
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

export const Account =
  mongoose.models.Account ?? mongoose.model("Account", accountSchema);
