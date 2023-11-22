import { Router } from "express";

import {
  create,
  fetchAll,
  fetchOne,
  remove,
  update,
} from "../controllers/posts";
import { requireAuth } from "../middlewares/auth";

const router = Router();

router.route("/").get(fetchAll).post(requireAuth, create);

router
  .route("/:id")
  .get(fetchOne)
  .patch(requireAuth, update)
  .delete(requireAuth, remove);

export default router;
