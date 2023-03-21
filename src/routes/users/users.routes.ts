import { auth } from "../../helper/auth.js";
import { commonResponse } from "../../helper/response.js";
import { getUserList, userLogin, userRegistration } from "./users.js";
import express from "express";

const router = express.Router();

router.post("/signup", async (req, res) => {
  const data = await userRegistration(req.body);
  return commonResponse(data, res);
});

router.post("/signin", async (req, res) => {
  const data = await userLogin(req.body);
  return commonResponse(data, res);
});

router.get("/getusers", auth, async (req, res) => {
  const data = await getUserList(req.query);
  return commonResponse(data, res);
});

export { router as userRouter };
