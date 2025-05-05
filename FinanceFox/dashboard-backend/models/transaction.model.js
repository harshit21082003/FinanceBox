import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  created_at: {
    type: Date,
    default: Date.now,
  },
  category: {
    type: String,
    required: true,
  },
  payee: {
    type: String,
    required: true,
  },
  amount: {
    type: String,
    required: true,
  },
  iv:{
    type: String,
    required: true,
  },
  account: {
    // type: mongoose.Schema.Types.ObjectId,
    // ref: "Account",
    type: String,
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

export const Transaction =
  mongoose.models.Transaction ??
  mongoose.model("Transaction", transactionSchema);
