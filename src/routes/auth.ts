import { Router } from "express";

import { requestLogin, requestSignup } from "../controllers/auth";

const router = Router();

router.route("/login").post(requestLogin);
router.route("/register").post(requestSignup);

export default router;
