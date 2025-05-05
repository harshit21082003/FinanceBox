import Router from "express";
import { Category } from "../models/category.model.js";

const router = Router();

router.get("/category/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const resp = await Category.find({ user_id: userId }).sort({
      created_at: -1,
    });
    return res.json({ success: true, errors: [], data: { categories: resp } });
  } catch {
    return res.json({ success: false, errors: ["No a valid user id"] });
  }
});

router.post("/category", async (req, res) => {
  const { user_id, category_name } = req.body;
  if (!user_id || !category_name) {
    return res.json({ success: false, errors: ["Bad request"] });
  }
  const category = new Category({ ...req.body });
  await category.save();

  return res.json({
    success: true,
    errors: [],
    data: {
      category: category,
    },
  });
});

router.delete("/category/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const resp = await Category.deleteOne({ _id: id });
    if (resp.deletedCount > 0) {
      return res.json({ success: true, errors: [] });
    }
    return res.json({ success: false, errors: ["No record found"] });
  } catch {
    return res.json({ success: false, errors: ["Invalid category ID"] });
  }
});

export default router;
