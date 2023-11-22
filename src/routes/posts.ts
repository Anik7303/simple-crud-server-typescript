import { Router } from "express";

import { fetchAll, fetchOne } from "../controllers/posts";

const router = Router();

router.route("/").get(fetchAll);

router.route("/:id").get(fetchOne);

export default router;
