import { Router } from "express";
import { Transaction } from "../models/transaction.model.js";
import { encrypt, decrypt } from "../middleware/encryptionHandler.js";

const router = Router();

// Fetch all transactions for a user (decrypted amounts)
router.get("/transaction/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const transactions = await Transaction.find({ user_id: userId }).sort({
      created_at: -1,
    });

    const decryptedTransactions = transactions.map((transaction) => {
      const decryptedAmount = decrypt({
        iv: transaction.iv,
        financeData: transaction.amount,
      });

      return {
        ...transaction._doc, // Keep other fields intact
        amount: decryptedAmount, // Replace encrypted amount with decrypted value
      };
    });

    return res.json({
      success: true,
      errors: [],
      data: { transactions: decryptedTransactions },
    });
  } catch {
    return res.json({ success: false, errors: ["Invalid user ID"] });
  }
});

// Fetch limited transactions for a user (decrypted amounts)
router.get("/transaction/:userId/:limit", async (req, res) => {
  const { userId, limit } = req.params;
  try {
    const transactions = await Transaction.find({ user_id: userId }, null, {
      limit,
    }).sort({ created_at: -1 });

    const decryptedTransactions = transactions.map((transaction) => {
      const decryptedAmount = decrypt({
        iv: transaction.iv,
        financeData: transaction.amount,
      });

      return {
        ...transaction._doc, // Keep other fields intact
        amount: decryptedAmount, // Replace encrypted amount with decrypted value
      };
    });

    return res.json({
      success: true,
      errors: [],
      data: { transactions: decryptedTransactions },
    });
  } catch {
    return res.json({ success: false, errors: ["Invalid user ID"] });
  }
});

// Fetch income and expenses for a user (decrypted amounts)
router.get("/details/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const transactions = await Transaction.find({ user_id: userId });

    let income = 0,
      expenses = 0;

    transactions.map((transaction) => {
      const decryptedAmount = decrypt({
        iv: transaction.iv,
        financeData: transaction.amount,
      });
      const amount = parseFloat(decryptedAmount);
      if (amount < 0) {
        expenses += amount;
      } else {
        income += amount;
      }
    });

    const response = {
      income,
      expenses,
    };

    return res.json({
      success: true,
      errors: [],
      data: { ...response },
    });
  } catch {
    return res.json({ success: false, errors: ["Invalid user ID"] });
  }
});

// Add a new transaction (encrypt the amount)
router.post("/transaction", async (req, res) => {
  const { amount, payee, account, category, user_id } = req.body;
  if (!amount || !payee || !account || !category || !user_id) {
    return res.json({ success: false, errors: ["Bad Request"] });
  }

  // Encrypt the transaction amount
  const encryptedAmount = encrypt(amount.toString());

  const transaction = new Transaction({
    ...req.body,
    amount: encryptedAmount.financeData, // Save encrypted financeData (amount)
    iv: encryptedAmount.iv, // Save initialization vector (iv)
  });

  await transaction.save();
  res.json({
    success: true,
    errors: [],
    data: { transaction },
  });
});

// Delete a transaction
router.delete("/transaction/:transactionId", async (req, res) => {
  const { transactionId } = req.params;

  try {
    const result = await Transaction.deleteOne({ _id: transactionId });
    if (result.deletedCount > 0) {
      return res.json({ success: true, errors: [] });
    }
    return res.json({ success: false, errors: ["No record found"] });
  } catch {
    return res.json({ success: false, errors: ["Invalid Transaction ID"] });
  }
});

export default router;
