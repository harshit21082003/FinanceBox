import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyUser = async (req, res, next) => {
  let token = "";
  try {
    token = req.headers["authorization"].split(" ").pop();
  } catch {
    return res.json({ success: false, errors: ["Not authorized"] });
  }

  const data = jwt.verify(token, process.env.JWT_SECRET);

  try {
    const resp = await User.findOne({ _id: data._id });
    if (resp) {
      return next();
    }
    return res.json({ success: false, errors: ["Not found"] });
  } catch {
    return res.json({ success: false, errors: ["Not a valid user ID"] });
  }
};
