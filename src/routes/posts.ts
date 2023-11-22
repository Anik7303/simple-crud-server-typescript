import { Router } from "express";

import { create, fetchAll, fetchOne, remove } from "../controllers/posts";
import { requireAuth } from "../middlewares/auth";

const router = Router();

router.route("/").get(fetchAll).post(requireAuth, create);

router.route("/:id").get(fetchOne).delete(requireAuth, remove);

export default router;
