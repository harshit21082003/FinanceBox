import Router from "express";
import { Account } from "../models/account.model.js";

const router = Router();

router.get("/account/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const resp = await Account.find({ user_id: userId }).sort({
      created_at: -1,
    });
    return res.json({ success: true, errors: [], data: { accounts: resp } });
  } catch {
    return res.json({ success: false, errors: ["No a valid user id"] });
  }
});

router.post("/account", async (req, res) => {
  const { user_id, account_name } = req.body;
  if (!user_id || !account_name) {
    return res.json({ success: false, errors: ["Bad request"] });
  }
  const account = new Account({ ...req.body });
  await account.save();

  return res.json({
    success: true,
    errors: [],
    data: {
      account,
    },
  });
});

router.delete("/account/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const resp = await Account.deleteOne({ _id: id });
    if (resp.deletedCount > 0) {
      return res.json({ success: true, errors: [] });
    }
    return res.json({ success: false, errors: ["No record found"] });
  } catch {
    return res.json({ success: false, errors: ["Invalid user ID"] });
  }
});

export default router;
